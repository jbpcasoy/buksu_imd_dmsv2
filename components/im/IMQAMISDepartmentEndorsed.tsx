import Loading from "@/components/Loading";
import IMActionMenu from "@/components/im/IMActionMenu";
import useActiveCITLDirectorMe from "@/hooks/useActiveCITLDirectorMe";
import useActiveContentSpecialistMe from "@/hooks/useActiveContentSpecialistMe";
import useActiveIDDCoordinatorMe from "@/hooks/useActiveIDDCoordinatorMe";
import useIM from "@/hooks/useIM";
import useIMLatestIMFile from "@/hooks/useIMLatestIMFile.";
import useSubmittedContentEditorSuggestionIM from "@/hooks/useSubmittedContentEditorSuggestionIM";
import useSubmittedContentSpecialistSuggestionIM from "@/hooks/useSubmittedContentSpecialistSuggestionIM";
import useSubmittedIDDSpecialistSuggestionIM from "@/hooks/useSubmittedIDDSpecialistSuggestionIM";
import Error from "next/error";
import Link from "next/link";
import IMInfo from "./IMInfo";

interface IMQAMISDepartmentEndorsedProps {
  iMId: string;
  onRefresh: () => any;
  refreshFlag?: number;
}
export default function IMQAMISDepartmentEndorsed({
  iMId,
  onRefresh = () => { },
  refreshFlag,
}: IMQAMISDepartmentEndorsedProps) {
  const iM = useIM({
    id: iMId,
    refreshFlag,
  });
  const iMFile = useIMLatestIMFile({
    id: iMId,
  });
  const activeContentSpecialist = useActiveContentSpecialistMe();
  const activeIDDCoordinator = useActiveIDDCoordinatorMe();
  const activeCITLDirector = useActiveCITLDirectorMe();
  const submittedContentSpecialistSuggestion =
    useSubmittedContentSpecialistSuggestionIM({
      id: iMId,
    });
  const submittedIDDSpecialistSuggestion =
    useSubmittedIDDSpecialistSuggestionIM({
      id: iMId,
    });
  const submittedContentEditorSuggestion =
    useSubmittedContentEditorSuggestionIM({
      id: iMId,
    });

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

          <div className="md:overflow-auto flex-1 flex flex-col justify-between">
            <IMInfo
              iMId={iMId}
              onRefresh={onRefresh}
              refreshFlag={refreshFlag}
            />
            <div className="space-x-2 my-2">
              <div className="space-x-2 flex justify-end">
                {activeContentSpecialist &&
                  !submittedContentSpecialistSuggestion && (
                    <Link
                      href={`/im/${iM.id}/content_specialist_review`}
                      className="bg-palette_blue text-palette_white inline-flex items-center space-x-2 hover:bg-opacity-90 rounded-md px-4 py-2 font-semibold text-sm"
                      title="Content Specialist Review"
                    >
                      <span>Review</span>
                    </Link>
                  )}

                {activeCITLDirector && !submittedContentEditorSuggestion && (
                  <Link
                    href={`/im/${iM.id}/content_editor_review`}
                    className="bg-palette_blue text-palette_white inline-flex items-center space-x-2 hover:bg-opacity-90 rounded-md px-4 py-2 font-semibold text-sm"
                    title="Content Editor Review"
                  >
                    <span>Review</span>
                  </Link>
                )}

                {activeIDDCoordinator && !submittedIDDSpecialistSuggestion && (
                  <Link
                    href={`/im/${iM.id}/idd_specialist_review`}
                    className="bg-palette_blue text-palette_white py-1 px-2 rounded inline-flex items-center space-x-2 hover:bg-opacity-90 rounded-md px-4 py-2 font-semibold text-sm"
                    title="IDD Specialist Review"
                  >
                    <span>Review</span>
                  </Link>
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
