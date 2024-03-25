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
  onRefresh = () => {},
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
              <div className="space-x-2">
                {activeContentSpecialist &&
                  !submittedContentSpecialistSuggestion && (
                    <Link
                      href={`/im/${iM.id}/content_specialist_review`}
                      className="bg-palette_blue text-palette_white py-1 px-2 rounded inline-flex items-center space-x-2 hover:bg-opacity-90"
                    >
                      <span>Content Specialist Review</span>
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="1em"
                          viewBox="0 0 576 512"
                          className="fill-palette_white"
                        >
                          <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V285.7l-86.8 86.8c-10.3 10.3-17.5 23.1-21 37.2l-18.7 74.9c-2.3 9.2-1.8 18.8 1.3 27.5H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zM549.8 235.7l14.4 14.4c15.6 15.6 15.6 40.9 0 56.6l-29.4 29.4-71-71 29.4-29.4c15.6-15.6 40.9-15.6 56.6 0zM311.9 417L441.1 287.8l71 71L382.9 487.9c-4.1 4.1-9.2 7-14.9 8.4l-60.1 15c-5.5 1.4-11.2-.2-15.2-4.2s-5.6-9.7-4.2-15.2l15-60.1c1.4-5.6 4.3-10.8 8.4-14.9z" />
                        </svg>
                      </span>
                    </Link>
                  )}

                {activeCITLDirector && !submittedContentEditorSuggestion && (
                  <Link
                    href={`/im/${iM.id}/content_editor_review`}
                    className="bg-palette_blue text-palette_white py-1 px-2 rounded inline-flex items-center space-x-2 hover:bg-opacity-90"
                  >
                    <span>Content Editor Review</span>
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="1em"
                        viewBox="0 0 576 512"
                        className="fill-palette_white"
                      >
                        <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V285.7l-86.8 86.8c-10.3 10.3-17.5 23.1-21 37.2l-18.7 74.9c-2.3 9.2-1.8 18.8 1.3 27.5H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zM549.8 235.7l14.4 14.4c15.6 15.6 15.6 40.9 0 56.6l-29.4 29.4-71-71 29.4-29.4c15.6-15.6 40.9-15.6 56.6 0zM311.9 417L441.1 287.8l71 71L382.9 487.9c-4.1 4.1-9.2 7-14.9 8.4l-60.1 15c-5.5 1.4-11.2-.2-15.2-4.2s-5.6-9.7-4.2-15.2l15-60.1c1.4-5.6 4.3-10.8 8.4-14.9z" />
                      </svg>
                    </span>
                  </Link>
                )}

                {activeIDDCoordinator && !submittedIDDSpecialistSuggestion && (
                  <Link
                    href={`/im/${iM.id}/idd_specialist_review`}
                    className="bg-palette_blue text-palette_white py-1 px-2 rounded inline-flex items-center space-x-2 hover:bg-opacity-90"
                  >
                    <span>IDD Specialist Review</span>
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="1em"
                        viewBox="0 0 576 512"
                        className="fill-palette_white"
                      >
                        <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V285.7l-86.8 86.8c-10.3 10.3-17.5 23.1-21 37.2l-18.7 74.9c-2.3 9.2-1.8 18.8 1.3 27.5H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zM549.8 235.7l14.4 14.4c15.6 15.6 15.6 40.9 0 56.6l-29.4 29.4-71-71 29.4-29.4c15.6-15.6 40.9-15.6 56.6 0zM311.9 417L441.1 287.8l71 71L382.9 487.9c-4.1 4.1-9.2 7-14.9 8.4l-60.1 15c-5.5 1.4-11.2-.2-15.2-4.2s-5.6-9.7-4.2-15.2l15-60.1c1.4-5.6 4.3-10.8 8.4-14.9z" />
                      </svg>
                    </span>
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
              className="w-full h-full rounded-2xl"
            />
          </div>
        )}
      </div>
    </div>
  );
}
