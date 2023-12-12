import AdminLayout from "@/components/AdminLayout";
import Confirmation from "@/components/Confirmation";
import Modal from "@/components/Modal";
import { SnackbarContext } from "@/components/SnackbarProvider";
import useActiveFacultyMe from "@/hooks/useActiveFacultyMe";
import useCollege from "@/hooks/useCollege";
import useDepartment from "@/hooks/useDepartment";
import useFaculty from "@/hooks/useFaculty";
import useIM from "@/hooks/useIM";
import useIMLatestIMFile from "@/hooks/useIMLatestIMFile.";
import useIMLatestPlagiarismFile from "@/hooks/useIMLatestPlagiarismFile";
import useIMLatestQAMISFile from "@/hooks/useIMLatestQAMISFile";
import useIMStatus from "@/hooks/useIMStatus";
import useUser from "@/hooks/useUser";
import iMStatusNormalizer from "@/services/iMStatusNormalizer";
import { ActiveFaculty, IM } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import { DateTime } from "luxon";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import * as Yup from "yup";

export default function IMPage() {
  const router = useRouter();
  const iMId = router.query.id;
  const iM = useIM({ id: iMId as string });
  const { addSnackbar } = useContext(SnackbarContext);
  const faculty = useFaculty({
    id: iM?.facultyId,
  });
  const department = useDepartment({
    id: faculty?.departmentId,
  });
  const college = useCollege({
    id: department?.collegeId,
  });
  const user = useUser({
    id: faculty?.userId,
  });
  const iMStatus = useIMStatus({
    id: iM?.id,
  });

  const qAMISFile = useIMLatestQAMISFile({ id: iM?.id });
  const plagiarismFile = useIMLatestPlagiarismFile({ id: iM?.id });
  const iMFile = useIMLatestIMFile({
    id: iM?.id,
  });
  const activeFaculty = useActiveFacultyMe();

  const deleteHandler = () => {
    axios
      .delete(`/api/im/${iMId}`)
      .then(() => {
        addSnackbar("IM has been deleted successfully");
        router.push("/admin/im");
      })
      .catch((error) => {
        addSnackbar(
          error.response.data?.error?.message ?? "Failed to delete IM",
          "error"
        );
      });
  };

  if (!iM) return null;

  return (
    <AdminLayout>
      <div className='flex h-full'>
        <div className='flex-1 p-1'>
          <div className='flex'>
            <h2 className='flex-1 uppercase'>{iM.title}</h2>
            <div>
              {
                <ActionMenu
                  iM={iM}
                  iMStatus={iMStatus}
                  deleteHandler={deleteHandler}
                  showIMPDF={Boolean(iMFile)}
                  showQAMISPDF={Boolean(qAMISFile)}
                  showPlagiarismPDF={Boolean(plagiarismFile)}
                />
              }
            </div>
          </div>
          <div className='flex space-x-10'>
            <div className='flex space-x-2 mt-2'>
              <img className='w-10 h-10 rounded-full object-cover' src={user?.image ?? ""} />
              <div className='text-xs text-palette_grey'>
                <p className='uppercase font-bold'>{user?.name}</p>
                {iM?.createdAt && (
                  <p>
                    {DateTime.fromJSDate(new Date(iM.createdAt)).toFormat(
                      "DD | t"
                    )}
                  </p>
                )}
              </div>
            </div>
            <div>
              <div className='space-x-4'>
                <span className='text-xs text-palette_grey'>
                  Type: {iM.type}
                </span>
                <span className='text-xs text-palette_grey'>
                  Status: {iMStatusNormalizer(iMStatus)}
                </span>
              </div>
              <p className='text-xs text-palette_grey'>
                Department: {department?.name} | {college?.name}
              </p>
            </div>
          </div>
        </div>
        <div className='flex flex-1 h-full'>
          {iMFile && (
            <iframe
              loading='lazy'
              src={`/api/im_file/${iMFile.id}/pdf`}
              title={iM.title}
              className='w-full h-full rounded'
            />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

interface ActionMenuProps {
  iM: IM;
  iMStatus?: string | null;
  deleteHandler: (id: string) => void;
  showIMPDF: boolean;
  showQAMISPDF: boolean;
  showPlagiarismPDF: boolean;
}
function ActionMenu({
  iM,
  iMStatus,
  deleteHandler,
  showIMPDF,
  showPlagiarismPDF,
  showQAMISPDF,
}: ActionMenuProps) {
  const [state, setState] = useState({
    openMenu: false,
    openConfirmation: false,
  });
  const menuRef: any = useRef(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setState((prev) => ({ ...prev, openMenu: false }));
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setState((prev) => ({ ...prev, openMenu: false }));
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className='relative inline-block text-left' ref={menuRef}>
      <div>
        <button
          type='button'
          className='inline-flex justify-center items-center space-x-2 w-full rounded-md border border-gray-300 shadow-sm px-2 py-1 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50'
          id='options-menu'
          aria-haspopup='true'
          aria-expanded='true'
          onClick={() =>
            setState((prev) => ({ ...prev, openMenu: !prev.openMenu }))
          }
        >
          <span>Actions</span>
          {!state.openMenu && (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              height='1em'
              viewBox='0 0 320 512'
              className='fill-palette_blue'
            >
              <path d='M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z' />
            </svg>
          )}
          {state.openMenu && (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              height='1em'
              viewBox='0 0 320 512'
              className='fill-palette_blue'
            >
              <path d='M182.6 137.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z' />
            </svg>
          )}
        </button>
      </div>

      {state.openMenu && (
        <div className='origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5'>
          <div
            className='py-1'
            role='menu'
            aria-orientation='vertical'
            aria-labelledby='options-menu'
          >
            <Link
              href={`/admin/im/${iM.id}/all_reviews`}
              className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
              role='menuitem'
            >
              All reviews
            </Link>
            <Link
              href={`/admin/im/${iM.id}/all_suggestions`}
              className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
              role='menuitem'
            >
              All suggestions
            </Link>
            <Link
              href={`/admin/im/${iM.id}/track`}
              className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
              role='menuitem'
            >
              Track
            </Link>
            {showIMPDF && (
              <Link
                href={`/api/im_file/im/${iM.id}/pdf`}
                target='_blank'
                className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                role='menuitem'
              >
                View IM PDF
              </Link>
            )}
            {showQAMISPDF && (
              <Link
                href={`/api/qamis_file/im/${iM.id}/pdf`}
                target='_blank'
                className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                role='menuitem'
              >
                View QAMIS PDF
              </Link>
            )}
            {showPlagiarismPDF && (
              <Link
                href={`/api/plagiarism_file/im/${iM.id}/pdf`}
                target='_blank'
                className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                role='menuitem'
              >
                View Plagiarism PDF
              </Link>
            )}
            <EditIM />
            <>
              <button
                onClick={() =>
                  setState((prev) => ({ ...prev, openConfirmation: true }))
                }
                className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left'
                role='menuitem'
              >
                Delete
              </button>

              {state.openConfirmation && (
                <Confirmation
                  matchText={iM.title}
                  onClose={() =>
                    setState((prev) => ({
                      ...prev,
                      openConfirmation: false,
                    }))
                  }
                  onConfirm={() => {
                    deleteHandler(iM.id);
                  }}
                />
              )}
            </>
          </div>
        </div>
      )}
    </div>
  );
}
function EditIM() {
  const router = useRouter();
  const iMId = router.query.id;
  const iM = useIM({ id: iMId as string });
  const [openEdit, setOpenEdit] = useState(false);
  const { addSnackbar } = useContext(SnackbarContext);

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
        .put(`/api/im/${iMId}`, values)
        .then(() => {
          addSnackbar("IM Updated successfully");
        })
        .catch((error) => {
          addSnackbar(
            error.response.data?.error?.message ?? "Failed to update IM",
            "error"
          );
        })
        .finally(() => {
          router.reload();
        });
    },
  });

  useEffect(() => {
    if (!iM) return;

    formik.setValues({
      title: iM.title,
      type: iM.type,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iM]);

  useEffect(() => {
    console.log({ iM });
  }, [iM]);

  return (
    <>
      <button
        className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left'
        onClick={() => setOpenEdit(true)}
      >
        Edit
      </button>
      {openEdit && (
        <Modal title='Edit IM' onClose={() => setOpenEdit(false)}>
          <form onSubmit={formik.handleSubmit} noValidate>
            <div className='flex flex-col space-y-1'>
              <input
                placeholder='Title'
                {...formik.getFieldProps("title")}
                className='rounded'
              />
              <select {...formik.getFieldProps("type")} className='rounded'>
                <option value='MODULE'>Module</option>
                <option value='COURSE_FILE'>Course File</option>
                <option value='WORKTEXT'>Worktext</option>
                <option value='TEXTBOOK'>Textbook</option>
              </select>
              <button
                type='submit'
                disabled={!formik.isValid}
                className='bg-palette_blue text-white rounded inline-flex items-center justify-center py-1 space-x-2 hover:bg-opacity-90 disabled:bg-opacity-50'
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
