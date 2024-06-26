import Loading from "@/components/Loading";
import IMActionMenu from "@/components/im/IMActionMenu";
import useActiveFacultyMe from "@/hooks/useActiveFacultyMe";
import useIM from "@/hooks/useIM";
import useIMLatestIMFile from "@/hooks/useIMLatestIMFile.";
import useIMStatus from "@/hooks/useIMStatus";
import useSubmittedIDDCoordinatorSuggestionIM from "@/hooks/useSubmittedIDDCoordinatorSuggestionIM";
import useSubmittedReturnedCITLRevisionIM from "@/hooks/useSubmittedReturnedCITLRevisionIM";
import { DepartmentReview, IMFile } from "@prisma/client";
import axios from "axios";
import Error from "next/error";
import { useRouter } from "next/router";
import { ChangeEvent, DragEvent, useContext, useState } from "react";
import Confirmation from "../Confirmation";
import IMIDDCoordinatorSuggestionItems from "../IMIDDCoordinatorSuggestionItems";
import IMReturnedCITLRevisionSuggestionItems from "../IMReturnedCITLRevisionSuggestionItems";
import { SnackbarContext } from "../SnackbarProvider";
import IMInfo from "./IMInfo";

interface IMImplementationCITLReviewedProps {
  iMId: string;
  onRefresh: () => any;
  refreshFlag?: number;
}
export default function IMImplementationCITLReviewed({
  iMId,
  onRefresh = () => {},
  refreshFlag,
}: IMImplementationCITLReviewedProps) {
  const iM = useIM({
    id: iMId,
    refreshFlag,
  });
  const iMFile = useIMLatestIMFile({
    id: iMId,
  });
  const activeFaculty = useActiveFacultyMe();
  const [state, setState] = useState<{
    iMFile?: File | null;
    plagiarismFile?: File | null;
    filePreview?: string;
    openConfirmation: boolean;
  }>({
    openConfirmation: false,
  });
  const iMStatus = useIMStatus({
    id: iMId,
  });

  const { addSnackbar } = useContext(SnackbarContext);

  const closeConfirmation = () => {
    setState((prev) => ({
      ...prev,
      openConfirmation: false,
    }));
  };

  const openConfirmation = () => {
    setState((prev) => ({
      ...prev,
      openConfirmation: true,
    }));
  };

  const router = useRouter();

  const submittedReturnedCITLRevision = useSubmittedReturnedCITLRevisionIM({
    id: iMId,
  });

  const submittedIDDCoordinatorSuggestion =
    useSubmittedIDDCoordinatorSuggestionIM({
      id: iMId,
    });

  const submitForCITLEndorsementHandler = async () => {
    if (!state?.iMFile || !iMId || !submittedIDDCoordinatorSuggestion) return;

    const formData = new FormData();
    formData.append("file", state.iMFile);
    formData.append("iMId", iMId as string);
    if (submittedReturnedCITLRevision) {
      formData.append(
        "submittedReturnedCITLRevisionId",
        submittedReturnedCITLRevision.id
      );
    } else {
      formData.append(
        "submittedIDDCoordinatorSuggestionId",
        submittedIDDCoordinatorSuggestion.id
      );
    }
    return axios
      .post<IMFile>("/api/im_file", formData)
      .then(async (res) => {
        return axios
          .post<DepartmentReview>("/api/citl_revision/", {
            iMFileId: res.data.id,
          })
          .then(() => {
            addSnackbar("IM has been submitted for endorsement");
          });
      })
      .catch((error) => {
        addSnackbar(
          error.response.data?.error?.message ??
            "Failed to submit IM for endorsement",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  };

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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const file = files?.item(0);
    handleFile(file);
  };

  const handleFileDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    const file = files?.item(0);
    handleFile(file);
  };

  function handleFile(file: File | null | undefined) {
    if (file) {
      setState((prev) => ({
        ...prev,
        filePreview: URL.createObjectURL(file),
        iMFile: file,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        filePreview: undefined,
        iMFile: undefined,
      }));
    }
  }

  const handleFileReset = () => {
    setState((prev) => ({
      ...prev,
      filePreview: undefined,
      iMFile: undefined,
    }));
  };

  if (iM === null) {
    return <Error statusCode={404} title="IM Not Found" />;
  }
  if (iM === undefined) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col md:flex-row h-full overflow-auto md:space-x-4 space-y-4 md:space-y-0">
      <div className="flex-1 h-full md:overflow-auto">
        <div className="bg-palette_white h-full rounded-2xl p-4 md:overflow-auto flex flex-col space-y-2">
          <div className="w-full flex space-between">
            <p className="uppercase font-semibold flex-1">
              DOCUMENT INFORMATION
            </p>

            <IMActionMenu
              iMId={iMId}
              onRefresh={onRefresh}
              refreshFlag={refreshFlag}
            />
          </div>
          <div className="flex-1 space-y-2 md:overflow-auto">
            <IMInfo
              iMId={iMId}
              onRefresh={onRefresh}
              refreshFlag={refreshFlag}
            />
            <div className="space-x-2 my-2">
              {iM.facultyId === activeFaculty?.facultyId && (
                <div className="space-y-2">
                  <div className="space-y-2">
                    <IMIDDCoordinatorSuggestionItems
                      id={iM.id}
                      editable={
                        iMStatus !== "IMPLEMENTATION_CITL_RETURNED_REVISION"
                      }
                    />
                    <IMReturnedCITLRevisionSuggestionItems id={iM.id} />
                  </div>
                  <div className="space-y-2">
                    {iM.facultyId === activeFaculty?.facultyId && (
                      <div className="h-screen-3/4">
                        <div className="w-full h-full">
                          {!state?.filePreview && (
                            <div className="h-full">
                              <input
                                hidden={true}
                                id="implementation_draft_upload"
                                type="file"
                                onChange={handleFileChange}
                                accept=".pdf"
                              />
                              <label
                                htmlFor="implementation_draft_upload"
                                className="border-2 border-dashed rounded-2xl h-full flex justify-center items-center cursor-pointer"
                                onDrop={handleFileDrop}
                                onDragOver={(e) => {
                                  e.preventDefault();
                                }}
                              >
                                <div className="flex flex-col justify-center items-center space-y-4">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    className="w-6 h-6 stroke-palette_grey"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                                    />
                                  </svg>

                                  <span className="text-palette_grey">
                                    <span className="font-bold">
                                      Click to upload
                                    </span>{" "}
                                    or drag and <br />
                                    drop PDF only (MAX 100MB)
                                  </span>
                                </div>
                              </label>
                            </div>
                          )}
                          {state?.filePreview && (
                            <iframe
                              loading="lazy"
                              src={state.filePreview}
                              className="w-full h-full rounded-lg"
                            />
                          )}
                        </div>
                      </div>
                    )}

                    {iM.facultyId === activeFaculty?.facultyId && (
                      <div className="flex space-x-2">
                        <button
                          className="rounded text-palette_white bg-palette_blue p-2 disabled:bg-opacity-50 space-x-2 w-full hover:bg-opacity-90"
                          disabled={Boolean(!state?.iMFile) || loading}
                          onClick={openConfirmation}
                        >
                          Submit for endorsement
                        </button>
                        {state.openConfirmation && (
                          <Confirmation
                            onClose={closeConfirmation}
                            onConfirm={submitForCITLEndorsementHandler}
                          />
                        )}
                        <button
                          className="rounded text-palette_white bg-palette_blue p-2 disabled:bg-opacity-50 space-x-2 w-1/4 hover:bg-opacity-90"
                          disabled={Boolean(!state?.iMFile) || loading}
                          onClick={handleFileReset}
                        >
                          Replace
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="md:flex-1 h-screen-3/4 md:h-full">
        {iMFile && (
          <div className="md:flex-1 h-screen-3/4 md:h-full">
            <iframe
              loading="lazy"
              src={`/api/im_file/${iMFile.id}/pdf`}
              title={iM.title}
              className="w-full h-full rounded-2xl"
            />
          </div>
        )}
      </div>
    </div>
  );
}
