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
import { ChangeEventHandler, useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import Modal from "./Modal";
import { SnackbarContext } from "./SnackbarProvider";

interface AdminIMTableProps {
  count: number;
  iMs: IM[];
  title: string;
  onChangeState: (state: any) => any;
  enableAdd?: boolean;
}

export default function AdminIMTable({
  count,
  iMs,
  title,
  onChangeState,
  enableAdd = true,
}: AdminIMTableProps) {
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
    <div className="flex flex-col space-y-4 h-full">
      <div className="p-1 ">
        <div className="flex">
          <div className="flex-1 flex items-center space-x-4">
            <div className="flex item-center justify-center p-3 rounded-lg bg-palette_white space-x-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                className="w-5 h-5 stroke-palette_grey"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
              <h2 className="font-bold">{title}</h2>
            </div>
            <div className="flex flex-row h-full space-x-4">
              <FilterSelector onFilterChange={handleFilterChange} />

              <SortSelector onSortChange={handleSortChange} />
              <StatusSelector onStatusChange={handleStatusChange} />
            </div>
          </div>
          {enableAdd && <AddIM />}
        </div>
      </div>
      <div className="rounded-2xl p-4 bg-palette_white h-full flex flex-col overflow-auto flex-1">
        <div className="flex-1 h-full overflow-auto">
          <table className="table-auto w-full overflow-auto ">
            <thead className="p-1">
              <tr>
                <th className="font-medium text-left">TITLE</th>
                <th className="font-medium text-left">SERIAL No.</th>
                <th className="font-medium text-left">TYPE</th>
                <th className="font-medium text-left">AUTHOR</th>
                <th className="font-medium text-left">DEPARTMENT</th>
                <th className="font-medium text-left">COLLEGE</th>
                <th className="font-medium text-left">STATUS</th>
                <th className="font-medium text-left">DATE CREATED</th>
                <th className="font-medium text-center">ACTIONS</th>
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
        <div className="py-1 px-2 ">
          {DateTime.fromJSDate(new Date(iM.createdAt)).toFormat("D | t")}
        </div>
      </td>
      <td>
        <div className="py-1 flex justify-center items-center">
          <Link
            href={`/admin/im/${iM.id}`}
            className="rounded bg-palette_blue text-palette_white py-1 px-2 flex justify-center items-center space-x-1"
          >
            <span>VIEW</span>
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
    <div className="flex">
      <select
        onChange={handleFieldChange}
        className="py-1 rounded-s-lg bg-palette_white  focus:border-palette_grey focus:ring-palette_grey"
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
        className="bg-inherit border-b py-1 rounded-e-lg bg-palette_white focus:border-palette_grey focus:ring-palette_grey"
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
        className="py-1 rounded-s-lg bg-palette_white bg-inherit focus:border-palette_grey focus:ring-palette_grey"
      >
        <option value="title">Title</option>
        <option value="createdAt">Date Created</option>
        <option value="userName">Author</option>
        <option value="departmentName">Department Name</option>
        <option value="collegeName">College Name</option>
      </select>
      <select
        onChange={handleDirectionChange}
        value={sortDirection}
        className="py-1 rounded-e-lg bg-palette_white bg-inherit focus:border-palette_grey focus:ring-palette_grey"
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
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
          router.push(`/admin/im/${iM.id}`);
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
        <span>Add IM</span>
      </button>
      {state.addIMOpen && (
        <Modal title="ADD IM" onClose={() => setState({ addIMOpen: false })}>
          <form onSubmit={formik.handleSubmit} noValidate>
            <div className=" flex flex-col space-y-1">
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
      className="py-1 rounded-lg bg-palette_white  focus:border-palette_grey focus:ring-palette_grey"
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
