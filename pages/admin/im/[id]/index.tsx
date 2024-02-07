import AdminLayout from "@/components/AdminLayout";
import Confirmation from "@/components/Confirmation";
import Loading from "@/components/Loading";
import Modal from "@/components/Modal";
import { SnackbarContext } from "@/components/SnackbarProvider";
import useActiveFaculties from "@/hooks/useActiveFaculties";
import useCoAuthors from "@/hooks/useCoAuthors";
import useCollege from "@/hooks/useCollege";
import useDepartment from "@/hooks/useDepartment";
import useDepartmentReviewIM from "@/hooks/useDepartmentReviewIM";
import useFaculty from "@/hooks/useFaculty";
import useIM from "@/hooks/useIM";
import useIMAll from "@/hooks/useIMAll";
import useIMERCCITLDirectorEndorsementIM from "@/hooks/useIMERCCITLDirectorEndorsementIM";
import useIMLatestIMFile from "@/hooks/useIMLatestIMFile.";
import useIMLatestPlagiarismFile from "@/hooks/useIMLatestPlagiarismFile";
import useIMLatestQAMISFile from "@/hooks/useIMLatestQAMISFile";
import useIMStatus from "@/hooks/useIMStatus";
import useRefresh from "@/hooks/useRefresh";
import useSerialNumberIM from "@/hooks/useSerialNumberIM";
import useUser from "@/hooks/useUser";
import useUserFaculty from "@/hooks/useUserFaculty";
import iMStatusNormalizer from "@/services/iMStatusNormalizer";
import {
  ActiveFaculty,
  CoAuthor,
  IM,
  IMERCCITLDirectorEndorsement,
  SerialNumber,
} from "@prisma/client";
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
  const iMERCCITLDirectorEndorsement = useIMERCCITLDirectorEndorsementIM({
    id: iM?.id,
  });
  const serialNumber = useSerialNumberIM({
    id: iM?.id,
  });

  const qAMISFile = useIMLatestQAMISFile({ id: iM?.id });
  const plagiarismFile = useIMLatestPlagiarismFile({ id: iM?.id });
  const iMFile = useIMLatestIMFile({
    id: iM?.id,
  });

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
      <div className="flex h-full">
        <div className="flex-1 p-1">
          <div className="flex">
            <h2 className="flex-1 uppercase">
              {iM.title}{" "}
              {serialNumber && (
                <span className="normal-case italic text-xs text-palette_grey">
                  {serialNumber?.value}
                </span>
              )}
            </h2>
            <div>
              {
                <ActionMenu
                  iM={iM}
                  iMStatus={iMStatus}
                  deleteHandler={deleteHandler}
                  showIMPDF={Boolean(iMFile)}
                  showQAMISPDF={Boolean(qAMISFile)}
                  showPlagiarismPDF={Boolean(plagiarismFile)}
                  iMERCCITLDirectorEndorsement={iMERCCITLDirectorEndorsement}
                  serialNumber={serialNumber}
                />
              }
            </div>
          </div>
          <div className="flex space-x-10">
            <div className="flex space-x-2 mt-2">
              <img
                className="w-10 h-10 rounded-full object-cover"
                src={user?.image ?? ""}
                alt="User profile picture"
              />
              <div className="text-xs text-palette_grey">
                <p className="uppercase font-bold">{user?.name}</p>
                {iM?.createdAt && (
                  <p>
                    {DateTime.fromJSDate(new Date(iM.createdAt)).toFormat(
                      "D | t"
                    )}
                  </p>
                )}
              </div>
            </div>
            <div>
              <div className="space-x-4">
                <span className="text-xs text-palette_grey">
                  Type: {iM.type}
                </span>
                <span className="text-xs text-palette_grey">
                  Status: {iMStatusNormalizer(iMStatus)}
                </span>
              </div>
              <p className="text-xs text-palette_grey">
                Department: {department?.name} | {college?.name}
              </p>
            </div>
          </div>
          <CoAuthors iMId={iMId as string} />
        </div>

        <div className="flex flex-1 h-full">
          {iMFile && (
            <iframe
              loading="lazy"
              src={`/api/im_file/${iMFile.id}/pdf`}
              title={iM.title}
              className="w-full h-full rounded"
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
  iMERCCITLDirectorEndorsement?: IMERCCITLDirectorEndorsement | null;
  serialNumber?: SerialNumber | null;
}
function ActionMenu({
  iM,
  iMStatus,
  deleteHandler,
  showIMPDF,
  showPlagiarismPDF,
  showQAMISPDF,
  iMERCCITLDirectorEndorsement,
  serialNumber,
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
    <div className="relative inline-block text-left" ref={menuRef}>
      <div>
        <button
          type="button"
          className="inline-flex justify-center items-center space-x-2 w-full rounded-md border border-gray-300 shadow-sm px-2 py-1 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          id="options-menu"
          aria-haspopup="true"
          aria-expanded="true"
          onClick={() =>
            setState((prev) => ({ ...prev, openMenu: !prev.openMenu }))
          }
        >
          <span>Actions</span>
          {!state.openMenu && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 320 512"
              className="fill-palette_blue"
            >
              <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
            </svg>
          )}
          {state.openMenu && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 320 512"
              className="fill-palette_blue"
            >
              <path d="M182.6 137.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z" />
            </svg>
          )}
        </button>
      </div>

      {state.openMenu && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <Link
              href={`/admin/im/${iM.id}/all_reviews`}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              All reviews
            </Link>
            <Link
              href={`/admin/im/${iM.id}/all_suggestions`}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              All suggestions
            </Link>
            <Link
              href={`/admin/im/${iM.id}/track`}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              Track
            </Link>
            {showIMPDF && (
              <Link
                href={`/api/im_file/im/${iM.id}/pdf`}
                target="_blank"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                View IM PDF
              </Link>
            )}
            {showQAMISPDF && (
              <Link
                href={`/api/qamis_file/im/${iM.id}/pdf`}
                target="_blank"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                View QAMIS PDF
              </Link>
            )}
            {showPlagiarismPDF && (
              <Link
                href={`/api/plagiarism_file/im/${iM.id}/pdf`}
                target="_blank"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                View Plagiarism PDF
              </Link>
            )}
            <Link
              href={`/admin/im/${iM.id}/versions`}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              Versions
            </Link>
            <Link
              href={`/admin/forms`}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              Forms
            </Link>
            {iMERCCITLDirectorEndorsement && (
              <EditSerialNumber
                iMERCCITLDirectorEndorsement={iMERCCITLDirectorEndorsement}
                serialNumber={serialNumber}
              />
            )}
            <Link
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              href={`/admin/im/${iM.id}/info`}
            >
              More Info
            </Link>
            <EditIM />
            <>
              <button
                onClick={() =>
                  setState((prev) => ({ ...prev, openConfirmation: true }))
                }
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                role="menuitem"
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

interface IMInfoProps {
  iM: IM;
}

function IMInfo({ iM }: IMInfoProps) {
  const iMInfo = useIMAll({ id: iM.id });

  if (!iMInfo) {
    return <Loading />;
  }

  // return <DynamicReactJson src={iMInfo} collapsed={2} />;
  return <pre>{JSON.stringify(iMInfo, undefined, 4)}</pre>;
}

interface EditSerialNumberProps {
  iMERCCITLDirectorEndorsement: IMERCCITLDirectorEndorsement;
  serialNumber?: SerialNumber | null;
}
function EditSerialNumber({
  iMERCCITLDirectorEndorsement,
  serialNumber,
}: EditSerialNumberProps) {
  const router = useRouter();
  const iMId = router.query.id;
  const iM = useIM({ id: iMId as string });
  const [openEdit, setOpenEdit] = useState(false);
  const { addSnackbar } = useContext(SnackbarContext);

  const formik = useFormik({
    initialValues: {
      value: "",
    },
    validationSchema: Yup.object({
      value: Yup.string(),
    }),

    onSubmit: (values) => {
      if (!serialNumber) {
        axios
          .post("/api/serial_number", {
            ...values,
            iMERCCITLDirectorEndorsementId: iMERCCITLDirectorEndorsement.id,
          })
          .then(() => {
            addSnackbar("Serial number Updated successfully");
          })
          .catch((error) => {
            addSnackbar(
              error.response.data?.error?.message ??
                "Failed to update serial number",
              "error"
            );
          })
          .finally(() => {
            router.reload();
          });
      } else {
        axios
          .put(`/api/serial_number/${serialNumber.id}`, values)
          .then(() => {
            addSnackbar("Serial number updated successfully");
          })
          .catch((error) => {
            addSnackbar(
              error.response.data?.error?.message ??
                "Failed to update serial number",
              "error"
            );
          })
          .finally(() => {
            router.reload();
          });
      }
    },
  });

  useEffect(() => {
    if (serialNumber) {
      formik.setFieldValue("value", serialNumber.value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serialNumber]);

  return (
    <>
      <button
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
        onClick={() => setOpenEdit(true)}
      >
        Serial Number
      </button>
      {openEdit && (
        <Modal title="Edit IM" onClose={() => setOpenEdit(false)}>
          <form onSubmit={formik.handleSubmit} noValidate>
            <div className="flex flex-col space-y-1">
              <input
                placeholder="Serial Number"
                {...formik.getFieldProps("value")}
                className="rounded"
              />
              <button
                type="submit"
                disabled={!formik.isValid}
                className="bg-palette_blue text-white rounded inline-flex items-center justify-center py-1 space-x-2 hover:bg-opacity-90 disabled:bg-opacity-50"
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
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
        onClick={() => setOpenEdit(true)}
      >
        Edit
      </button>
      {openEdit && (
        <Modal title="Edit IM" onClose={() => setOpenEdit(false)}>
          <form onSubmit={formik.handleSubmit} noValidate>
            <div className="flex flex-col space-y-1">
              <input
                placeholder="Title"
                {...formik.getFieldProps("title")}
                className="rounded"
              />
              <select {...formik.getFieldProps("type")} className="rounded">
                <option value="MODULE">Module</option>
                <option value="COURSE_FILE">Course File</option>
                <option value="WORKTEXT">Worktext</option>
                <option value="TEXTBOOK">Textbook</option>
              </select>
              <button
                type="submit"
                disabled={!formik.isValid}
                className="bg-palette_blue text-white rounded inline-flex items-center justify-center py-1 space-x-2 hover:bg-opacity-90 disabled:bg-opacity-50"
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

interface CoAuthorsProps {
  iMId: string;
}

function CoAuthors({ iMId }: CoAuthorsProps) {
  const departmentReview = useDepartmentReviewIM({
    id: iMId,
  });
  const iM = useIM({
    id: iMId,
  });
  const [openOptions, setOpenOptions] = useState(false);
  const [state, setState] = useState<{
    skip: number;
    take: number;
    filter?: {
      name?: string;
      notCoAuthorOfIM?: string;
    };
    sort?: {
      field?: string;
      direction?: string;
    };
  }>({
    skip: 0,
    take: 10,
    filter: {
      name: undefined,
      notCoAuthorOfIM: iMId,
    },
    sort: {
      field: "name",
      direction: "asc",
    },
  });
  const { refreshFlag, refresh } = useRefresh();
  const { activeFaculties, count } = useActiveFaculties(state, refreshFlag);
  const { addSnackbar } = useContext(SnackbarContext);
  const [coAuthorsQuery, setCoAuthorsQuery] = useState({
    skip: 0,
    take: Number(process.env.NEXT_PUBLIC_MAX_QUERY_TAKE),
    filter: {
      iMId: iMId,
    },
  });
  const { coAuthors } = useCoAuthors(coAuthorsQuery, refreshFlag);

  const addCoAuthor = async (activeFaculty: ActiveFaculty) => {
    console.log("Adding co-author");
    return axios
      .post(`/api/co_author/`, {
        iMId,
        activeFacultyId: activeFaculty.id,
      })
      .then(() => {
        addSnackbar("Co-author added successfully");
        refresh();
      })
      .catch((err: any) => {
        addSnackbar(
          err?.response?.data?.error?.message ?? "Unknown Error",
          "error"
        );
      });
  };

  return (
    <div className="mb-2">
      <p className="text-sm">Co-authors:</p>
      <div className="flex flex-wrap items-center gap-1">
        {coAuthors.map((coAuthor) => {
          return (
            <CoAuthorChip
              key={coAuthor.id}
              coAuthor={coAuthor}
              onDelete={refresh}
            />
          );
        })}
      </div>
      <div>
        <input
          type="text"
          placeholder="Name"
          className="w-72 my-1 rounded border-transparent focus:rounded-b-none focus:border-gray-500 focus:bg-white focus:ring-0 p-0"
          onChange={(e) => {
            setState((prev) => ({
              ...prev,
              filter: {
                ...prev.filter,
                name: e.target.value === "" ? undefined : e.target.value,
              },
            }));
          }}
          onFocus={() => {
            setOpenOptions(true);
          }}
          onBlur={(e) => {
            setTimeout(() => {
              if (!e.relatedTarget || !e.relatedTarget.closest(".options")) {
                setOpenOptions(false);
              }
            }, 0);
          }}
        />
        {count > 0 && openOptions && (
          <div className="rounded-b shadow-lg w-72 absolute bg-white">
            {activeFaculties.map((activeFaculty) => (
              <FacultyOption
                activeFaculty={activeFaculty}
                key={activeFaculty.id}
                onSelectFaculty={() => addCoAuthor(activeFaculty)}
              />
            ))}
          </div>
        )}
        {count < 1 && openOptions && (
          <div className="rounded-b shadow-lg w-72 absolute bg-white">
            <p className="text-palette_grey p-2 text-center">None found</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface CoAuthorChipProps {
  coAuthor: CoAuthor;
  onDelete: () => any;
}

function CoAuthorChip({ coAuthor, onDelete }: CoAuthorChipProps) {
  const user = useUserFaculty({
    id: coAuthor.facultyId,
  });
  const { addSnackbar } = useContext(SnackbarContext);
  const handleDelete = async () => {
    return axios
      .delete(`/api/co_author/${coAuthor.id}`)
      .then(() => {
        onDelete();
      })
      .catch((error: any) => {
        addSnackbar(
          error?.response?.data?.error?.message ?? "Unknown Error",
          "error"
        );
      });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="inline bg-palette_orange rounded-full px-1 text-xs flex items-center space-x-1">
      <p>{user.name}</p>
      <button
        className="bg-palette_blue rounded-full h-3 w-3 hover:bg-opacity-90 active:bg-opacity-100 flex items-center justify-center"
        onClick={handleDelete}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 384 512"
          className="h-2 w-2 fill-palette_white"
        >
          <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
        </svg>
      </button>
    </div>
  );
}

interface FacultyOptionProps {
  activeFaculty: ActiveFaculty;
  onSelectFaculty: () => any;
}
function FacultyOption({ activeFaculty, onSelectFaculty }: FacultyOptionProps) {
  const faculty = useFaculty({
    id: activeFaculty.facultyId,
  });
  const user = useUser({
    id: faculty?.userId,
  });

  if (!user) {
    return null;
  }

  return (
    <div className="hover:bg-palette_grey hover:bg-opacity-10 active:bg-opacity-30 w-72 p-1 text-palette_blue cursor-pointer select-none">
      <p
        onMouseDown={() => {
          onSelectFaculty();
        }}
      >
        {user?.name}
      </p>
    </div>
  );
}
