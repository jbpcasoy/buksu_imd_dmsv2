import ActiveFacultyContext from "@/contexts/ActiveFacultyContext";
import useCollegeIM from "@/hooks/useCollegeIM";
import useDepartmentIM from "@/hooks/useDepartmentIM";
import useIMStatus from "@/hooks/useIMStatus";
import useSerialNumberIM from "@/hooks/useSerialNumberIM";
import useUserFaculty from "@/hooks/useUserFaculty";
import iMStatusNormalizer from "@/services/iMStatusNormalizer";
import { IM } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import { DateTime } from "luxon";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  ChangeEventHandler,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import * as Yup from "yup";
import Modal from "./Modal";
import { SnackbarContext } from "./SnackbarProvider";

interface IMTableProps {
  count: number;
  iMs: IM[];
  title: string;
  onChangeState: (state: any) => any;
  enableAdd?: boolean;
  icon?: ReactNode;
}

export default function IMTable({
  count,
  iMs,
  title,
  onChangeState,
  enableAdd = true,
  icon,
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
    <div className="bg-palette_white rounded-2xl h-full flex flex-col overflow-auto p-4">
      <div className="pb-4 overflow-auto">
        <div className="flex space-x-1">
          <div className="flex-1 flex items-center space-x-8">
            <div className="flex space-x-2 items-center justify-center border border-palette_orange rounded-lg p-2 ">
              {icon && <div className="stroke-palette_grey">{icon}</div>}
              <h2 className="inline whitespace-nowrap font-bold">{title}</h2>
            </div>
            <div className="flex flex-row space-x-4">
              <FilterSelector onFilterChange={handleFilterChange} />

              <SortSelector onSortChange={handleSortChange} />
              <StatusSelector onStatusChange={handleStatusChange} />
            </div>
          </div>
          {enableAdd && <AddIM />}
        </div>
      </div>
      <div className="md:flex-1 md:h-full overflow-auto">
        <table className="table-auto lg:table-fixed w-full overflow-auto ">
          <thead className="p-1 border-b">
            <tr>
              <th className="font-normal text-left truncate" title="TITLE">
                TITLE
              </th>
              <th className="font-normal text-left truncate" title="SERIAL">
                SERIAL NO.
              </th>
              <th className="font-normal text-left truncate" title="TYPE">
                TYPE
              </th>
              <th className="font-normal text-left truncate" title="AUTHOR">
                AUTHOR
              </th>
              <th className="font-normal text-left truncate" title="DEPARTMENT">
                DEPARTMENT
              </th>
              <th className="font-normal text-left truncate" title="COLLEGE">
                COLLEGE
              </th>
              <th className="font-normal text-left truncate" title="STATUS">
                STATUS
              </th>
              <th className="font-normal text-left truncate" title="DATE">
                DATE CREATED
              </th>
              <th className="font-normal text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="py-1 h-full overflow-auto">
            {iMs.map((iM) => {
              return <IMItem iM={iM} key={iM.id} />;
            })}

            {count < 1 && (
              <tr className="border-b uppercase  text-center">
                <td colSpan={9} className="font-bold p-5 text-palette_grey">
                  NO IMS TO DISPLAY
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end items-center space-x-1 p-1">
        <p className="">
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
  const iMStatus = useIMStatus({ id: iM.id });

  return (
    <tr key={iM.id} className="border-b uppercase">
      <td className="p-1 text-nowrap truncate text-sm" title={iM.title}>
        {iM.title}
      </td>
      <td
        className="p-1 text-nowrap truncate text-sm"
        title={serialNumber?.value}
      >
        {serialNumber?.value}
      </td>
      <td className="p-1 text-nowrap truncate text-sm" title={iM.type}>
        {iM.type}
      </td>
      <td className="p-1 text-nowrap truncate text-sm" title={user?.name ?? ""}>
        {user?.name}
      </td>
      <td className="p-1 text-nowrap truncate text-sm" title={department?.name}>
        {department?.name}
      </td>
      <td className="p-1 text-nowrap truncate text-sm" title={college?.name}>
        {college?.name}
      </td>
      <td
        className="p-1 text-nowrap truncate text-sm"
        title={iMStatusNormalizer(iMStatus)}
      >
        {iMStatusNormalizer(iMStatus)}
      </td>
      <td
        className="p-1 text-nowrap truncate text-sm"
        title={DateTime.fromJSDate(new Date(iM.createdAt)).toFormat("D | t")}
      >
        {DateTime.fromJSDate(new Date(iM.createdAt)).toFormat("D | t")}
      </td>
      <td className="p-1 flex justify-center items-center">
        <Link
          href={`/im/${iM.id}`}
          className="group rounded bg-palette_blue text-palette_white py-1 px-2 flex justify-center items-center space-x-1"
        >
          <span>View</span>
        </Link>
      </td>
    </tr>
  );
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
    <div className="flex">
      <select
        onChange={handleFieldChange}
        className="py-1 rounded-l-lg bg-inherit border-r-0 focus:border-palette_grey focus:outline-0 focus:ring-0"
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
        className="bg-inherit border-b py-1 rounded-r-lg focus:border-palette_grey focus:outline-0 focus:ring-0 "
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
    <div className="flex">
      <select
        onChange={handleFieldChange}
        value={selectedField}
        className="py-1 rounded-l-lg bg-inherit border-r-0 focus:border-palette_grey focus:outline-0 focus:ring-0"
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
        className="py-1 rounded-r-lg bg-inherit focus:border-palette_grey focus:outline-0 focus:ring-0"
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
        className="rounded-lg bg-palette_blue text-palette_white py-1 px-2 flex justify-center items-center space-x-1"
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
            <div className="flex flex-col space-y-1">
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
  const [state, setState] = useState<{status: undefined | string}>({status: undefined});

  useEffect(() => {
    if(!state?.status) return;

    onStatusChange(state.status);
  }, [state.status])

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
    <div className="flex items-center justify-center border border-current rounded-lg space-x-2 pl-4 p-1 w-40 " title={iMStatusNormalizer(state.status)}>
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.5 3H17.25M7.5 3C7.5 3.39782 7.34196 3.77936 7.06066 4.06066C6.77936 4.34196 6.39782 4.5 6 4.5C5.60218 4.5 5.22064 4.34196 4.93934 4.06066C4.65804 3.77936 4.5 3.39782 4.5 3M7.5 3C7.5 2.60218 7.34196 2.22064 7.06066 1.93934C6.77936 1.65804 6.39782 1.5 6 1.5C5.60218 1.5 5.22064 1.65804 4.93934 1.93934C4.65804 2.22064 4.5 2.60218 4.5 3M4.5 3H0.75M7.5 15H17.25M7.5 15C7.5 15.3978 7.34196 15.7794 7.06066 16.0607C6.77936 16.342 6.39782 16.5 6 16.5C5.60218 16.5 5.22064 16.342 4.93934 16.0607C4.65804 15.7794 4.5 15.3978 4.5 15M7.5 15C7.5 14.6022 7.34196 14.2206 7.06066 13.9393C6.77936 13.658 6.39782 13.5 6 13.5C5.60218 13.5 5.22064 13.658 4.93934 13.9393C4.65804 14.2206 4.5 14.6022 4.5 15M4.5 15H0.75M13.5 9H17.25M13.5 9C13.5 9.39782 13.342 9.77936 13.0607 10.0607C12.7794 10.342 12.3978 10.5 12 10.5C11.6022 10.5 11.2206 10.342 10.9393 10.0607C10.658 9.77936 10.5 9.39782 10.5 9M13.5 9C13.5 8.60218 13.342 8.22064 13.0607 7.93934C12.7794 7.65804 12.3978 7.5 12 7.5C11.6022 7.5 11.2206 7.65804 10.9393 7.93934C10.658 8.22064 10.5 8.60218 10.5 9M10.5 9H0.75"
          stroke="black"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <select
        onChange={(e) => {
          setState({status: e.target.value as string});
        }}
        className="py-1 rounded-r-lg bg-inherit focus:border-none focus:outline-none focus:ring-0  border-0 w-full"
      >
        <option value="">Status</option>
        {statuses.map((status) => {
          return (
            <option value={status} key={status}>
              {iMStatusNormalizer(status)}
            </option>
          );
        })}
      </select>
    </div>
  );
}
