import Confirmation from "@/components/Confirmation";
import FileUpload from "@/components/FileUpload";
import IMHeader from "@/components/IMHeader";
import Loading from "@/components/Loading";
import MainLayout from "@/components/MainLayout";
import Modal from "@/components/Modal";
import { SnackbarContext } from "@/components/SnackbarProvider";
import useActiveFacultyMe from "@/hooks/useActiveFacultyMe";
import useCITLDirectorEndorsementIM from "@/hooks/useCITLDirectorEndorsementIM";
import useIM from "@/hooks/useIM";
import useQAMISSuggestionItemsOwn, {
  useQAMISSuggestionItemsOwnParams,
} from "@/hooks/useQAMISSuggestionItemsOwn";
import useQAMISSuggestionMe from "@/hooks/useQAMISSuggestionMe";
import useRefresh from "@/hooks/useRefresh";
import useSubmittedQAMISSuggestionIM from "@/hooks/useSubmittedQAMISSuggestionIM";
import {
  QAMISSuggestion,
  QAMISSuggestionItem,
  SubmittedQAMISSuggestion,
} from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import Error from "next/error";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import * as Yup from "yup";

export default function QAMISSuggestionPage() {
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
  const router = useRouter();
  const iMId = router.query.id;
  const iM = useIM({ id: iMId as string });
  const { addSnackbar } = useContext(SnackbarContext);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const submittedQAMISSuggestion = useSubmittedQAMISSuggestionIM({
    id: iMId as string,
  });
  const [openAdd, setOpenAdd] = useState(false);

  const cITLDirectorEndorsement = useCITLDirectorEndorsementIM({
    id: iMId as string,
  });
  const { refresh, refreshFlag } = useRefresh();
  const [state, setState] = useState<useQAMISSuggestionItemsOwnParams>({
    skip: 0,
    take: Number(process.env.NEXT_PUBLIC_MAX_QUERY_TAKE),
  });
  const qAMISSuggestion = useQAMISSuggestionMe(
    {
      id: iMId as string,
    },
    refreshFlag
  );
  const qAMISSuggestionItems = useQAMISSuggestionItemsOwn(state, refreshFlag);
  const [files, setFiles] = useState<{ iMFile?: File; qAMISFile?: File }>({
    iMFile: undefined,
    qAMISFile: undefined,
  });
  const activeFaculty = useActiveFacultyMe();
  useEffect(() => {
    console.log({ files });
  }, [files]);

  const [stepperState, setStepperState] = useState({ step: 1 });

  const uploadFiles = async (submittedQAMISSuggestionId: string) => {
    console.log({ state });
    if (!files?.iMFile || !files?.qAMISFile) return;

    const iMFormData = new FormData();
    iMFormData.append("file", files.iMFile);
    iMFormData.append("iMId", iMId as string);
    iMFormData.append(
      "submittedQAMISSuggestionId",
      submittedQAMISSuggestionId as string
    );
    return axios.post("/api/im_file", iMFormData).then((res) => {
      const iMFile = res.data;
      if (!files?.qAMISFile) return;

      const qAMISFormData = new FormData();
      qAMISFormData.append("file", files.qAMISFile);
      qAMISFormData.append(
        "submittedQAMISSuggestionId",
        submittedQAMISSuggestionId as string
      );
      return axios.post("/api/qamis_file", qAMISFormData).then((res) => {
        const qAMISFile = res.data;
        return axios.post("/api/qamis_revision", {
          iMFileId: iMFile.id,
          qAMISFileId: qAMISFile.id,
        });
      });
    });
  };

  const handleSubmitSuggestions = () => {
    if (!qAMISSuggestion || !files?.iMFile || !files?.qAMISFile) return;

    axios
      .post<SubmittedQAMISSuggestion>(`/api/submitted_qamis_suggestion`, {
        qAMISSuggestionId: qAMISSuggestion.id,
      })
      .then((res) => {
        const submittedQAMISSuggestion = res.data;
        uploadFiles(submittedQAMISSuggestion.id).then(() => {
          addSnackbar("IM has been submitted for review");
          router.push(`/im/${iMId}`);
        });
      })
      .catch((error: any) => {
        addSnackbar(
          error.response.data?.error?.message ?? "Failed to submit review",
          "error"
        );
      });
  };

  useEffect(() => {
    if (!qAMISSuggestion) return;

    setState((prev) => ({
      ...prev,
      id: qAMISSuggestion.id,
    }));
  }, [qAMISSuggestion]);

  useEffect(() => {
    if (submittedQAMISSuggestion) {
      router.push(`/im/${iMId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submittedQAMISSuggestion, iMId]);

  const AddSuggestionItem = () => {
    const formik = useFormik({
      initialValues: {
        suggestion: "",
        actionTaken: "",
        remarks: "",
        pageNumber: 0,
      },
      validationSchema: Yup.object({
        suggestion: Yup.string().required(),
        actionTaken: Yup.string().required(),
        remarks: Yup.string(),
        pageNumber: Yup.number().min(0).required(),
      }),
      onSubmit: (values) => {
        const submitSuggestionItem = async (qAMISSuggestionId: string) => {
          return axios
            .post(`/api/qamis_suggestion_item`, {
              ...values,
              qAMISSuggestionId,
            })
            .then(() => {
              addSnackbar("Suggestion has been added successfully");
            })
            .catch((error) => {
              addSnackbar(
                error.response.data?.error?.message ??
                "Failed to add suggestion",
                "error"
              );
            })
            .finally(() => {
              refresh();
              setOpenAdd(false);
            });
        };

        if (!qAMISSuggestion) {
          if (!cITLDirectorEndorsement) {
            return;
          }
          return axios
            .post<QAMISSuggestion>(`/api/qamis_suggestion/`, {
              cITLDirectorEndorsementId: cITLDirectorEndorsement.id,
            })
            .then((res) => {
              const createdQAMISSuggestion = res.data;

              return submitSuggestionItem(createdQAMISSuggestion.id);
            })
            .catch((error) => {
              console.error(error);
            });
        } else {
          return submitSuggestionItem(qAMISSuggestion.id);
        }
      },
    });

    return (
      <>
        <button
          disabled={loading}
          onClick={() => setOpenAdd(true)}
          className="bg-palette_blue text-palette_white inline-flex items-center space-x-2 hover:bg-opacity-90 rounded-md px-2 py-1 font-semibold text-sm"
        >
          <span>Add</span>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 448 512"
              className="fill-palette_white"
            >
              <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
            </svg>
          </span>
        </button>
        {openAdd && (
          <Modal title="Add Suggestion" onClose={() => setOpenAdd(false)}>
            <form noValidate onSubmit={formik.handleSubmit}>
              <div className="flex flex-col space-y-1">
                <textarea
                  placeholder="Suggestion"
                  {...formik.getFieldProps("suggestion")}
                  className="rounded"
                />
                <textarea
                  placeholder="Action Taken"
                  {...formik.getFieldProps("actionTaken")}
                  className="rounded"
                />
                <input
                  type="number"
                  placeholder="Page No."
                  {...formik.getFieldProps("pageNumber")}
                  className="rounded"
                />
                <textarea
                  placeholder="Remarks (optional)"
                  {...formik.getFieldProps("remarks")}
                  className="rounded"
                />
                <button
                  disabled={loading}
                  type="submit"
                  className="bg-palette_blue text-palette_white flex items-center space-x-2 justify-center hover:bg-opacity-90 rounded-md text-sm font-semibold px-4 py-2"
                >
                  <span>Submit</span>
                </button>
              </div>
            </form>
          </Modal>
        )}
      </>
    );
  };

  useEffect(() => {
    if (!iM || !activeFaculty) {
      return;
    }

    if (iM.facultyId !== activeFaculty.facultyId) {
      addSnackbar("Can only review own IM", "error");
      router.replace(`/im/${iMId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iM, activeFaculty]);

  if (iM === null) {
    return (
      <MainLayout>
        <Error statusCode={404} title="IM Not Found" />
      </MainLayout>
    );
  }
  if (iM === undefined) {
    return (
      <MainLayout>
        <Loading />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row h-full sm:overflow-auto md:space-x-4">
        <div className="md:flex-1 flex flex-col md:h-full sm:overflow-auto p-4 bg-palette_white rounded-2xl space-y-4">
          <IMHeader iM={iM} phase="IMERC Phase" role="Author" />

          <div className="flex-1 h-full sm:overflow-auto space-y-2">
            <div className="sm:overflow-auto">
              <div className="border border-palette_light_grey rounded text-sm">
                <div className="p-2 bg-palette_grey bg-opacity-10 flex justify-between items-center">
                  <p className="text-left font-medium">QAMIS Suggestions</p>
                  <AddSuggestionItem />
                </div>
                <hr />
                {qAMISSuggestionItems.qAMISSuggestionItems.map(
                  (qAMISSuggestionItem) => {
                    return (
                      <Item
                        qAMISSuggestionItem={qAMISSuggestionItem}
                        key={qAMISSuggestionItem.id}
                        refresh={refresh}
                      />
                    );
                  }
                )}

                {qAMISSuggestionItems.count < 1 && (
                  <p className="text-center text-xs text-palette_error w-full p-4">
                    Suggestions are required
                  </p>
                )}
              </div>
            </div>

            <UploadStepper state={stepperState} setState={setStepperState} hasQAMISFile={Boolean(files.qAMISFile)} hasIMFile={Boolean(files.iMFile)} />
            <div className="flex flex-col flex-1 min-h-screen-3/4">
              <div className={`h-full ${stepperState.step === 1 ? "visible" : "hidden"}`}>
                <FileUpload
                  label=""
                  onFileChange={(file) => {
                    setFiles((prev) => ({
                      ...prev,
                      qAMISFile: file,
                    }));
                    setStepperState(prev => ({ ...prev, step: 2 }));
                  }}
                  onFileReset={() => {
                    setFiles((prev) => ({
                      ...prev,
                      qAMISFile: undefined,
                    }));
                  }}
                  loading={loading}
                  onSubmit={handleSubmitSuggestions}
                  submitDisabled={
                    !Boolean(qAMISSuggestion) ||
                    !Boolean(files.iMFile) ||
                    !Boolean(files.qAMISFile) ||
                    loading
                  }
                />
              </div>
              <div className={`h-full ${stepperState.step === 2 ? "visible" : "hidden"}`}>
                <FileUpload
                  label=""
                  onFileChange={(file) => {
                    setFiles((prev) => ({
                      ...prev,
                      iMFile: file,
                    }));
                  }}
                  onFileReset={() => {
                    setFiles((prev) => ({
                      ...prev,
                      iMFile: undefined,
                    }));
                  }}
                  loading={loading}
                  onSubmit={handleSubmitSuggestions}
                  submitDisabled={
                    !Boolean(qAMISSuggestion) ||
                    !Boolean(files.iMFile) ||
                    !Boolean(files.qAMISFile) ||
                    loading
                  }
                />
              </div>

            </div>
          </div>
        </div>
        <div className="md:flex-1 h-screen-3/4 md:h-auto">
          <iframe
            loading="lazy"
            src={`/api/im_file/im/${iMId}/pdf`}
            className="w-full h-full"
          />
        </div>
      </div>
    </MainLayout>
  );
}

export interface QAMISSuggestionItemProps {
  qAMISSuggestionItem: QAMISSuggestionItem;
  refresh: () => any;
}
export function Item({
  qAMISSuggestionItem,
  refresh,
}: QAMISSuggestionItemProps) {
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
  const [state, setState] = useState({
    openConfirmation: false,
  });
  const router = useRouter();
  const handleDelete = () => {
    axios
      .delete(`/api/qamis_suggestion_item/${qAMISSuggestionItem.id}`)
      .then(() => {
        addSnackbar("Suggestion has been deleted successfully");
      })
      .catch((error) => {
        addSnackbar(
          error.response.data?.error?.message ?? "Failed to delete suggestion",
          "error"
        );
      })
      .finally(() => {
        refresh();
        setState((prev) => ({ ...prev, openConfirmation: false }));
      });
  };
  return (
    <div className="px-1 py-2">
      <div className="flex justify-end items-center space-x-1">
        <EditSuggestionItem
          qAMISSuggestionItem={qAMISSuggestionItem}
          refresh={refresh}
        />
        <>
          <button
            disabled={loading}
            className="bg-palette_blue text-palette_white inline-flex items-center space-x-1 justify-center hover:bg-opacity-90 rounded px-2 py-1 text-sm"
            onClick={() =>
              setState((prev) => ({ ...prev, openConfirmation: true }))
            }
          >
            <span>Delete</span>
          </button>
          {state.openConfirmation && (
            <Confirmation
              onClose={() => {
                setState((prev) => ({ ...prev, openConfirmation: false }));
              }}
              onConfirm={handleDelete}
            />
          )}
        </>
      </div>
      <div className="grid grid-cols-5 text-palette_grey">
        <p className="px-5 py-1 border-r border-palette_light_grey col-span-2 md:col-span-1">
          Page No.
        </p>
        <p className="px-5 flex-1 col-span-2 md:col-span-4">
          {qAMISSuggestionItem.pageNumber}
        </p>
        <p className="px-5 py-1 border-r border-palette_light_grey col-span-2 md:col-span-1">
          Suggestion
        </p>
        <p className="px-5 flex-1 col-span-2 md:col-span-4 whitespace-pre-wrap">
          {qAMISSuggestionItem.suggestion}
        </p>
        <p className="px-5 py-1 border-r border-palette_light_grey col-span-2 md:col-span-1">
          Remarks
        </p>
        <p className="px-5 flex-1 col-span-2 md:col-span-4 whitespace-pre-wrap">
          {qAMISSuggestionItem.remarks}
        </p>
        <p className="px-5 py-1 border-r border-palette_light_grey col-span-2 md:col-span-1">
          Action Taken
        </p>
        <p className="px-5 flex-1 col-span-2 md:col-span-4 whitespace-pre-wrap">
          {qAMISSuggestionItem.actionTaken}
        </p>
      </div>
    </div>
  );
}

interface EditSuggestionItemProps {
  qAMISSuggestionItem: QAMISSuggestionItem;
  refresh: () => any;
}
function EditSuggestionItem({
  qAMISSuggestionItem,
  refresh,
}: EditSuggestionItemProps) {
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
  const router = useRouter();
  const [openEdit, setOpenEdit] = useState(false);
  const formik = useFormik({
    initialValues: {
      suggestion: "",
      actionTaken: "",
      pageNumber: 0,
      remarks: "",
    },
    validationSchema: Yup.object({
      suggestion: Yup.string().required(),
      actionTaken: Yup.string().required(),
      pageNumber: Yup.number().min(0).required(),
      remarks: Yup.string(),
    }),
    onSubmit: (values) => {
      axios
        .put(`/api/qamis_suggestion_item/${qAMISSuggestionItem.id}`, values)
        .then(() => {
          addSnackbar("Suggestion has been updated successfully");
        })
        .catch((error) => {
          addSnackbar(
            error.response.data?.error?.message ??
            "Failed to update suggestion",
            "error"
          );
        })
        .finally(() => {
          refresh();
          setOpenEdit(false);
        });
    },
  });

  useEffect(() => {
    if (!qAMISSuggestionItem) return;
    formik.setValues({
      pageNumber: qAMISSuggestionItem.pageNumber,
      actionTaken: qAMISSuggestionItem.actionTaken ?? "",
      remarks: qAMISSuggestionItem?.remarks ?? "",
      suggestion: qAMISSuggestionItem.suggestion,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qAMISSuggestionItem]);

  return (
    <div>
      <button
        disabled={loading}
        className="bg-palette_blue text-palette_white inline-flex items-center space-x-1 justify-center hover:bg-opacity-90 rounded px-2 py-1 text-sm"
        onClick={() => setOpenEdit(true)}
      >
        <span>Edit</span>
      </button>

      {openEdit && (
        <Modal title="Edit Suggestion Item" onClose={() => setOpenEdit(false)}>
          <form noValidate onSubmit={formik.handleSubmit}>
            <div className="flex flex-col space-y-1">
              <textarea
                placeholder="Suggestion"
                {...formik.getFieldProps("suggestion")}
                className="rounded"
              />
              <textarea
                placeholder="Action Taken"
                {...formik.getFieldProps("actionTaken")}
                className="rounded"
              />
              <input
                type="number"
                placeholder="Page No."
                {...formik.getFieldProps("pageNumber")}
                className="rounded"
              />
              <textarea
                placeholder="Remarks (optional)"
                {...formik.getFieldProps("remarks")}
                className="rounded"
              />
              <button
                disabled={loading}
                type="submit"
                className="bg-palette_blue text-white inline-flex items-center justify-center space-x-2 hover:bg-opacity-90 rounded-md text-sm font-semibold px-4 py-2"
              >
                <span>Submit</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function UploadStepper({ state, setState, hasQAMISFile, hasIMFile }: {
  setState: Dispatch<SetStateAction<{
    step: number;
  }>>
  , state: { step: number },
  hasQAMISFile: boolean, hasIMFile: boolean
}) {

  return <div className="flex justify-left items-center space-x-4 border py-2 px-4 rounded-md bg-palette_grey bg-opacity-5">
    <p className={`cursor-pointer flex justify-center items-center space-x-1  ${state.step >= 1 && hasQAMISFile ? "text-palette_blue" : "text-palette_grey"}`} onClick={() => {
      setState(prev => ({ ...prev, step: 1 }))
    }}>
      <span className={`inline-flex h-5 w-5 border rounded-full justify-center items-center ${state.step >= 1 ? "border-palette_blue" : "border-palette_grey"}`}>
        <span className="text-xs">1</span>
      </span>
      <span className="text-sm font-medium">Upload QAMIS File</span>
    </p>
    <svg className={`w-3 h-3 ms-2 sm:ms-4 rtl:rotate-180 ${state.step === 2 || hasQAMISFile || hasIMFile ? "stroke-palette_blue" : "stroke-palette_grey"}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 10">
      <path stroke="" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="m7 9 4-4-4-4M1 9l4-4-4-4" />
    </svg>
    <p className={`cursor-pointer flex justify-center items-center space-x-1  ${state.step < 2 && !hasIMFile ? "text-palette_grey" : "text-palette_blue"}`} onClick={() => {
      setState(prev => ({ ...prev, step: 2 }))
    }}>
      <span className={`inline-flex h-5 w-5 border rounded-full justify-center items-center ${state.step < 2 && !hasIMFile ? "border-palette_grey" : "border-palette_blue"}`}>
        <span className="text-xs">2</span>
      </span>
      <span className="text-sm font-medium">Upload IM File</span>
    </p>
  </div >
}