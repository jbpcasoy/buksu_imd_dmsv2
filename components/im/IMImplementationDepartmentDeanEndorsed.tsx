import Loading from "@/components/Loading";
import IMActionMenu from "@/components/im/IMActionMenu";
import useActiveIDDCoordinatorMe from "@/hooks/useActiveIDDCoordinatorMe";
import useIM from "@/hooks/useIM";
import useIMLatestIMFile from "@/hooks/useIMLatestIMFile.";
import Error from "next/error";
import Link from "next/link";
import IMInfo from "./IMInfo";

interface IMImplementationDepartmentDeanEndorsedProps {
  iMId: string;
  onRefresh: () => any;
  refreshFlag?: number;
}
export default function IMImplementationDepartmentDeanEndorsed({
  iMId,
  onRefresh = () => {},
  refreshFlag,
}: IMImplementationDepartmentDeanEndorsedProps) {
  const iM = useIM({
    id: iMId,
    refreshFlag,
  });
  const iMFile = useIMLatestIMFile({
    id: iMId,
  });
  const activeIDDCoordinator = useActiveIDDCoordinatorMe();

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

          <div className="md:overflow-auto flex-1">
            <IMInfo
              iMId={iMId}
              onRefresh={onRefresh}
              refreshFlag={refreshFlag}
            />
            <div className="space-x-2 my-2">
              {activeIDDCoordinator && (
                <>
                  <Link
                    href={`/im/${iM.id}/idd_coordinator_suggestion`}
                    className="bg-palette_blue text-palette_white p-2 rounded inline-flex items-center space-x-2 hover:bg-opacity-90"
                  >
                    <span>IDD Coordinator Suggestion</span>
                  </Link>
                </>
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
