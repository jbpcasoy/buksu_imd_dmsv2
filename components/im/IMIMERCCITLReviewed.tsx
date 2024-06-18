import Loading from "@/components/Loading";
import IMActionMenu from "@/components/im/IMActionMenu";
import useActiveFacultyMe from "@/hooks/useActiveFacultyMe";
import useIM from "@/hooks/useIM";
import useIMERCCITLReviewedIM from "@/hooks/useIMERCCITLReviewedIM";
import useIMLatestIMFile from "@/hooks/useIMLatestIMFile.";
import useIMLatestPlagiarismFile from "@/hooks/useIMLatestPlagiarismFile";
import useIMStatus from "@/hooks/useIMStatus";
import useSubmittedReturnedIMERCCITLRevisionIM from "@/hooks/useSubmittedReturnedIMERCCITLRevisionIM";
import axios from "axios";
import Error from "next/error";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import Confirmation from "../Confirmation";
import FileUpload from "../FileUpload";
import IMContentEditorSuggestionItems from "../IMContentEditorSuggestionItems";
import IMContentSpecialistSuggestionItems from "../IMContentSpecialistSuggestionItems";
import IMIDDSpecialistSuggestionItems from "../IMIDDSpecialistSuggestionItems";
import IMReturnedIMERCCITLRevisionSuggestionItems from "../IMReturnedIMERCCITLRevisionSuggestionItems";
import { SnackbarContext } from "../SnackbarProvider";
import IMInfo from "./IMInfo";

interface IMIMERCCITLReviewedProps {
  iMId: string;
  onRefresh: () => any;
  refreshFlag?: number;
}
export default function IMIMERCCITLReviewed({
  iMId,
  onRefresh = () => { },
  refreshFlag,
}: IMIMERCCITLReviewedProps) {
  const [state, setState] = useState<{
    iMFile?: File | null;
    plagiarismFile?: File | null;
    openConfirmation: boolean;
  }>({
    openConfirmation: false,
  });
  const iM = useIM({
    id: iMId,
    refreshFlag,
  });
  const iMFile = useIMLatestIMFile({
    id: iMId,
  });
  const plagiarismFile = useIMLatestPlagiarismFile({ id: iMId as string });
  const iMStatus = useIMStatus({
    id: iMId,
  });

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

  const iMERCCITLReviewed = useIMERCCITLReviewedIM({
    id: iMId as string,
  });
  const submittedReturnedIMERCCITLRevision =
    useSubmittedReturnedIMERCCITLRevisionIM({
      id: iMId as string,
    });
  const activeFaculty = useActiveFacultyMe();
  const router = useRouter();
  const { addSnackbar } = useContext(SnackbarContext);

  const submitForIMERCCITLEndorsementHandler = async () => {
    console.log({ state });
    if (
      !state?.iMFile ||
      (!state?.plagiarismFile && !plagiarismFile) ||
      !iMERCCITLReviewed
    )
      return;

    const iMFormData = new FormData();
    iMFormData.append("file", state.iMFile);
    iMFormData.append("iMId", iMId as string);
    if (submittedReturnedIMERCCITLRevision) {
      iMFormData.append(
        "submittedReturnedIMERCCITLRevisionId",
        submittedReturnedIMERCCITLRevision.id
      );
    } else {
      iMFormData.append("iMERCCITLReviewedId", iMERCCITLReviewed.id);
    }
    return axios
      .post("/api/im_file", iMFormData)
      .then((res) => {
        const iMFile = res.data;
        if (!state?.plagiarismFile && !plagiarismFile) return;

        const plagiarismFormData = new FormData();
        plagiarismFormData.append("iMERCCITLReviewedId", iMERCCITLReviewed.id);
        if (!plagiarismFile) {
          if (state.plagiarismFile) {
            plagiarismFormData.append("file", state.plagiarismFile);
          }
          console.log("No plagiarism file detected");
          return axios
            .post("/api/plagiarism_file", plagiarismFormData)
            .then((res) => {
              const plagiarismFile = res.data;
              return axios
                .post("/api/imerc_citl_revision", {
                  iMFileId: iMFile.id,
                  plagiarismFileId: plagiarismFile.id,
                })
                .then(() => {
                  addSnackbar("IM has been submitted for endorsement");
                });
            });
        } else {
          console.log("A plagiarism file detected");
          return axios
            .post("/api/imerc_citl_revision", {
              iMFileId: iMFile.id,
              plagiarismFileId: plagiarismFile.id,
            })
            .then(() => {
              addSnackbar("IM has been submitted for endorsement");
            });
        }
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

  if (iM === null) {
    return <Error statusCode={404} title="IM Not Found" />;
  }
  if (iM === undefined) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col md:flex-row h-full overflow-auto md:space-x-4 space-y-4 md:space-y-0">
      <div className="flex-1 h-full md:overflow-auto">
        <div className="bg-palette_white h-full rounded-2xl p-4 overflow-auto flex flex-col space-y-2">
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
          <div className="md:overflow-auto flex-1 space-y-2">
            <IMInfo
              iMId={iMId}
              onRefresh={onRefresh}
              refreshFlag={refreshFlag}
            />
            {iM.facultyId === activeFaculty?.facultyId && (
              <>
                <IMContentSpecialistSuggestionItems
                  id={iM.id}
                  editable={iMStatus !== "IMERC_CITL_RETURNED_REVISION"}
                />
                <IMIDDSpecialistSuggestionItems
                  id={iM.id}
                  editable={iMStatus !== "IMERC_CITL_RETURNED_REVISION"}
                />
                <IMContentEditorSuggestionItems
                  id={iM.id}
                  editable={iMStatus !== "IMERC_CITL_RETURNED_REVISION"}
                />
                <IMReturnedIMERCCITLRevisionSuggestionItems id={iM.id} />
                <div className="space-y-2">
                  {!plagiarismFile && (
                    <FileUpload
                      label="UPLOAD PLAGIARISM FILE"
                      onFileChange={(file) => {
                        setState((prev) => ({
                          ...prev,
                          plagiarismFile: file,
                        }));
                      }}
                      onFileReset={() => {
                        setState((prev) => ({
                          ...prev,
                          iMFile: undefined,
                        }));
                      }}
                      loading={loading}
                    />
                  )}
                  <FileUpload
                    label="UPLOAD IM FILE"
                    onFileChange={(file) => {
                      setState((prev) => ({
                        ...prev,
                        iMFile: file,
                      }));
                    }}
                    onFileReset={() => {
                      setState((prev) => ({
                        ...prev,
                        qAMISFile: undefined,
                      }));
                    }}
                    loading={loading}
                  />
                </div>
                <div>
                  <button
                    className="rounded text-palette_white bg-palette_blue p-2 disabled:bg-opacity-50 flex items-center justify-center space-x-2 hover:bg-opacity-90 w-full"
                    onClick={openConfirmation}
                    disabled={!Boolean(state.iMFile) || loading}
                  >
                    Submit for endorsement
                  </button>
                  {state.openConfirmation && (
                    <Confirmation
                      onClose={closeConfirmation}
                      onConfirm={submitForIMERCCITLEndorsementHandler}
                    />
                  )}
                </div>
              </>
            )}
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
              className="w-full h-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}
