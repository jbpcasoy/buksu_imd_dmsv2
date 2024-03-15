import Confirmation from "@/components/Confirmation";
import Loading from "@/components/Loading";
import { SnackbarContext } from "@/components/SnackbarProvider";
import IMActionMenu from "@/components/im/IMActionMenu";
import useActiveFacultyMe from "@/hooks/useActiveFacultyMe";
import useIM from "@/hooks/useIM";
import { DepartmentReview, IMFile } from "@prisma/client";
import axios from "axios";
import Error from "next/error";
import { useRouter } from "next/router";
import { ChangeEvent, useContext, useState } from "react";
import IMInfo from "./IMInfo";

interface IMImplementationDraftProps {
  iMId: string;
  onRefresh: () => any;
  refreshFlag?: number;
}
export default function IMImplementationDraft({
  iMId,
  onRefresh = () => {},
  refreshFlag,
}: IMImplementationDraftProps) {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<{
    filePreview?: string;
    iMFile?: File | null;
    openConfirmation: boolean;
  }>({
    openConfirmation: false,
  });
  const iM = useIM({
    id: iMId,
    refreshFlag,
  });
  const activeFaculty = useActiveFacultyMe();
  const router = useRouter();
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

  const submitForReviewHandler = async () => {
    if (!state?.iMFile || !iMId) return;

    const formData = new FormData();
    formData.append("file", state.iMFile);
    formData.append("iMId", iMId as string);
    return axios
      .post<IMFile>("/api/im_file", formData)
      .then(async (res) => {
        return axios
          .post<DepartmentReview>("/api/department_review/", {
            iMFileId: res.data.id,
          })
          .then(() => {
            addSnackbar("IM has been submitted for review");
          });
      })
      .catch((error) => {
        addSnackbar(
          error.response.data?.error?.message ?? "Failed to submit for review",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  };

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
  };

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
    <div className="flex flex-col sm:flex-row h-full overflow-auto sm:space-x-4 space-y-4 sm:space-y-0">
      <div className="flex-1 h-full sm:overflow-auto">
        <div className="bg-palette_white h-full rounded-2xl p-4 sm:overflow-auto flex flex-col space-y-2">
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

          <div className="space-y-2 flex-1 sm:overflow-auto">
            <IMInfo
              iMId={iMId}
              onRefresh={onRefresh}
              refreshFlag={refreshFlag}
            />
            {iM.facultyId === activeFaculty?.facultyId && (
              <div className="flex space-x-2">
                <button
                  className="rounded text-palette_white bg-palette_blue p-2 disabled:bg-opacity-50 space-x-2 w-full"
                  disabled={Boolean(!state?.iMFile) || loading}
                  onClick={openConfirmation}
                >
                  Submit for Review
                </button>
                {state.openConfirmation && (
                  <Confirmation
                    onClose={closeConfirmation}
                    onConfirm={submitForReviewHandler}
                  />
                )}
                <button
                  className="rounded text-palette_white bg-palette_blue p-2 disabled:bg-opacity-50 space-x-2 w-1/4"
                  disabled={Boolean(!state?.iMFile) || loading}
                  onClick={handleFileReset}
                >
                  Replace
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="sm:flex-1 h-screen-3/4 sm:h-full">
        {iM.facultyId === activeFaculty?.facultyId && (
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
                  onDrop={(e) => {
                    e.dataTransfer.files;
                  }}
                >
                  <span className="text-palette_grey text-sm">UPLOAD FILE</span>
                </label>
              </div>
            )}
            {state?.filePreview && (
              <iframe
                loading="lazy"
                src={state.filePreview}
                className="w-full h-full rounded-2xl"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
