import Loading from "@/components/Loading";
import IMActionMenu from "@/components/im/IMActionMenu";
import useActiveIDDCoordinatorMe from "@/hooks/useActiveIDDCoordinatorMe";
import useIM from "@/hooks/useIM";
import useIMLatestIMFile from "@/hooks/useIMLatestIMFile.";
import {
  IMERCCITLRevision,
  IMERCIDDCoordinatorEndorsement,
} from "@prisma/client";
import axios from "axios";
import Error from "next/error";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import Confirmation from "../Confirmation";
import IMContentEditorSuggestionItems from "../IMContentEditorSuggestionItems";
import IMContentSpecialistSuggestionItems from "../IMContentSpecialistSuggestionItems";
import IMIDDSpecialistSuggestionItems from "../IMIDDSpecialistSuggestionItems";
import IMReturnedIMERCCITLRevisionSuggestionItems from "../IMReturnedIMERCCITLRevisionSuggestionItems";
import { SnackbarContext } from "../SnackbarProvider";
import IMInfo from "./IMInfo";

interface IMIMERCCITLRevisedProps {
  iMId: string;
  onRefresh: () => any;
  refreshFlag?: number;
}
export default function IMIMERCCITLRevised({
  iMId,
  onRefresh = () => { },
  refreshFlag,
}: IMIMERCCITLRevisedProps) {
  const [state, setState] = useState<{
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
  const activeIDDCoordinator = useActiveIDDCoordinatorMe();
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

  const { addSnackbar } = useContext(SnackbarContext);
  const router = useRouter();
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

  const iMERCIDDCoordinatorEndorsementHandler = async () => {
    if (!activeIDDCoordinator) return;

    return axios
      .get<IMERCCITLRevision>(`/api/imerc_citl_revision/im/${iMId}`)
      .then((res) => {
        const iMERCCITLRevision = res.data;
        if (!iMERCCITLRevision) return;

        return axios
          .post<IMERCIDDCoordinatorEndorsement>(
            `/api/imerc_idd_coordinator_endorsement`,
            {
              iMERCCITLRevisionId: iMERCCITLRevision.id,
              activeIDDCoordinatorId: activeIDDCoordinator.id,
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

  const returnIMERCIDDCoordinatorEndorsementHandler = async () => {
    return router.push(`/im/${iMId}/returned_imerc_citl_revision`);
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

            {activeIDDCoordinator && (
              <div className="space-y-2">
                <IMContentSpecialistSuggestionItems
                  id={iM.id}
                  editable={false}
                />
                <IMIDDSpecialistSuggestionItems id={iM.id} editable={false} />
                <IMContentEditorSuggestionItems id={iM.id} editable={false} />
                <IMReturnedIMERCCITLRevisionSuggestionItems
                  id={iM.id}
                  editable={false}
                />
                <div className="space-y-1 md:space-y-0 md:space-x-1 flex flex-col md:flex-row justify-end">
                  <button
                    disabled={loading}
                    className="flex items-center justify-center space-x-2 rounded-md text-sm font-semibold px-4 py-2 border border-palette_blue hover:border-opacity-90 disabled:border-opacity-50 text-palette_blue disabled:text-opacity-50 hover:text-opacity-90"
                    onClick={returnIMERCIDDCoordinatorEndorsementHandler}
                  >
                    Return
                  </button>
                  <button
                    disabled={loading}
                    className="text-palette_white bg-palette_blue disabled:bg-opacity-50 flex items-center justify-center space-x-2 hover:bg-opacity-90 rounded-md text-sm font-semibold px-4 py-2"
                    onClick={openConfirmation}
                  >
                    Endorse
                  </button>
                  {state.openConfirmation && (
                    <Confirmation
                      onClose={closeConfirmation}
                      onConfirm={iMERCIDDCoordinatorEndorsementHandler}
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
