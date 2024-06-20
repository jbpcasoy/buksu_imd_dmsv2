import Confirmation from "@/components/Confirmation";
import Loading from "@/components/Loading";
import { SnackbarContext } from "@/components/SnackbarProvider";
import IMActionMenu from "@/components/im/IMActionMenu";
import useActiveIDDCoordinatorMe from "@/hooks/useActiveIDDCoordinatorMe";
import useIM from "@/hooks/useIM";
import useIMLatestIMFile from "@/hooks/useIMLatestIMFile.";
import { CoordinatorEndorsement, DepartmentRevision } from "@prisma/client";
import axios from "axios";
import Error from "next/error";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import IMInfo from "./IMInfo";

interface IMImplementationCITLRevisedProps {
  iMId: string;
  onRefresh: () => any;
  refreshFlag?: number;
}
export default function IMImplementationCITLRevised({
  iMId,
  onRefresh = () => { },
  refreshFlag,
}: IMImplementationCITLRevisedProps) {
  const activeIDDCoordinator = useActiveIDDCoordinatorMe();
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
  const iMFile = useIMLatestIMFile({
    id: iMId,
  });
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

  const iDDCoordinatorEndorsementHandler = async () => {
    if (!activeIDDCoordinator) return;

    return axios
      .get<DepartmentRevision>(`/api/citl_revision/im/${iMId}`)
      .then((res) => {
        const cITLRevision = res.data;
        if (!cITLRevision) return;

        return axios
          .post<CoordinatorEndorsement>(`/api/idd_coordinator_endorsement`, {
            cITLRevisionId: cITLRevision.id,
            activeIDDCoordinatorId: activeIDDCoordinator.id,
          })
          .then(() => addSnackbar("Successfully endorsed IM"));
      })
      .catch((error) => {
        addSnackbar(
          error.response.data?.error?.message ?? "Failed to endorse IM",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  };

  const returnCoordinatorEndorsementHandler = async () => {
    router.push(`/im/${iMId}/returned_citl_revision`);
  };

  if (iM === null) {
    return <Error statusCode={404} title="IM Not Found" />;
  }
  if (iM === undefined) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col md:flex-row h-full overflow-auto md:space-x-4 space-y-4 md:space-y-0">
      <div className="flex-1 h-full md:overflow-auto bg-palette_white p-4 rounded-2xl flex flex-col space-y-2">
        <div className="w-full flex space-between">
          <p className="font-semibold flex-1">Document Information</p>

          <IMActionMenu
            iMId={iMId}
            onRefresh={onRefresh}
            refreshFlag={refreshFlag}
          />
        </div>

        <div className="space-y-2 flex-1 md:overflow-auto h-full flex flex-col">
          <IMInfo iMId={iMId} onRefresh={onRefresh} refreshFlag={refreshFlag} />
          <div className="flex-1 md:overflow-auto space-y-2 flex flex-col justify-end">
            {activeIDDCoordinator && (
              <div className="space-y-1 md:space-y-0 md:space-x-1 flex flex-col md:flex-row justify-end">
                <button
                  disabled={loading}
                  className="p-2 disabled:border-opacity-50 flex items-center justify-center space-x-2 hover:border-opacity-90 rounded-md border border-palette_blue text-palette_blue"
                  onClick={returnCoordinatorEndorsementHandler}
                >
                  Return
                </button>
                <button
                  disabled={loading}
                  className="rounded text-palette_white bg-palette_blue p-2 disabled:bg-opacity-50 flex items-center justify-center space-x-2 hover:bg-opacity-90"
                  onClick={openConfirmation}
                >
                  Endorse
                </button>
                {state.openConfirmation && (
                  <Confirmation
                    onClose={closeConfirmation}
                    onConfirm={iDDCoordinatorEndorsementHandler}
                  />
                )}
              </div>
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
