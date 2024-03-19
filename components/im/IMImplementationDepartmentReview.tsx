import Loading from "@/components/Loading";
import IMActionMenu from "@/components/im/IMActionMenu";
import useActiveChairpersonMe from "@/hooks/useActiveChairpersonMe";
import useActiveCoordinatorMe from "@/hooks/useActiveCoordinatorMe";
import useActiveFacultyMe from "@/hooks/useActiveFacultyMe";
import useCoAuthors from "@/hooks/useCoAuthors";
import useIM from "@/hooks/useIM";
import useIMLatestIMFile from "@/hooks/useIMLatestIMFile.";
import usePeerReviewIM from "@/hooks/usePeerReviewIM";
import useSubmittedChairpersonSuggestionIM from "@/hooks/useSubmittedChairpersonSuggestionIM";
import useSubmittedCoordinatorSuggestionIM from "@/hooks/useSubmittedCoordinatorSuggestionIM";
import useSubmittedPeerSuggestionIM from "@/hooks/useSubmittedPeerSuggestionIM";
import Error from "next/error";
import Link from "next/link";
import { useState } from "react";
import IMInfo from "./IMInfo";

interface IMImplementationDepartmentReviewProps {
  iMId: string;
  onRefresh: () => any;
  refreshFlag?: number;
}
export default function IMImplementationDepartmentReview({
  iMId,
  onRefresh = () => {},
  refreshFlag,
}: IMImplementationDepartmentReviewProps) {
  const iM = useIM({
    id: iMId,
    refreshFlag,
  });
  const iMFile = useIMLatestIMFile({
    id: iMId,
  });
  const activeFaculty = useActiveFacultyMe();
  const submittedPeerSuggestion = useSubmittedPeerSuggestionIM({
    id: iMId,
  });
  const activeChairperson = useActiveChairpersonMe();
  const activeCoordinator = useActiveCoordinatorMe();
  const submittedChairpersonSuggestion = useSubmittedChairpersonSuggestionIM({
    id: iMId,
  });
  const submittedCoordinatorSuggestion = useSubmittedCoordinatorSuggestionIM({
    id: iMId,
  });
  const [coAuthorQuery, setCoAuthorQuery] = useState({
    skip: 0,
    take: 1,
    filter: {
      facultyId: activeFaculty?.facultyId,
      iMId: iMId as string,
    },
  });
  const peerReview = usePeerReviewIM({
    id: iMId,
  });
  const { coAuthors, count: coAuthorsCount } = useCoAuthors(
    coAuthorQuery,
    undefined,
    true
  );

  if (iM === null) {
    return <Error statusCode={404} title="IM Not Found" />;
  }
  if (iM === undefined) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col sm:flex-row h-full overflow-auto sm:space-x-4 space-y-4 sm:space-y-0">
      <div className="flex-1 h-full sm:overflow-auto">
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

          <div className="sm:overflow-auto flex-1">
            <IMInfo
              iMId={iMId}
              onRefresh={onRefresh}
              refreshFlag={refreshFlag}
            />
            <div className="space-x-2 my-2">
              {iM.facultyId !== activeFaculty?.facultyId &&
                !submittedPeerSuggestion && (
                  <>
                    {(!peerReview ||
                      (peerReview &&
                        activeFaculty &&
                        peerReview?.facultyId ===
                          activeFaculty?.facultyId)) && (
                      <>
                        {coAuthorsCount < 1 && (
                          <Link
                            href={`/im/${iM.id}/peer_review`}
                            className="bg-palette_blue text-palette_white py-1 px-2 rounded inline-flex items-center space-x-2 hover:bg-opacity-90"
                          >
                            <span>Peer Review</span>
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
                        {coAuthorsCount > 0 && (
                          <button
                            disabled={true}
                            title="Cannot review co-authored IM"
                            className="bg-palette_grey text-palette_white py-1 px-2 rounded inline-flex items-center space-x-2"
                          >
                            <span>Peer Review</span>
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
                          </button>
                        )}
                      </>
                    )}
                    {peerReview &&
                      peerReview?.facultyId !== activeFaculty?.facultyId && (
                        <button
                          disabled={true}
                          title="A peer review without suggestions already exists."
                          className="bg-palette_grey text-palette_white py-1 px-2 rounded inline-flex items-center space-x-2"
                        >
                          <span>Peer Review</span>
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
                        </button>
                      )}
                  </>
                )}

              {activeCoordinator && !submittedCoordinatorSuggestion && (
                <Link
                  href={`/im/${iM.id}/coordinator_review`}
                  className="bg-palette_blue text-palette_white py-1 px-2 rounded inline-flex items-center space-x-2 hover:bg-opacity-90"
                >
                  <span>Coordinator Review</span>
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

              {activeChairperson && !submittedChairpersonSuggestion && (
                <Link
                  href={`/im/${iM.id}/chairperson_review`}
                  className="bg-palette_blue text-palette_white py-1 px-2 rounded inline-flex items-center space-x-2 hover:bg-opacity-90"
                >
                  <span>Chairperson Review</span>
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
