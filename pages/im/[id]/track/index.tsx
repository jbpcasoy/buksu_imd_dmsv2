import MainLayout from "@/components/MainLayout";
import useCITLDirectorEndorsementIM from "@/hooks/useCITLDirectorEndorsementIM";
import useCITLRevisionIM from "@/hooks/useCITLRevisionIM";
import useCoordinatorEndorsementIM from "@/hooks/useCoordinatorEndorsementIM";
import useDeanEndorsementIM from "@/hooks/useDeanEndorsementIM";
import useDepartmentReviewIM from "@/hooks/useDepartmentReviewIM";
import useDepartmentReviewedIM from "@/hooks/useDepartmentReviewedIM";
import useDepartmentRevisionIM from "@/hooks/useDepartmentRevisionIM";
import useIDDCoordinatorEndorsementIM from "@/hooks/useIDDCoordinatorEndorsementIM";
import useIM from "@/hooks/useIM";
import useIMERCCITLDirectorEndorsementIM from "@/hooks/useIMERCCITLDirectorEndorsementIM";
import useIMERCCITLReviewedIM from "@/hooks/useIMERCCITLReviewedIM";
import useIMERCCITLRevisionIM from "@/hooks/useIMERCCITLRevisionIM";
import useIMERCIDDCoordinatorEndorsementIM from "@/hooks/useIMERCIDDCoordinatorEndorsementIM";
import useQAMISChairpersonEndorsementIM from "@/hooks/useQAMISChairpersonEndorsementIM";
import useQAMISCoordinatorEndorsementIM from "@/hooks/useQAMISCoordinatorEndorsementIM";
import useQAMISDeanEndorsementIM from "@/hooks/useQAMISDeanEndorsementIM";
import useQAMISDepartmentEndorsementByIM from "@/hooks/useQAMISDepartmentEndorsementByIM";
import useQAMISRevisionIM from "@/hooks/useQAMISRevisionIM";
import useSubmittedChairpersonSuggestionIM from "@/hooks/useSubmittedChairpersonSuggestionIM";
import useSubmittedContentEditorSuggestionIM from "@/hooks/useSubmittedContentEditorSuggestionIM";
import useSubmittedContentSpecialistSuggestionIM from "@/hooks/useSubmittedContentSpecialistSuggestionIM";
import useSubmittedCoordinatorSuggestionIM from "@/hooks/useSubmittedCoordinatorSuggestionIM";
import useSubmittedIDDCoordinatorSuggestionIM from "@/hooks/useSubmittedIDDCoordinatorSuggestionIM";
import useSubmittedIDDSpecialistSuggestionIM from "@/hooks/useSubmittedIDDSpecialistSuggestionIM";
import useSubmittedPeerSuggestionIM from "@/hooks/useSubmittedPeerSuggestionIM";
import { DateTime } from "luxon";
import { useRouter } from "next/router";
import { ReactNode } from "react";

