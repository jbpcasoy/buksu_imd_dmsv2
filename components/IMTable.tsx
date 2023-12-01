import useIMStatus from "@/hooks/useIMStatus";
import { IM } from "@prisma/client";
import Link from "next/link";
import { ChangeEventHandler, useContext, useEffect, useState } from "react";
import { DateTime } from "luxon";
import useUserFaculty from "@/hooks/useUserFaculty";
import useDepartmentIM from "@/hooks/useDepartmentIM";
import useCollegeIM from "@/hooks/useCollegeIM";
import axios from "axios";
import { useRouter } from "next/router";
import ActiveFacultyContext from "@/contexts/ActiveFacultyContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import Modal from "./Modal";
import { SnackbarContext } from "./SnackbarProvider";

export interface IMTableProps {
  count: number;
  iMs: IM[];
  title: string;
  onChangeState: (state: any) => any;
}

export default function IMTable({
  count,
  iMs,
  title,
  onChangeState,
}: IMTableProps) {
  const [state, setState] = useState({
    take: 10,
    skip: 0,
    filter: {
      title: "",
      userName: "",
      departmentName: "",
      collegeName: "",
    },
    sort: {
      field: "createdAt",
      direction: "desc",
    },
  });

  useEffect(() => {
    onChangeState(state);
  }, [state]);

  const nextHandler = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return { ...prev, skip: nextVal < count ? nextVal : prev.skip };
    });
  };

  const previousHandler = () => {
    setState((prev) => {
      const nextVal = prev.skip - prev.take;
      console.log({ prev, nextVal });

      return { ...prev, skip: nextVal >= 0 ? nextVal : prev.skip };
    });
  };

  const handleFilterChange = (field: string, value: string) => {
    if (field === "") {
      setState((prev) => ({
        ...prev,
        filter: {
          collegeName: "",
          departmentName: "",
          title: "",
          userName: "",
        },
      }));
    } else {
      setState((prev) => ({
        ...prev,
        filter: {
          ...prev.filter,
          [field]: value,
        },
      }));
    }
  };

  const handleSortChange = (field: string, direction: "asc" | "desc") => {
    setState((prev) => ({
      ...prev,
      sort: {
        field,
        direction,
      },
    }));
  };

  return (
    <div className='text-sm border border-palette_grey rounded h-full flex flex-col overflow-auto'>
      <div className='p-1 bg-palette_grey bg-opacity-10'>
        <div className='flex'>
          <div className='flex-1 flex items-center space-x-1'>
            <h2 className='text-base border-b-2 border-palette_orange inline pb-1 px-2'>
              {title}
            </h2>
            <div className='flex flex-row space-x-1'>
              <FilterSelector onFilterChange={handleFilterChange} />

              <SortSelector onSortChange={handleSortChange} />
            </div>
          </div>
          <AddIM />
        </div>
      </div>
      <div className='flex-1 h-full overflow-auto'>
        <table className='table-auto h-full w-full overflow-auto '>
          <thead className='bg-palette_grey bg-opacity-10 p-1'>
            <tr>
              <th className='font-normal'>TITLE</th>
              <th className='font-normal'>TYPE</th>
              <th className='font-normal'>AUTHOR</th>
              <th className='font-normal'>DEPARTMENT</th>
              <th className='font-normal'>COLLEGE</th>
              <th className='font-normal'>STATUS</th>
              <th className='font-normal'>DATE CREATED</th>
              <th className='font-normal'>ACTIONS</th>
            </tr>
          </thead>
          <tbody className='py-1 h-full overflow-auto'>
            {iMs.map((iM) => {
              return <IMItem iM={iM} key={iM.id} />;
            })}
          </tbody>
        </table>
      </div>

      <div className='flex justify-end items-center space-x-1 p-1'>
        <p className='text-xs'>
          {state.skip} - {state.skip + state.take} of {count}
        </p>
        <button
          disabled={state.skip - state.take < 0}
          className='rounded bg-palette_blue text-palette_white fill-palette_white flex space-x-1 items-center px-1 hover:bg-opacity-90 disabled:bg-opacity-50'
          onClick={previousHandler}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            height='1em'
            viewBox='0 0 448 512'
          >
            <path d='M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z' />
          </svg>
          <span>Previous</span>
        </button>
        <button
          disabled={state.skip + state.take >= count}
          className='rounded bg-palette_blue text-palette_white fill-palette_white flex space-x-1 items-center px-1 hover:bg-opacity-90 disabled:bg-opacity-50'
          onClick={nextHandler}
        >
          <span>Next</span>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            height='1em'
            viewBox='0 0 448 512'
            className='fill-inherit'
          >
            <path d='M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z' />
          </svg>
        </button>
      </div>
    </div>
  );
}

