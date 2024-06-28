import Loading from "@/components/Loading";
import IMActionMenu from "@/components/im/IMActionMenu";
import useActiveChairpersonMe from "@/hooks/useActiveChairpersonMe";
import useActiveCoordinatorMe from "@/hooks/useActiveCoordinatorMe";
import useActiveDeanMe from "@/hooks/useActiveDeanMe";
import useIM from "@/hooks/useIM";
import useIMLatestIMFile from "@/hooks/useIMLatestIMFile.";
import useQAMISChairpersonEndorsementIM from "@/hooks/useQAMISChairpersonEndorsementIM";
import useQAMISCoordinatorEndorsementIM from "@/hooks/useQAMISCoordinatorEndorsementIM";
import useQAMISDeanEndorsementIM from "@/hooks/useQAMISDeanEndorsementIM";
import useQAMISRevisionIM from "@/hooks/useQAMISRevisionIM";
import axios from "axios";
import Error from "next/error";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import Confirmation from "../Confirmation";
import IMQAMISSuggestionItems from "../IMQAMISSuggestionItems";
import { SnackbarContext } from "../SnackbarProvider";
import IMInfo from "./IMInfo";

interface IMQAMISRevisedProps {
  iMId: string;
  onRefresh: () => any;
  refreshFlag?: number;
}
export default function IMQAMISRevised({
  iMId,
  onRefresh = () => { },
  refreshFlag,
}: IMQAMISRevisedProps) {
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
  const activeCoordinator = useActiveCoordinatorMe();
  const coordinatorEndorsement = useQAMISCoordinatorEndorsementIM({
    id: iMId as string,
  });
  const activeDean = useActiveDeanMe();
  const deanEndorsement = useQAMISDeanEndorsementIM({
    id: iMId as string,
  });
  const activeChairperson = useActiveChairpersonMe();
  const chairpersonEndorsement = useQAMISChairpersonEndorsementIM({
    id: iMId as string,
  });
  const { addSnackbar } = useContext(SnackbarContext);
  const router = useRouter();
  const qAMISRevision = useQAMISRevisionIM({ id: iMId as string });

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

  const onQAMISChairpersonEndorsement = () => {
    axios
      .post("/api/qamis_chairperson_endorsement", {
        qAMISRevisionId: qAMISRevision?.id,
        activeChairpersonId: activeChairperson?.id,
      })
      .then(() => addSnackbar("Successfully endorsed IM"))
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

  const onQAMISCoordinatorEndorsement = () => {
    axios
      .post("/api/qamis_coordinator_endorsement", {
        qAMISRevisionId: qAMISRevision?.id,
        activeCoordinatorId: activeCoordinator?.id,
      })
      .then(() => addSnackbar("Successfully endorsed IM"))
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

  const onQAMISDeanEndorsement = () => {
    axios
      .post("/api/qamis_dean_endorsement", {
        qAMISRevisionId: qAMISRevision?.id,
        activeDeanId: activeDean?.id,
      })
      .then(() => addSnackbar("Successfully endorsed IM"))
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
      <div className="flex-1 h-full md:overflow-auto">
        <div className="bg-palette_white h-full rounded-2xl p-4 overflow-auto flex flex-col space-y-2">
          <div className="w-full flex space-between">
            <p className="font-semibold flex-1">
              Document Information
            </p>

            <IMActionMenu
              iMId={iMId}
              onRefresh={onRefresh}
              refreshFlag={refreshFlag}
            />
          </div>

          <div className="md:overflow-auto flex-1">
            <IMInfo
              iMId={iMId}
              onRefresh={onRefresh}
              refreshFlag={refreshFlag}
            />
            <div className="my-2">
              <IMQAMISSuggestionItems id={iM.id} editable={false} />
              <div className="flex justify-end md:space-x-2 flex-col md:flex-row">
                {activeCoordinator && !coordinatorEndorsement && (
                  <>
                    <button
                      disabled={loading}
                      className="text-palette_white bg-palette_blue disabled:bg-opacity-50 space-x-2 hover:bg-opacity-90 m-2 rounded-md text-sm font-semibold px-4 py-2"
                      onClick={openConfirmation}
                      title="Coordinator Endorsement"
                    >
                      <span>Endorse</span>
                    </button>
                    {state.openConfirmation && (
                      <Confirmation
                        onClose={closeConfirmation}
                        onConfirm={onQAMISCoordinatorEndorsement}
                      />
                    )}
                  </>
                )}
                {activeChairperson && !chairpersonEndorsement && (
                  <>
                    <button
                      disabled={loading}
                      className="text-palette_white bg-palette_blue disabled:bg-opacity-50 space-x-2 hover:bg-opacity-90 m-2 rounded-md text-sm font-semibold px-4 py-2"
                      onClick={openConfirmation}
                      title="Chairperson Endorsement"
                    >
                      <span>Endorse</span>
                    </button>
                    {state.openConfirmation && (
                      <Confirmation
                        onClose={closeConfirmation}
                        onConfirm={onQAMISChairpersonEndorsement}
                      />
                    )}
                  </>
                )}
                {activeDean && !deanEndorsement && (
                  <>
                    <button
                      disabled={loading}
                      className="text-palette_white bg-palette_blue disabled:bg-opacity-50 space-x-2 hover:bg-opacity-90 m-2 rounded-md text-sm font-semibold px-4 py-2"
                      onClick={openConfirmation}
                      title="Dean Endorsement"
                    >
                      <span>Endorse</span>
                    </button>
                    {state.openConfirmation && (
                      <Confirmation
                        onClose={closeConfirmation}
                        onConfirm={onQAMISDeanEndorsement}
                      />
                    )}
                  </>
                )}
              </div>
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
              className="w-full h-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}
