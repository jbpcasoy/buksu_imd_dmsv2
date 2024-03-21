import Confirmation from "@/components/Confirmation";
import Loading from "@/components/Loading";
import { SnackbarContext } from "@/components/SnackbarProvider";
import IMActionMenu from "@/components/im/IMActionMenu";
import useActiveCoordinatorMe from "@/hooks/useActiveCoordinatorMe";
import useIM from "@/hooks/useIM";
import useIMLatestIMFile from "@/hooks/useIMLatestIMFile.";
import { CoordinatorEndorsement, DepartmentRevision } from "@prisma/client";
import axios from "axios";
import Error from "next/error";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import IMInfo from "./IMInfo";

interface IMImplementationDepartmentRevisedProps {
  iMId: string;
  onRefresh: () => any;
  refreshFlag?: number;
}
export default function IMImplementationDepartmentRevised({
  iMId,
  onRefresh = () => {},
  refreshFlag,
}: IMImplementationDepartmentRevisedProps) {
  const activeCoordinator = useActiveCoordinatorMe();
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

  const coordinatorEndorsementHandler = async () => {
    if (!activeCoordinator) return;

    return axios
      .get<DepartmentRevision>(`/api/department_revision/im/${iMId}`)
      .then((res) => {
        const departmentRevision = res.data;
        if (!departmentRevision) return;

        return axios
          .post<CoordinatorEndorsement>(`/api/coordinator_endorsement`, {
            departmentRevisionId: departmentRevision.id,
            activeCoordinatorId: activeCoordinator.id,
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
    router.push(`/im/${iMId}/returned_department_revision`);
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
            {activeCoordinator && (
              <div className="space-y-1 sm:space-y-0 sm:space-x-1 flex flex-col sm:flex-row">
                <>
                  <button
                    disabled={loading}
                    className="rounded text-palette_white bg-palette_blue p-2 disabled:bg-opacity-50 flex items-center justify-center space-x-2 hover:bg-opacity-90"
                    onClick={openConfirmation}
                  >
                    Endorse IM
                  </button>
                  {state.openConfirmation && (
                    <Confirmation
                      onClose={closeConfirmation}
                      onConfirm={coordinatorEndorsementHandler}
                    />
                  )}
                </>
                <button
                  disabled={loading}
                  className="rounded text-palette_white bg-palette_blue p-2 disabled:bg-opacity-50 flex items-center justify-center space-x-2 hover:bg-opacity-90"
                  onClick={returnCoordinatorEndorsementHandler}
                >
                  Return Revision
                </button>
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
