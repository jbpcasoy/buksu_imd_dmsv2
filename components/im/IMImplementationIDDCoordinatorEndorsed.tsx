import Confirmation from "@/components/Confirmation";
import Loading from "@/components/Loading";
import { SnackbarContext } from "@/components/SnackbarProvider";
import IMActionMenu from "@/components/im/IMActionMenu";
import useActiveCITLDirectorMe from "@/hooks/useActiveCITLDirectorMe";
import useIM from "@/hooks/useIM";
import useIMLatestIMFile from "@/hooks/useIMLatestIMFile.";
import { CoordinatorEndorsement, DepartmentRevision } from "@prisma/client";
import axios from "axios";
import Error from "next/error";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import IMInfo from "./IMInfo";

interface IMImplementationIDDCoordinatorEndorsedProps {
  iMId: string;
  onRefresh: () => any;
  refreshFlag?: number;
}
export default function IMImplementationIDDCoordinatorEndorsed({
  iMId,
  onRefresh = () => { },
  refreshFlag,
}: IMImplementationIDDCoordinatorEndorsedProps) {
  const activeCITLDirector = useActiveCITLDirectorMe();
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

  const cITLDirectorEndorsementHandler = async () => {
    if (!activeCITLDirector) return;

    return axios
      .get<DepartmentRevision>(`/api/idd_coordinator_endorsement/im/${iMId}`)
      .then((res) => {
        const iDDCoordinatorEndorsement = res.data;
        if (!iDDCoordinatorEndorsement) return;

        return axios
          .post<CoordinatorEndorsement>(`/api/citl_director_endorsement`, {
            iDDCoordinatorEndorsementId: iDDCoordinatorEndorsement.id,
            activeCITLDirectorId: activeCITLDirector.id,
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
          <p className="uppercase font-semibold flex-1">DOCUMENT INFORMATION</p>

          <IMActionMenu
            iMId={iMId}
            onRefresh={onRefresh}
            refreshFlag={refreshFlag}
          />
        </div>

        <div className="space-y-2 flex-1 md:overflow-auto flex flex-col">
          <IMInfo iMId={iMId} onRefresh={onRefresh} refreshFlag={refreshFlag} />
          <div className="flex-1 md:overflow-auto space-y-2 flex flex-col justify-end">
            {activeCITLDirector && (
              <div className="space-y-1 md:space-y-0 md:space-x-1 flex flex-col md:flex-row justify-end">
                <div>
                  <button
                    disabled={loading}
                    className="text-palette_white bg-palette_blue p-2 disabled:bg-opacity-50 flex items-center justify-center space-x-2 hover:bg-opacity-90 rounded-md text-sm font-semibold px-4 py-2"
                    onClick={openConfirmation}
                  >
                    <span>Endorse</span>
                  </button>
                  {state.openConfirmation && (
                    <Confirmation
                      onClose={closeConfirmation}
                      onConfirm={cITLDirectorEndorsementHandler}
                    />
                  )}
                </div>
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
