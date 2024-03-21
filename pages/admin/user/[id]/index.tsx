import AdminLayout from "@/components/AdminLayout";
import Modal from "@/components/Modal";
import { SnackbarContext } from "@/components/SnackbarProvider";
import Timeline from "@/components/Timeline";
import useEventsUser from "@/hooks/useEventUser";
import useUser from "@/hooks/useUser";
import { User } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import * as Yup from "yup";

export default function UserPage() {
  const router = useRouter();
  const userId = router.query.id;
  const user = useUser({ id: userId as string });

  if (!user) return null;

  return (
    <AdminLayout>
      <div className="h-full overflow-auto flex flex-col">
        <div className="flex flex-1 h-full overflow-auto">
          {user && (
            <div className="flex-1 h-full overflow-auto">
              <UserActivity id={user.id} />
            </div>
          )}
          <div className="flex-1 h-full flex flex-col">
            <div className="flex justify-end">
              <EditModal user={user} />
            </div>
            <div className="h-full flex-1 flex flex-col justify-center items-center space-y-2 ">
              <img
                src={user?.image ?? "/images/buksu-logo-min-512x512.png"}
                onError={(e) => {
                  e.currentTarget.src = "/images/buksu-logo-min-512x512.png";
                }}
                className="w-32 h-32 shadow rounded-full object-cover"
                alt="User profile picture"
              />
              <div className="flex flex-col justify-center items-center">
                <p className="">{user?.name}</p>
                <p>{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function UserActivity({ id }: { id: string }) {
  const [state, setState] = useState({
    take: 10,
    skip: 0,
    id,
  });
  const { events, count } = useEventsUser(state);

  const nextHandler = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return { ...prev, skip: nextVal < count ? nextVal : prev.skip };
    });
  };

  const previousHandler = () => {
    setState((prev) => {
      const nextVal = prev.skip - prev.take;
      return { ...prev, skip: nextVal >= 0 ? nextVal : prev.skip };
    });
  };

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="flex-1 h-full overflow-auto py-3">
        <Timeline events={events} />
      </div>

      <div className="flex justify-start items-center space-x-1 p-1">
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
        <p className="text-xs">
          {state.skip} - {state.skip + state.take} of {count}
        </p>
      </div>
    </div>
  );
}

interface EditModalProps {
  user: User;
}
function EditModal({ user }: EditModalProps) {
  const [state, setState] = useState({
    openEdit: false,
  });
  const { addSnackbar } = useContext(SnackbarContext);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .put(`/api/user/${user.id}`, values)
        .then(() => {
          addSnackbar("User has been updated successfully");
        })
        .catch((error) => {
          addSnackbar(
            error.response.data?.error?.message ?? "Failed to update user",
            "error"
          );
        })
        .finally(() => {
          router.reload();
        });
    },
  });

  useEffect(() => {
    if (!user) return;
    let subscribe = true;

    formik.setValues({
      name: user.name ?? "",
    });

    return () => {
      subscribe = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleOpen = () => {
    setState((prev) => ({ ...prev, openEdit: true }));
  };
  const handleClose = () => {
    setState((prev) => ({ ...prev, openEdit: false }));
  };

  return (
    <>
      <button
        className="rounded-lg bg-palette_blue hover:bg-opacity-90 h-7 w-7 flex justify-center items-center"
        onClick={handleOpen}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 stroke-palette_white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
          />
        </svg>
      </button>
      {state.openEdit && (
        <Modal onClose={handleClose} title="Update User">
          <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-col space-y-1">
              <input
                type="text"
                placeholder="Name"
                {...formik.getFieldProps("name")}
                className="rounded"
              />
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
