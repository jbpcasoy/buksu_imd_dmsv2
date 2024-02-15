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
import iMStatusNormalizer from "@/services/iMStatusNormalizer";
import useSerialNumberIM from "@/hooks/useSerialNumberIM";

export interface IMTableProps {
  count: number;
  iMs: IM[];
  title: string;
  onChangeState: (state: any) => any;
  enableAdd?: boolean;
}

export default function IMTable({
  count,
  iMs,
  title,
  onChangeState,
  enableAdd = true,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          ...(Object.fromEntries(
            Object.entries(prev.filter).map(([key]) => [
              key,
              key === field ? value : "",
            ])
          ) as any),
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
  const handleStatusChange = (status: string) => {
    setState((prev) => ({
      ...prev,
      filter: {
        ...prev.filter,
        status,
      },
    }));
  };

  return (
    <div className="text-sm border border-palette_grey rounded h-full flex flex-col overflow-auto">
      <div className="p-1 bg-palette_grey bg-opacity-10">
        <div className="flex overflow-auto space-x-1">
          <div className="flex-1 flex items-center space-x-1">
            <h2 className="text-base border-b-2 border-palette_orange inline pb-1 px-2 whitespace-nowrap">
              {title}
            </h2>
            <div className="flex flex-row space-x-1">
              <FilterSelector onFilterChange={handleFilterChange} />

              <SortSelector onSortChange={handleSortChange} />
              <StatusSelector onStatusChange={handleStatusChange} />
            </div>
          </div>
          {enableAdd && <AddIM />}
        </div>
      </div>
      <div className="sm:flex-1 sm:h-full overflow-auto">
        <table className="table-auto w-full overflow-auto ">
          <thead className="bg-palette_grey bg-opacity-10 p-1">
            <tr>
              <th className="font-normal">TITLE</th>
              <th className="font-normal">SERIAL NO.</th>
              <th className="font-normal">TYPE</th>
              <th className="font-normal">AUTHOR</th>
              <th className="font-normal">DEPARTMENT</th>
              <th className="font-normal">COLLEGE</th>
              <th className="font-normal">STATUS</th>
              <th className="font-normal">DATE CREATED</th>
              <th className="font-normal">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="py-1 h-full overflow-auto">
            {iMs.map((iM) => {
              return <IMItem iM={iM} key={iM.id} />;
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end items-center space-x-1 p-1">
        <p className="text-xs">
          {state.skip} - {state.skip + state.take} of {count}
        </p>
        <button
          disabled={state.skip - state.take < 0}
          className="rounded bg-palette_blue text-palette_white fill-palette_white flex space-x-1 items-center px-1 hover:bg-opacity-90 disabled:bg-opacity-50"
          onClick={previousHandler}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 448 512"
          >
            <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
          </svg>
          <span>Previous</span>
        </button>
        <button
          disabled={state.skip + state.take >= count}
          className="rounded bg-palette_blue text-palette_white fill-palette_white flex space-x-1 items-center px-1 hover:bg-opacity-90 disabled:bg-opacity-50"
          onClick={nextHandler}
        >
          <span>Next</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 448 512"
            className="fill-inherit"
          >
            <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
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
  const serialNumber = useSerialNumberIM({
    id: iM.id,
  });

  return (
    <tr key={iM.id} className="border-b">
      <td>
        <div className="py-1 px-2 pl-4">{iM.title}</div>
      </td>
      <td>
        <div className="py-1 px-2 pl-4">{serialNumber?.value}</div>
      </td>
      <td>
        <div className="py-1 px-2">{iM.type}</div>
      </td>
      <td>
        <div className="py-1 px-2">{user?.name}</div>
      </td>
      <td>
        <div className="py-1 px-2">{department?.name}</div>
      </td>
      <td>
        <div className="py-1 px-2">{college?.name}</div>
      </td>
      <td>
        <div className="py-1 px-2">
          <IMStatus iM={iM} />
        </div>
      </td>
      <td>
        <div className="py-1 px-2">
          {DateTime.fromJSDate(new Date(iM.createdAt)).toFormat("D | t")}
        </div>
      </td>
      <td>
        <div className="py-1 flex justify-center items-center">
          <Link
            href={`/im/${iM.id}`}
            className="group rounded bg-palette_blue text-palette_white py-1 px-2 flex justify-center items-center space-x-1"
          >
            <span>View</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 576 512"
              className="fill-palette_white hidden group-hover:inline"
            >
              <path d="M249.6 471.5c10.8 3.8 22.4-4.1 22.4-15.5V78.6c0-4.2-1.6-8.4-5-11C247.4 52 202.4 32 144 32C93.5 32 46.3 45.3 18.1 56.1C6.8 60.5 0 71.7 0 83.8V454.1c0 11.9 12.8 20.2 24.1 16.5C55.6 460.1 105.5 448 144 448c33.9 0 79 14 105.6 23.5zm76.8 0C353 462 398.1 448 432 448c38.5 0 88.4 12.1 119.9 22.6c11.3 3.8 24.1-4.6 24.1-16.5V83.8c0-12.1-6.8-23.3-18.1-27.6C529.7 45.3 482.5 32 432 32c-58.4 0-103.4 20-123 35.6c-3.3 2.6-5 6.8-5 11V456c0 11.4 11.7 19.3 22.4 15.5z" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16"
              width="14"
              viewBox="0 0 448 512"
              className="fill-palette_white group-hover:hidden"
            >
              <path d="M96 0C43 0 0 43 0 96V416c0 53 43 96 96 96H384h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V384c17.7 0 32-14.3 32-32V32c0-17.7-14.3-32-32-32H384 96zm0 384H352v64H96c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16zm16 48H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
            </svg>
          </Link>
        </div>
      </td>
    </tr>
  );
}

function IMStatus({ iM }: { iM: IM }) {
  const iMStatus = useIMStatus({ id: iM.id });
  return <>{iMStatusNormalizer(iMStatus)}</>;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedField, filterValue]);

  return (
    <div className="flex space-x-1">
      <select
        onChange={handleFieldChange}
        className="py-1 rounded-s bg-inherit focus:border-palette_grey focus:ring-palette_grey"
      >
        <option value="">Select field</option>
        <option value="title">Title</option>
        <option value="userName">Author</option>
        <option value="departmentName">Department</option>
        <option value="collegeName">College</option>
      </select>
      <input
        type="text"
        placeholder="Search"
        value={filterValue}
        className="bg-inherit border-b py-1 rounded-e focus:border-palette_grey focus:ring-palette_grey"
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedField, sortDirection]);

  return (
    <div className="flex space-x-1">
      <select
        onChange={handleFieldChange}
        value={selectedField}
        className="py-1 rounded-s bg-inherit focus:border-palette_grey focus:ring-palette_grey"
      >
        <option value="title">Title</option>
        <option value="createdAt">Date Created</option>
        <option value="userName">Author</option>
        <option value="departmentName">Department</option>
        <option value="collegeName">College</option>
      </select>
      <select
        onChange={handleDirectionChange}
        value={sortDirection}
        className="py-1 rounded-e bg-inherit focus:border-palette_grey focus:ring-palette_grey"
      >
        <option value="asc">↑</option>
        <option value="desc">↓</option>
      </select>
    </div>
  );
}

function AddIM() {
  const [loading, setLoading] = useState(false);

  axios.interceptors.request.use(
    function (config) {
      setLoading(true);
      return config;
    },
    function (error) {
      console.log({ error });
      setLoading(false);
      return Promise.reject(error);
    }
  );
  axios.interceptors.response.use(
    function (response) {
      setLoading(false);
      return response;
    },
    function (error) {
      console.log({ error });
      setLoading(false);
      return Promise.reject(error);
    }
  );
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
        disabled={loading}
        className="rounded bg-palette_blue text-palette_white py-1 px-2 flex justify-center items-center space-x-1"
        onClick={() => setState({ addIMOpen: true })}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="1em"
          viewBox="0 0 448 512"
          className="fill-palette_white"
        >
          <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
        </svg>
        <span className="whitespace-nowrap">Add IM</span>
      </button>
      {state.addIMOpen && (
        <Modal title="ADD IM" onClose={() => setState({ addIMOpen: false })}>
          <form onSubmit={formik.handleSubmit} noValidate>
            <div className="text-base flex flex-col space-y-1">
              <input
                placeholder="Title"
                {...formik.getFieldProps("title")}
                className="py-1 rounded"
              />
              <select
                {...formik.getFieldProps("type")}
                className="rounded block py-1"
              >
                <option value="MODULE">Module</option>
                <option value="COURSE_FILE">Course File</option>
                <option value="WORKTEXT">Worktext</option>
                <option value="TEXTBOOK">Textbook</option>
              </select>

              <button
                disabled={loading}
                type="submit"
                className="bg-palette_blue text-palette_white rounded px-2 py-1 flex items-center space-x-2 justify-center hover:bg-opacity-90"
              >
                <span>Submit</span>
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="1em"
                    viewBox="0 0 448 512"
                    className="fill-palette_white"
                  >
                    <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
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

interface StatusSelectorProps {
  onStatusChange: (status: string) => void;
}
function StatusSelector({ onStatusChange }: StatusSelectorProps) {
  const statuses = [
    "IMPLEMENTATION_DRAFT",
    "IMPLEMENTATION_DEPARTMENT_REVIEW",
    "IMPLEMENTATION_DEPARTMENT_REVIEWED",
    "IMPLEMENTATION_DEPARTMENT_REVISED",
    "IMPLEMENTATION_DEPARTMENT_COORDINATOR_ENDORSED",
    "IMPLEMENTATION_DEPARTMENT_DEAN_ENDORSED",
    "IMPLEMENTATION_CITL_REVIEWED",
    "IMPLEMENTATION_CITL_REVISED",
    "IMPLEMENTATION_CITL_IDD_COORDINATOR_ENDORSED",
    "IMPLEMENTATION_CITL_DIRECTOR_ENDORSED",
    "IMERC_QAMIS_REVISED",
    "IMERC_QAMIS_DEPARTMENT_ENDORSED",
    "IMERC_CITL_REVIEWED",
    "IMERC_CITL_REVISED",
    "IMERC_CITL_IDD_COORDINATOR_ENDORSED",
    "IMERC_CITL_DIRECTOR_ENDORSED",
  ];
  return (
    <select
      onChange={(e) => onStatusChange(e.target.value)}
      className="py-1 rounded bg-inherit focus:border-palette_grey focus:ring-palette_grey w-40"
    >
      <option value="">Select Status</option>
      {statuses.map((status) => {
        return (
          <option value={status} key={status}>
            {iMStatusNormalizer(status)}
          </option>
        );
      })}
    </select>
  );
}
