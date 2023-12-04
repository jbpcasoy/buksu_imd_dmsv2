import ActiveFacultySelector from "@/components/ActiveFacultySelector";
import AdminLayout from "@/components/AdminLayout";
import Confirmation from "@/components/Confirmation";
import Modal from "@/components/Modal";
import { SnackbarContext } from "@/components/SnackbarProvider";
import useActiveDeanByDeanId from "@/hooks/useActiveDeanByDeanId";
import useActiveFacultyByFacultyId from "@/hooks/useActiveFacultyByFacultyId";
import useCollege from "@/hooks/useCollege";
import useDeans from "@/hooks/useDeans";
import useDepartment from "@/hooks/useDepartment";
import useFaculty from "@/hooks/useFaculty";
import useUserFaculty from "@/hooks/useUserFaculty";
import { Dean } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import * as Yup from "yup";

export default function DeansPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { deans, count } = useDeans(state);

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
      <div className='border border-palette_grey rounded flex flex-col h-full'>
        <div className='flex justify-between bg-palette_grey bg-opacity-10 p-1'>
          <h2 className='border-b-2 border-palette_orange px-2'>Dean</h2>

          <AddModal />
        </div>

        <div className='flex-1 h-full'>
          <table className='table-auto w-full text-sm'>
            <thead className='bg-palette_grey bg-opacity-10'>
              <tr>
                <th className='font-normal'>USER</th>
                <th className='font-normal'>COLLEGE</th>
                <th className='font-normal'>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {deans.map((dean) => {
                return <DeanItem dean={dean} key={dean.id} />;
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

interface DeanItemProps {
  dean: Dean;
}

function DeanItem({ dean }: DeanItemProps) {
  const [state, setState] = useState({
    openDelete: false,
  });
  const user = useUserFaculty({
    id: dean.facultyId,
  });
  const faculty = useFaculty({
    id: dean.facultyId,
  });
  const department = useDepartment({
    id: faculty?.departmentId,
  });
  const college = useCollege({
    id: department?.collegeId,
  });
  const { addSnackbar } = useContext(SnackbarContext);
  const activeFaculty = useActiveFacultyByFacultyId({
    id: dean.facultyId,
  });
  const router = useRouter();
  const activeDean = useActiveDeanByDeanId({
    id: dean.id,
  });

  const handleOpen = () => {
    setState((prev) => ({ ...prev, openDelete: true }));
  };
  const handleClose = () => {
    setState((prev) => ({ ...prev, openDelete: false }));
  };

  const deleteHandler = () => {
    axios
      .delete(`/api/dean/${dean.id}`)
      .then(() => {
        addSnackbar("Dean deleted successfully");
      })
      .catch((error) => {
        addSnackbar(
          error?.response?.data?.error?.message ?? "Failed to delete Dean",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  };

  const activateHandler = async () => {
    return axios
      .post(`/api/active_dean`, {
        activeFacultyId: activeFaculty?.id,
      })
      .then(() => {
        addSnackbar("Dean has been activated successfully");
      })
      .catch((error) => {
        addSnackbar(
          error?.response?.data?.error?.message ?? "Failed to activate Dean",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  };

  const deactivateHandler = async () => {
    return axios
      .delete(`/api/active_dean/${activeDean?.id}`)
      .then(() => {
        addSnackbar("Dean has been deactivated successfully");
      })
      .catch((error) => {
        addSnackbar(
          error?.response?.data?.error?.message ?? "Failed to deactivate Dean",
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
    <tr key={dean.id} className='border-b'>
      <td className='py-1 pl-4'>
        <Link href={`/admin/user/${user?.id}`} className='underline'>
          {user?.name}
        </Link>
      </td>
      <td className='py-1'>{college?.name}</td>
      <td className='flex justify-center items-center py-1 space-x-1'>
        <input
          type='checkbox'
          id='toggleSwitch'
          className='rounded text-palette_blue focus:border-palette_blue focus:ring focus:ring-offset-0 focus:ring-palette_blue focus:ring-opacity-10 cursor-pointer h-5 w-5'
          checked={Boolean(activeDean)}
          onChange={(e) => toggleHandler(e.target.checked)}
        />
        <>
          <button
            className='rounded px-4 py-1 bg-palette_blue text-palette_white'
            onClick={handleOpen}
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
          {state.openDelete && (
            <Confirmation onClose={handleClose} onConfirm={deleteHandler} />
          )}
        </>
      </td>
    </tr>
  );
}

function AddModal() {
  const [state, setState] = useState({
    openAdd: false,
  });
  const { addSnackbar } = useContext(SnackbarContext);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      activeFacultyId: "",
    },
    validationSchema: Yup.object({
      activeFacultyId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/dean", values)
        .then(() => {
          addSnackbar("Dean added successfully");
        })
        .catch((error) => {
          addSnackbar(
            error.response.data?.error?.message ?? "Failed to add dean",
            "error"
          );
        })
        .finally(() => {
          router.reload();
        });
    },
  });

  const handleClose = () => {
    setState((prev) => ({ ...prev, openAdd: false }));
  };

  const handleOpen = () => {
    setState((prev) => ({ ...prev, openAdd: true }));
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className='rounded bg-palette_blue text-palette_white py-1 px-2 flex justify-center items-center space-x-1 hover:bg-opacity-90'
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
      {state.openAdd && (
        <Modal onClose={handleClose} title='Add Dean'>
          <form onSubmit={formik.handleSubmit}>
            <div className='flex flex-col space-y-1'>
              <ActiveFacultySelector
                {...formik.getFieldProps("activeFacultyId")}
              />
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
