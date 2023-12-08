import AdminLayout from "@/components/AdminLayout";
import Confirmation from "@/components/Confirmation";
import DepartmentSelector from "@/components/DepartmentSelector";
import Modal from "@/components/Modal";
import { SnackbarContext } from "@/components/SnackbarProvider";
import ToggleSwitch from "@/components/ToggleSwitch";
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
      <div className='h-full flex flex-col rounded border border-palette_grey'>
        <div className='flex justify-between bg-palette_grey bg-opacity-10 p-1'>
          <div className='flex space-x-1 justify-between items-end'>
            <h2 className='px-2 border-b-2 border-palette_orange'>Faculty</h2>

            <div className='flex flex-row space-x-1'>
              <FilterSelector onFilterChange={handleFilterChange} />

              <SortSelector onSortChange={handleSortChange} />
            </div>
          </div>
          <AddModal />
        </div>

        <div className='flex-1 h-full'>
          <table className='table-auto w-full text-sm'>
            <thead className='bg-palette_grey bg-opacity-10'>
              <tr>
                <th className='font-normal'>USER</th>
                <th className='font-normal'>DEPARTMENT</th>
                <th className='font-normal'>COLLEGE</th>
                <th className='font-normal'>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {faculties.map((faculty) => {
                return <FacultyItem faculty={faculty} key={faculty.id} />;
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
    <tr key={faculty.id} className='border-b'>
      <td className='py-1 pl-4'>
        <Link href={`/admin/user/${faculty.userId}`} className='underline'>
          {user?.name}
        </Link>
      </td>
      <td className='py-1'>{department?.name}</td>
      <td className='py-1'>{college?.name}</td>
      <td className='py-1 flex justify-center items-center space-x-1'>
        <input
          type='checkbox'
          id='toggleSwitch'
          className='rounded text-palette_blue focus:border-palette_blue focus:ring focus:ring-offset-0 focus:ring-palette_blue focus:ring-opacity-10 cursor-pointer h-5 w-5'
          checked={Boolean(activeFaculty)}
          onChange={(e) => toggleHandler(e.target.checked)}
          title='Active'
        />

        <>
          <button
            className='rounded px-4 py-1 bg-palette_blue text-palette_white'
            onClick={() =>
              setState((prev) => ({ ...prev, openDeleteConfirmation: true }))
            }
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              height='16'
              width='14'
              viewBox='0 0 448 512'
              className='fill-palette_white'
            >
              <path d='M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z' />
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
        className='rounded bg-palette_blue text-palette_white py-1 px-2 flex justify-center items-center space-x-1 hover:bg-opacity-90'
        onClick={handleOpen}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          height='1em'
          viewBox='0 0 448 512'
          className='fill-palette_white'
        >
          <path d='M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z' />
        </svg>
        <span>Add</span>
      </button>
      {state.openAddModal && (
        <Modal title='Add Faculty' onClose={handleClose}>
          <form onSubmit={formik.handleSubmit} noValidate>
            <div className='flex flex-col space-y-1 w-full'>
              <DepartmentSelector {...formik.getFieldProps("departmentId")} />
              <UserSelector {...formik.getFieldProps("userId")} />
              <button
                type='submit'
                className='bg-palette_blue text-white rounded inline-flex items-center justify-center py-1 space-x-2 hover:bg-opacity-90'
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
        <option value='name'>Name</option>
        <option value='departmentName'>Department</option>
        <option value='collegeName'>College</option>
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
  }, [selectedField, sortDirection]);

  return (
    <div>
      <select
        onChange={handleFieldChange}
        value={selectedField}
        className='py-1 rounded-s bg-inherit focus:border-palette_grey focus:ring-palette_grey'
      >
        <option value='name'>Name</option>
        <option value='departmentName'>Department</option>
        <option value='collegeName'>College</option>
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
