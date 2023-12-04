import AdminLayout from "@/components/AdminLayout";
import { SnackbarContext } from "@/components/SnackbarProvider";
import ToggleSwitch from "@/components/ToggleSwitch";
import useActiveFacultyByFacultyId from "@/hooks/useActiveFacultyByFacultyId";
import useCollege from "@/hooks/useCollege";
import useDepartment from "@/hooks/useDepartment";
import useFaculties from "@/hooks/useFaculties";
import useUser from "@/hooks/useUser";
import { Faculty } from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";

export default function FacultiesPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
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

  return (
    <AdminLayout>
      <div className='h-full flex flex-col rounded border border-palette_grey'>
        <div className='flex justify-between bg-palette_grey bg-opacity-10 p-1'>
          <h2 className='px-2 border-b-2 border-palette_orange'>Faculty</h2>

          <Link
            className='rounded bg-palette_blue text-palette_white py-1 px-2 flex justify-center items-center space-x-1 hover:bg-opacity-90'
            href={`/admin/faculty/add`}
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
          </Link>
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
          error?.response?.data?.error?.message ??
            "Failed to deactivate faculty",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  };

  const deleteHandler = (facultyId: string) => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/faculty/${facultyId}`)
      .then(() => {
        addSnackbar("Faculty deleted successfully.");
      })
      .catch((error) => {
        addSnackbar(
          error?.response?.data?.error?.message ?? "Failed to delete faculty",
          "error"
        );
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
        />

        <button
          className='rounded px-4 py-1 bg-palette_blue text-palette_white'
          onClick={() => deleteHandler(faculty.id)}
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
      </td>
    </tr>
  );
}