export default function TrackPage() {
  const router = useRouter();
  const iMId = router.query.id as string;
  const iM = useIM({
    id: iMId,
  });
  const departmentReview = useDepartmentReviewIM({
    id: iM?.id,
  });
  const submittedPeerSuggestion = useSubmittedPeerSuggestionIM({
    id: iM?.id,
  });
  const submittedChairpersonSuggestion = useSubmittedChairpersonSuggestionIM({
    id: iM?.id,
  });
  const submittedCoordinatorSuggestion = useSubmittedCoordinatorSuggestionIM({
    id: iM?.id,
  });
  const departmentRevision = useDepartmentRevisionIM({
    id: iM?.id,
  });
  const coordinatorEndorsement = useCoordinatorEndorsementIM({
    id: iM?.id,
  });
  const deanEndorsement = useDeanEndorsementIM({
    id: iM?.id,
  });
  const submittedIDDCoordinatorSuggestion =
    useSubmittedIDDCoordinatorSuggestionIM({
      id: iM?.id,
    });
  const cITLRevision = useCITLRevisionIM({
    id: iM?.id,
  });
  const iDDCoordinatorEndorsement = useIDDCoordinatorEndorsementIM({
    id: iM?.id,
  });
  const cITLDirectorEndorsement = useCITLDirectorEndorsementIM({
    id: iM?.id,
  });
  const qAMISRevision = useQAMISRevisionIM({
    id: iM?.id,
  });
  const qAMISChairpersonEndorsement = useQAMISChairpersonEndorsementIM({
    id: iM?.id,
  });
  const qAMISCoordinatorEndorsement = useQAMISCoordinatorEndorsementIM({
    id: iM?.id,
  });
  const qAMISDeanEndorsement = useQAMISDeanEndorsementIM({
    id: iM?.id,
  });
  const submittedContentSpecialistSuggestion =
    useSubmittedContentSpecialistSuggestionIM({
      id: iM?.id,
    });
  const submittedContentEditorSuggestion =
    useSubmittedContentEditorSuggestionIM({
      id: iM?.id,
    });
  const submittedIDDSpecialistSuggestion =
    useSubmittedIDDSpecialistSuggestionIM({
      id: iM?.id,
    });
  const iMERCCITLRevision = useIMERCCITLRevisionIM({
    id: iM?.id,
  });
  const iMERCIDDCoordinatorEndorsement = useIMERCIDDCoordinatorEndorsementIM({
    id: iM?.id,
  });
  const iMERCCITLDirectorEndorsement = useIMERCCITLDirectorEndorsementIM({
    id: iM?.id,
  });
  const departmentReviewed = useDepartmentReviewedIM({
    id: iMId,
  });
  const qAMISDepartmentEndorsed = useQAMISDepartmentEndorsementByIM({
    id: iMId,
  });
  const iMERCCITLReviewed = useIMERCCITLReviewedIM({
    id: iMId,
  });

  return (
    <MainLayout>
      <div className="flex h-full md:space-x-4 md:overflow-auto">
        <div className="bg-palette_white p-4 rounded-2xl md:flex-1 h-screen-3/4 md:h-auto md:overflow-auto flex flex-col">
          <div className="pb-2">
            <div className="border inline-block p-4 border-palette_orange rounded-lg">
              <div className="flex space-x-2 items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6 stroke-palette_grey"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>

                <span className="font-semibold">Track</span>
              </div>
            </div>
          </div>
          <div className="bg-palette_white flex-1 md:overflow-auto">
            <TimelineSegment
              label="Draft"
              mode={iM ? "success" : "pending"}
              secondaryLabel={
                iM
                  ? DateTime.fromJSDate(new Date(iM.createdAt)).toFormat(
                    "D | t"
                  )
                  : undefined
              }
            />
            <TimelineSegment
              label="Department Review"
              mode={departmentReviewed ? "success" : "pending"}
              secondaryLabel={
                departmentReviewed
                  ? DateTime.fromJSDate(
                    new Date(departmentReviewed.createdAt)
                  ).toFormat("D | t")
                  : undefined
              }
            >
              <TimelineSegment
                label="Peer Review"
                end={true}
                mode={submittedPeerSuggestion ? "success" : "pending"}
                secondaryLabel={
                  submittedPeerSuggestion
                    ? DateTime.fromJSDate(
                      new Date(submittedPeerSuggestion.createdAt)
                    ).toFormat("D | t")
                    : undefined
                }
              />
              <TimelineSegment
                label="Chairperson Review"
                end={true}
                mode={submittedChairpersonSuggestion ? "success" : "pending"}
                secondaryLabel={
                  submittedChairpersonSuggestion
                    ? DateTime.fromJSDate(
                      new Date(submittedChairpersonSuggestion.createdAt)
                    ).toFormat("D | t")
                    : undefined
                }
              />
              <TimelineSegment
                label="Coordinator Review"
                end={true}
                mode={submittedCoordinatorSuggestion ? "success" : "pending"}
                secondaryLabel={
                  submittedCoordinatorSuggestion
                    ? DateTime.fromJSDate(
                      new Date(submittedCoordinatorSuggestion.createdAt)
                    ).toFormat("D | t")
                    : undefined
                }
              />
            </TimelineSegment>
            <TimelineSegment
              label="Department Revision"
              mode={departmentRevision ? "success" : "pending"}
              secondaryLabel={
                departmentRevision
                  ? DateTime.fromJSDate(
                    new Date(departmentRevision.createdAt)
                  ).toFormat("D | t")
                  : undefined
              }
            />
            <TimelineSegment
              label="Coordinator Endorsement"
              mode={coordinatorEndorsement ? "success" : "pending"}
              secondaryLabel={
                coordinatorEndorsement
                  ? DateTime.fromJSDate(
                    new Date(coordinatorEndorsement.createdAt)
                  ).toFormat("D | t")
                  : undefined
              }
            />
            <TimelineSegment
              label="Dean Endorsement"
              mode={deanEndorsement ? "success" : "pending"}
              secondaryLabel={
                deanEndorsement
                  ? DateTime.fromJSDate(
                    new Date(deanEndorsement.createdAt)
                  ).toFormat("D | t")
                  : undefined
              }
            />
            <TimelineSegment
              label="IDD Coordinator Review"
              mode={submittedIDDCoordinatorSuggestion ? "success" : "pending"}
              secondaryLabel={
                submittedIDDCoordinatorSuggestion
                  ? DateTime.fromJSDate(
                    new Date(submittedIDDCoordinatorSuggestion.createdAt)
                  ).toFormat("D | t")
                  : undefined
              }
            />
            <TimelineSegment
              label="CITL Revision"
              mode={cITLRevision ? "success" : "pending"}
              secondaryLabel={
                cITLRevision
                  ? DateTime.fromJSDate(
                    new Date(cITLRevision.createdAt)
                  ).toFormat("D | t")
                  : undefined
              }
            />
            <TimelineSegment
              label="IDD Coordinator Endorsement"
              mode={iDDCoordinatorEndorsement ? "success" : "pending"}
              secondaryLabel={
                iDDCoordinatorEndorsement
                  ? DateTime.fromJSDate(
                    new Date(iDDCoordinatorEndorsement.createdAt)
                  ).toFormat("D | t")
                  : undefined
              }
            />
            <TimelineSegment
              label="CITL Director Endorsement"
              mode={cITLDirectorEndorsement ? "success" : "pending"}
              secondaryLabel={
                cITLDirectorEndorsement
                  ? DateTime.fromJSDate(
                    new Date(cITLDirectorEndorsement.createdAt)
                  ).toFormat("D | t")
                  : undefined
              }
            />
            <TimelineSegment
              label="Try-out"
              mode={cITLDirectorEndorsement ? "success" : "pending"}
              secondaryLabel="IM will be utilized for 1 semester."
            />
            <TimelineSegment
              label="QAMIS Revision"
              mode={qAMISRevision ? "success" : "pending"}
              secondaryLabel={
                qAMISRevision
                  ? DateTime.fromJSDate(
                    new Date(qAMISRevision.createdAt)
                  ).toFormat("D | t")
                  : undefined
              }
            />
            <TimelineSegment
              label="QAMIS Department Endorsement"
              mode={qAMISDepartmentEndorsed ? "success" : "pending"}
              secondaryLabel={
                qAMISDepartmentEndorsed
                  ? DateTime.fromJSDate(
                    new Date(qAMISDepartmentEndorsed.createdAt)
                  ).toFormat("D | t")
                  : undefined
              }
            >
              <TimelineSegment
                label="QAMIS Chairperson Endorsement"
                end={true}
                mode={qAMISChairpersonEndorsement ? "success" : "pending"}
                secondaryLabel={
                  qAMISChairpersonEndorsement
                    ? DateTime.fromJSDate(
                      new Date(qAMISChairpersonEndorsement.createdAt)
                    ).toFormat("D | t")
                    : undefined
                }
              />
              <TimelineSegment
                label="QAMIS Coordinator Endorsement"
                end={true}
                mode={qAMISCoordinatorEndorsement ? "success" : "pending"}
                secondaryLabel={
                  qAMISCoordinatorEndorsement
                    ? DateTime.fromJSDate(
                      new Date(qAMISCoordinatorEndorsement.createdAt)
                    ).toFormat("D | t")
                    : undefined
                }
              />
              <TimelineSegment
                label="QAMIS Dean Endorsement"
                end={true}
                mode={qAMISDeanEndorsement ? "success" : "pending"}
                secondaryLabel={
                  qAMISDeanEndorsement
                    ? DateTime.fromJSDate(
                      new Date(qAMISDeanEndorsement.createdAt)
                    ).toFormat("D | t")
                    : undefined
                }
              />
            </TimelineSegment>
            <TimelineSegment
              label="IMERC Review"
              mode={iMERCCITLReviewed ? "success" : "pending"}
              secondaryLabel={
                iMERCCITLReviewed
                  ? DateTime.fromJSDate(
                    new Date(iMERCCITLReviewed.createdAt)
                  ).toFormat("D | t")
                  : undefined
              }
            >
              <TimelineSegment
                label="Content Specialist Review"
                end={true}
                mode={
                  submittedContentSpecialistSuggestion ? "success" : "pending"
                }
                secondaryLabel={
                  submittedContentSpecialistSuggestion
                    ? DateTime.fromJSDate(
                      new Date(submittedContentSpecialistSuggestion.createdAt)
                    ).toFormat("D | t")
                    : undefined
                }
              />
              <TimelineSegment
                label="IDD Specialist Review"
                end={true}
                mode={submittedIDDSpecialistSuggestion ? "success" : "pending"}
                secondaryLabel={
                  submittedIDDSpecialistSuggestion
                    ? DateTime.fromJSDate(
                      new Date(submittedIDDSpecialistSuggestion.createdAt)
                    ).toFormat("D | t")
                    : undefined
                }
              />
              <TimelineSegment
                label="Content Editor Review"
                end={true}
                mode={submittedContentEditorSuggestion ? "success" : "pending"}
                secondaryLabel={
                  submittedContentEditorSuggestion
                    ? DateTime.fromJSDate(
                      new Date(submittedContentEditorSuggestion.createdAt)
                    ).toFormat("D | t")
                    : undefined
                }
              />
            </TimelineSegment>
            <TimelineSegment
              label="IMERC Revision"
              mode={iMERCCITLRevision ? "success" : "pending"}
              secondaryLabel={
                iMERCCITLRevision
                  ? DateTime.fromJSDate(
                    new Date(iMERCCITLRevision.createdAt)
                  ).toFormat("D | t")
                  : undefined
              }
            />
            <TimelineSegment
              label="IMERC IDD Coordinator Endorsement"
              mode={iMERCIDDCoordinatorEndorsement ? "success" : "pending"}
              secondaryLabel={
                iMERCIDDCoordinatorEndorsement
                  ? DateTime.fromJSDate(
                    new Date(iMERCIDDCoordinatorEndorsement.createdAt)
                  ).toFormat("D | t")
                  : undefined
              }
            />
            <TimelineSegment
              label="IMERC CITL Director Endorsement"
              end={true}
              mode={iMERCCITLDirectorEndorsement ? "success" : "pending"}
              secondaryLabel={
                iMERCCITLDirectorEndorsement
                  ? DateTime.fromJSDate(
                    new Date(iMERCCITLDirectorEndorsement.createdAt)
                  ).toFormat("D | t")
                  : undefined
              }
            />
          </div>
        </div>
        <div className="md:flex-1 h-screen-3/4 md:h-auto">
          <iframe
            loading="lazy"
            src={`/api/im_file/im/${iMId}/pdf`}
            className="w-full h-full"
          />
        </div>
      </div>
    </MainLayout>
  );
}

interface TimelineSegmentProps {
  label: string;
  mode?: "success" | "pending";
  end?: boolean;
  children?: ReactNode;
  secondaryLabel?: string;
}
function TimelineSegment({
  label,
  mode = "pending",
  end = false,
  children,
  secondaryLabel,
}: TimelineSegmentProps) {
  return (
    <div
      className={`${end ? "" : "border-l border-l-palette_light_grey"} ${children || end ? "" : "pb-10"
        } flex space-x-4 ml-5`}
    >
      <div className="-ml-5 bg-palette_white rounded-full w-10 h-10 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`w-7 h-7 ${mode === "success" ? "bg-palette_timeline_green" : "bg-palette_grey"
            } text-palette_white rounded-full p-2`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m4.5 12.75 6 6 9-13.5"
          />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="pt-1">{label}</span>
        {secondaryLabel && <span className="text-xs">{secondaryLabel}</span>}
        <div>{children}</div>
      </div>
    </div>
  );
}
