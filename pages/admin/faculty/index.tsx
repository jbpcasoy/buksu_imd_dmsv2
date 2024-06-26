import AdminLayout from "@/components/AdminLayout";
import Confirmation from "@/components/Confirmation";
import DepartmentSelector from "@/components/DepartmentSelector";
import Modal from "@/components/Modal";
import { SnackbarContext } from "@/components/SnackbarProvider";
import UserSelector from "@/components/UserSelector";
import useActiveFacultyByFacultyId from "@/hooks/useActiveFacultyByFacultyId";
import useCollege from "@/hooks/useCollege";
import useDepartment from "@/hooks/useDepartment";
import useFaculties from "@/hooks/useFaculties";
import useUser from "@/hooks/useUser";
import { Faculty } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEventHandler, useContext, useEffect, useState } from "react";
import * as Yup from "yup";

export default function FacultiesPage() {
  const [state, setState] = useState({
    skip: 0,
    take: 10,
    filter: {
      name: "",
      departmentName: "",
      collegeName: "",
    },
    sort: {
      field: "name",
      direction: "asc",
    },
  });
  const { faculties, count } = useFaculties(state);

  const nextHandler = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return { ...prev, skip: nextVal <= count ? nextVal : prev.skip };
    });
  };

  const previousHandler = () => {
    setState((prev) => {
      const nextVal = prev.skip - prev.take;
      return { ...prev, skip: nextVal >= 0 ? nextVal : prev.skip };
    });
  };

  const handleFilterChange = (field: string, value: string) => {
    if (field === "") {
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
    <AdminLayout>
      <div className="flex flex-col h-full space-y-4">
        <div className="flex justify-between p-1">
          <div className="flex space-x-4 justify-between items-end h-full">
            <div className="inline-flex space-x-2 p-3 bg-palette_white justify-center items-center rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 stroke-palette_grey"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>

              <h2 className="font-bold">Faculty</h2>
            </div>

            <div className="flex flex-row space-x-4 h-full">
              <FilterSelector onFilterChange={handleFilterChange} />

              <SortSelector onSortChange={handleSortChange} />
            </div>
          </div>
          <AddModal />
        </div>
        <div className="flex-1 h-full flex flex-col bg-palette_white p-4 rounded-2xl">
          <div className="flex-1 h-full">
            <table className="table-auto w-full">
              <thead className=" bg-opacity-10">
                <tr>
                  <th className="font-medium text-left">USER</th>
                  <th className="font-medium text-left">DEPARTMENT</th>
                  <th className="font-medium text-left">COLLEGE</th>
                  <th className="font-medium text-center">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {faculties.map((faculty) => {
                  return <FacultyItem faculty={faculty} key={faculty.id} />;
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
    </AdminLayout>
  );
}

interface FacultyItemProps {
  faculty: Faculty;
}
function FacultyItem({ faculty }: FacultyItemProps) {
  const [state, setState] = useState({
    openDeleteConfirmation: false,
  });
  const user = useUser({ id: faculty.userId });
  const { addSnackbar } = useContext(SnackbarContext);
  const activeFaculty = useActiveFacultyByFacultyId({
    id: faculty.id,
  });
  const router = useRouter();
  const department = useDepartment({ id: faculty.departmentId });
  const college = useCollege({
    id: department?.collegeId,
  });
  const activateHandler = async () => {
    return axios
      .post(`/api/active_faculty`, {
        facultyId: faculty.id,
      })
      .then(() => {
        addSnackbar("Faculty has been activated successfully");
      })
      .catch((error) => {
        addSnackbar(
          error?.response?.data?.error?.message ?? "Failed to activate faculty",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  };

  const deactivateHandler = async () => {
    return axios
      .delete(`/api/active_faculty/${activeFaculty?.id}`)
      .then(() => {
        addSnackbar("Faculty has been deactivated successfully");
      })
      .catch((error) => {
        addSnackbar(
          error.response.data?.error?.message ?? "Failed to deactivate faculty",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  };

  const deleteHandler = () => {
    axios
      .delete(`/api/faculty/${faculty.id}`)
      .then(() => {
        addSnackbar("Faculty has been deleted successfully");
      })
      .catch((error) => {
        addSnackbar(
          "Failed to delete faculty, it is linked to a resource",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  };

  const toggleHandler = (active: boolean) => {
    if (active) {
      activateHandler();
    } else {
      deactivateHandler();
    }
  };

  return (
    <tr key={faculty.id} className="border-b">
      <td className="py-1 pl-4">
        <Link href={`/admin/user/${faculty.userId}`} className="underline">
          {user?.name}
        </Link>
      </td>
      <td className="py-1">{department?.name}</td>
      <td className="py-1">{college?.name}</td>
      <td className="py-1 flex justify-center items-center space-x-1">
        <input
          type="checkbox"
          id="toggleSwitch"
          className="rounded text-palette_blue focus:border-palette_blue focus:ring focus:ring-offset-0 focus:ring-palette_blue focus:ring-opacity-10 cursor-pointer h-7 w-7"
          checked={Boolean(activeFaculty)}
          onChange={(e) => toggleHandler(e.target.checked)}
          title="Active"
        />

        <>
          <button
            className="rounded bg-palette_blue text-palette_white w-7 h-7 flex justify-center items-center"
            onClick={() =>
              setState((prev) => ({ ...prev, openDeleteConfirmation: true }))
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              className="w-5 h-5 stroke-palette_white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
          {state.openDeleteConfirmation && (
            <Confirmation
              onClose={() =>
                setState((prev) => ({ ...prev, openDeleteConfirmation: false }))
              }
              onConfirm={deleteHandler}
            />
          )}
        </>
      </td>
    </tr>
  );
}

function AddModal() {
  const { addSnackbar } = useContext(SnackbarContext);
  const [state, setState] = useState({
    openAddModal: false,
  });
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      userId: "",
      departmentId: "",
    },
    validationSchema: Yup.object({
      userId: Yup.string().required(),
      departmentId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/faculty", values)
        .then(() => {
          addSnackbar("Faculty has been added successfully");
        })
        .catch((error) => {
          addSnackbar(
            error.response.data?.error?.message ?? "Failed to add faculty",
            "error"
          );
        })
        .finally(() => {
          router.reload();
        });
    },
  });

  const handleClose = () => {
    setState((prev) => ({ ...prev, openAddModal: false }));
  };
  const handleOpen = () => {
    setState((prev) => ({ ...prev, openAddModal: true }));
  };

  return (
    <>
      <button
        className="rounded-lg bg-palette_blue text-palette_white py-1 px-2 flex justify-center items-center space-x-1 hover:bg-opacity-90"
        onClick={handleOpen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="1em"
          viewBox="0 0 448 512"
          className="fill-palette_white"
        >
          <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
        </svg>
        <span>Add</span>
      </button>
      {state.openAddModal && (
        <Modal title="Add Faculty" onClose={handleClose}>
          <form onSubmit={formik.handleSubmit} noValidate>
            <div className="flex flex-col space-y-1 w-full">
              <DepartmentSelector
                {...formik.getFieldProps("departmentId")}
                compact={true}
              />
              <UserSelector {...formik.getFieldProps("userId")} />
              <button
                type="submit"
                className="bg-palette_blue text-white rounded inline-flex items-center justify-center py-1 space-x-2 hover:bg-opacity-90"
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
    <div className="flex bg-palette_white">
      <select
        onChange={handleFieldChange}
        className="py-1 rounded-s-lg bg-inherit focus:border-palette_grey focus:ring-palette_grey "
      >
        <option value="">Select field</option>
        <option value="name">Name</option>
        <option value="departmentName">Department</option>
        <option value="collegeName">College</option>
      </select>
      <input
        type="text"
        placeholder="Search"
        value={filterValue}
        className="bg-inherit py-1 rounded-e-lg focus:border-palette_grey focus:ring-palette_grey"
        onChange={handleValueChange}
      />
    </div>
  );
}

interface SortSelectorProps {
  onSortChange: (field: string, direction: "asc" | "desc") => void;
}
function SortSelector({ onSortChange }: SortSelectorProps) {
  const [selectedField, setSelectedField] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

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
    <div className="flex bg-palette_white">
      <select
        onChange={handleFieldChange}
        value={selectedField}
        className="py-1 rounded-s-lg focus:border-palette_grey focus:ring-palette_grey"
      >
        <option value="name">Name</option>
        <option value="departmentName">Department</option>
        <option value="collegeName">College</option>
      </select>
      <select
        onChange={handleDirectionChange}
        value={sortDirection}
        className="py-1 rounded-e-lg focus:border-palette_grey focus:ring-palette_grey"
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
}