function IMItem({ iM }: { iM: IM }) {
  const user = useUserFaculty({
    id: iM.facultyId,
  });
  const department = useDepartmentIM({ id: iM.id });
  const college = useCollegeIM({ id: iM.id });

  return (
    <tr key={iM.id} className='border-b'>
      <td>
        <div className='py-1 pl-4'>{iM.title}</div>
      </td>
      <td>
        <div className='py-1'>{iM.type}</div>
      </td>
      <td>
        <div className='py-1'>{user?.name}</div>
      </td>
      <td>
        <div className='py-1'>{department?.name}</div>
      </td>
      <td>
        <div className='py-1'>{college?.name}</div>
      </td>
      <td>
        <div className='py-1'>
          <IMStatus iM={iM} />
        </div>
      </td>
      <td>
        <div className='py-1'>
          {DateTime.fromJSDate(new Date(iM.createdAt)).toRelative()}
        </div>
      </td>
      <td>
        <div className='py-1 flex justify-center items-center'>
          <Link
            href={`/im/${iM.id}`}
            className='rounded bg-palette_blue text-palette_white py-1 px-2 flex justify-center items-center space-x-1'
          >
            <span>View</span>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              height='1em'
              viewBox='0 0 576 512'
              className='fill-palette_white'
            >
              <path d='M249.6 471.5c10.8 3.8 22.4-4.1 22.4-15.5V78.6c0-4.2-1.6-8.4-5-11C247.4 52 202.4 32 144 32C93.5 32 46.3 45.3 18.1 56.1C6.8 60.5 0 71.7 0 83.8V454.1c0 11.9 12.8 20.2 24.1 16.5C55.6 460.1 105.5 448 144 448c33.9 0 79 14 105.6 23.5zm76.8 0C353 462 398.1 448 432 448c38.5 0 88.4 12.1 119.9 22.6c11.3 3.8 24.1-4.6 24.1-16.5V83.8c0-12.1-6.8-23.3-18.1-27.6C529.7 45.3 482.5 32 432 32c-58.4 0-103.4 20-123 35.6c-3.3 2.6-5 6.8-5 11V456c0 11.4 11.7 19.3 22.4 15.5z' />
            </svg>
          </Link>
        </div>
      </td>
    </tr>
  );
}

function IMStatus({ iM }: { iM: IM }) {
  const iMStatus = useIMStatus({ id: iM.id });
  return <>{iMStatus}</>;
}

// FilterSelector.tsx
// import React, { ChangeEventHandler, useState } from 'react';

interface FilterSelectorProps {
  onFilterChange: (field: string, value: string) => void;
}

function FilterSelector({ onFilterChange }: FilterSelectorProps) {
  const [selectedField, setSelectedField] = useState("");
  const [filterValue, setFilterValue] = useState("");

  const handleFieldChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    if (e.target.value === "") {
      setSelectedField("");
      setFilterValue("");
    } else {
      setSelectedField(e.target.value);
    }
  };

  const handleValueChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setFilterValue(e.target.value ?? "");
  };

  useEffect(() => {
    onFilterChange(selectedField, filterValue);
  }, [selectedField, filterValue]);

  return (
    <div>
      <select
        onChange={handleFieldChange}
        className='py-1 rounded-s bg-inherit focus:border-palette_grey focus:ring-palette_grey'
      >
        <option value=''>Select field</option>
        <option value='title'>Title</option>
        <option value='userName'>User Name</option>
        <option value='departmentName'>Department Name</option>
        <option value='collegeName'>College Name</option>
      </select>
      <input
        type='text'
        placeholder='Search'
        value={filterValue}
        className='bg-inherit border-b py-1 rounded-e focus:border-palette_grey focus:ring-palette_grey'
        onChange={handleValueChange}
      />
    </div>
  );
}

