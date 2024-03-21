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

interface IMIMERCCITLIDDCoordinatorEndorsedProps {
  iMId: string;
  onRefresh: () => any;
  refreshFlag?: number;
}
export default function IMIMERCCITLIDDCoordinatorEndorsed({
  iMId,
  onRefresh = () => {},
  refreshFlag,
}: IMIMERCCITLIDDCoordinatorEndorsedProps) {
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

  const iMERCCITLDirectorEndorsementHandler = async () => {
    if (!activeCITLDirector) return;

    return axios
      .get<DepartmentRevision>(
        `/api/imerc_idd_coordinator_endorsement/im/${iMId}`
      )
      .then((res) => {
        const iMERCIDDCoordinatorEndorsement = res.data;
        if (!iMERCIDDCoordinatorEndorsement) return;

        return axios
          .post<CoordinatorEndorsement>(
            `/api/imerc_citl_director_endorsement`,
            {
              iMERCIDDCoordinatorEndorsementId:
                iMERCIDDCoordinatorEndorsement.id,
              activeCITLDirectorId: activeCITLDirector.id,
            }
          )
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
    <div className="flex flex-col sm:flex-row h-full overflow-auto sm:space-x-4 space-y-4 sm:space-y-0">
      <div className="flex-1 h-full sm:overflow-auto bg-palette_white p-4 rounded-2xl flex flex-col space-y-2">
        <div className="w-full flex space-between">
          <p className="uppercase font-semibold flex-1">DOCUMENT INFORMATION</p>

          <IMActionMenu
            iMId={iMId}
            onRefresh={onRefresh}
            refreshFlag={refreshFlag}
          />
        </div>

        <div className="space-y-2 flex-1 sm:overflow-auto ">
          <IMInfo iMId={iMId} onRefresh={onRefresh} refreshFlag={refreshFlag} />
          <div className="flex-1 sm:overflow-auto space-y-2">
            {activeCITLDirector && (
              <div>
                <>
                  <button
                    disabled={loading}
                    className="rounded text-palette_white bg-palette_blue px-2 py-1 disabled:bg-opacity-50 flex items-center space-x-2 hover:bg-opacity-90"
                    onClick={openConfirmation}
                  >
                    <span>Endorse IM</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="1em"
                      viewBox="0 0 448 512"
                      className="fill-palette_white"
                    >
                      <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                    </svg>
                  </button>
                  {state.openConfirmation && (
                    <Confirmation
                      onClose={closeConfirmation}
                      onConfirm={iMERCCITLDirectorEndorsementHandler}
                    />
                  )}
                </>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="sm:flex-1 h-screen-3/4 sm:h-full">
        {iMFile && (
          <div className="sm:flex-1 h-screen-3/4 sm:h-full">
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
