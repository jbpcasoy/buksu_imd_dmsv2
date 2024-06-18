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
  onRefresh = () => { },
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

          <div className="md:overflow-auto flex-1 flex flex-col h-full">
            <div className="flex-1">
              <IMInfo
                iMId={iMId}
                onRefresh={onRefresh}
                refreshFlag={refreshFlag}
              />
            </div>
            <div className="space-x-2 my-2 flex justify-end">
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
                            </Link>
                          )}
                          {coAuthorsCount > 0 && (
                            <button
                              disabled={true}
                              title="Cannot review co-authored IM"
                              className="bg-palette_grey text-palette_white py-1 px-2 rounded inline-flex items-center space-x-2"
                            >
                              <span>Peer Review</span>
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
                </Link>
              )}

              {activeChairperson && !submittedChairpersonSuggestion && (
                <Link
                  href={`/im/${iM.id}/chairperson_review`}
                  className="bg-palette_blue text-palette_white py-1 px-2 rounded inline-flex items-center space-x-2 hover:bg-opacity-90"
                >
                  <span>Chairperson Review</span>
                </Link>
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
              className="w-full h-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}