interface SortSelectorProps {
  onSortChange: (field: string, direction: "asc" | "desc") => void;
}
function SortSelector({ onSortChange }: SortSelectorProps) {
  const [selectedField, setSelectedField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleFieldChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setSelectedField(e.target.value);
  };

  const handleDirectionChange: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setSortDirection(e.target.value as "asc" | "desc");
  };

  useEffect(() => {
    onSortChange(selectedField, sortDirection);
  }, [selectedField, sortDirection]);

  return (
    <div>
      <select
        onChange={handleFieldChange}
        value={selectedField}
        className='py-1 rounded-s bg-inherit focus:border-palette_grey focus:ring-palette_grey'
      >
        <option value='title'>Title</option>
        <option value='createdAt'>Date Created</option>
        <option value='userName'>Author</option>
        <option value='departmentName'>Department Name</option>
        <option value='collegeName'>College Name</option>
      </select>
      <select
        onChange={handleDirectionChange}
        value={sortDirection}
        className='py-1 rounded-e bg-inherit focus:border-palette_grey focus:ring-palette_grey'
      >
        <option value='asc'>Ascending</option>
        <option value='desc'>Descending</option>
      </select>
    </div>
  );
}

function AddIM() {
  const { addSnackbar } = useContext(SnackbarContext);
  const activeFaculty = useContext(ActiveFacultyContext);
  const router = useRouter();
  const [state, setState] = useState({ addIMOpen: false });

  const formik = useFormik({
    initialValues: {
      title: "",
      type: "MODULE",
    },
    validationSchema: Yup.object({
      title: Yup.string().required(),
      type: Yup.string()
        .oneOf(["MODULE", "COURSE_FILE", "WORKTEXT", "TEXTBOOK"])
        .required(),
    }),

    onSubmit: (values) => {
      axios
        .post<IM>("/api/im", { ...values, activeFacultyId: activeFaculty?.id })
        .then((res) => {
          const iM = res.data;
          addSnackbar("IM created successfully");
          router.push(`/im/${iM.id}`);
        })
        .catch((error) => {
          addSnackbar(
            error.response.data?.error?.message ?? "Failed to create IM",
            "error"
          );
        });
    },
  });

  return (
    <>
      <button
        className='rounded bg-palette_blue text-palette_white py-1 px-2 flex justify-center items-center space-x-1'
        onClick={() => setState({ addIMOpen: true })}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          height='1em'
          viewBox='0 0 448 512'
          className='fill-palette_white'
        >
          <path d='M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z' />
        </svg>
        <span>Add IM</span>
      </button>
      {state.addIMOpen && (
        <Modal title='ADD IM' onClose={() => setState({ addIMOpen: false })}>
          <form onSubmit={formik.handleSubmit} noValidate>
            <div className='text-base flex flex-col space-y-1'>
              <input
                placeholder='Title'
                {...formik.getFieldProps("title")}
                className='py-1 rounded'
              />
              <select
                {...formik.getFieldProps("type")}
                className='rounded block py-1'
              >
                <option value='MODULE'>Module</option>
                <option value='COURSE_FILE'>Course File</option>
                <option value='WORKTEXT'>Worktext</option>
                <option value='TEXTBOOK'>Textbook</option>
              </select>

              <button
                type='submit'
                className='bg-palette_blue text-palette_white rounded px-2 py-1 flex items-center space-x-2 justify-center hover:bg-opacity-90'
              >
                <span>Submit</span>
                <span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    height='1em'
                    viewBox='0 0 448 512'
                    className='fill-palette_white'
                  >
                    <path d='M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z' />
                  </svg>
                </span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
