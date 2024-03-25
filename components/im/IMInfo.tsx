import Loading from "@/components/Loading";
import IMCoAuthors from "@/components/im/IMCoauthors";
import useCITLDirectorEndorsementIM from "@/hooks/useCITLDirectorEndorsementIM";
import useChairpersonReviewIM from "@/hooks/useChairpersonReviewIM";
import useCollegeIM from "@/hooks/useCollegeIM";
import useContentEditorReviewIM from "@/hooks/useContentEditorReviewIM";
import useContentSpecialistReviewIM from "@/hooks/useContentSpecialistReviewIM";
import useCoordinatorEndorsementIM from "@/hooks/useCoordinatorEndorsementIM";
import useCoordinatorReviewIM from "@/hooks/useCoordinatorReviewIM";
import useDeanEndorsementIM from "@/hooks/useDeanEndorsementIM";
import useDepartmentIM from "@/hooks/useDepartmentIM";
import useIDDCoordinatorEndorsementIM from "@/hooks/useIDDCoordinatorEndorsementIM";
import useIDDSpecialistReviewIM from "@/hooks/useIDDSpecialistReviewIM";
import useIM from "@/hooks/useIM";
import useIMERCCITLDirectorEndorsementIM from "@/hooks/useIMERCCITLDirectorEndorsementIM";
import useIMERCIDDCoordinatorEndorsementIM from "@/hooks/useIMERCIDDCoordinatorEndorsementIM";
import useIMStatus from "@/hooks/useIMStatus";
import usePeerReviewIM from "@/hooks/usePeerReviewIM";
import useQAMISChairpersonEndorsementIM from "@/hooks/useQAMISChairpersonEndorsementIM";
import useQAMISCoordinatorEndorsementIM from "@/hooks/useQAMISCoordinatorEndorsementIM";
import useQAMISDeanEndorsementIM from "@/hooks/useQAMISDeanEndorsementIM";
import useSerialNumberIM from "@/hooks/useSerialNumberIM";
import useSubmittedChairpersonSuggestionIM from "@/hooks/useSubmittedChairpersonSuggestionIM";
import useSubmittedContentEditorSuggestionIM from "@/hooks/useSubmittedContentEditorSuggestionIM";
import useSubmittedContentSpecialistSuggestionIM from "@/hooks/useSubmittedContentSpecialistSuggestionIM";
import useSubmittedCoordinatorSuggestionIM from "@/hooks/useSubmittedCoordinatorSuggestionIM";
import useSubmittedIDDCoordinatorSuggestionIM from "@/hooks/useSubmittedIDDCoordinatorSuggestionIM";
import useSubmittedIDDSpecialistSuggestionIM from "@/hooks/useSubmittedIDDSpecialistSuggestionIM";
import useSubmittedPeerSuggestionIM from "@/hooks/useSubmittedPeerSuggestionIM";
import useUserFaculty from "@/hooks/useUserFaculty";
import iMStatusNormalizer from "@/services/iMStatusNormalizer";
import { DateTime } from "luxon";
import Error from "next/error";

interface IMInfoProps {
  iMId: string;
  onRefresh: () => any;
  refreshFlag?: number;
}
export default function IMInfo({ iMId, onRefresh, refreshFlag }: IMInfoProps) {
  const iM = useIM({
    id: iMId,
    refreshFlag,
  });
  const serialNumber = useSerialNumberIM({
    id: iMId,
  });
  const iMStatus = useIMStatus({
    id: iMId,
    refreshFlag,
  });
  const user = useUserFaculty({
    id: iM?.facultyId,
  });
  const department = useDepartmentIM({ id: iMId as string });
  const college = useCollegeIM({ id: iMId as string });

  if (iM === null) {
    return <Error statusCode={404} title="IM Not Found" />;
  }
  if (iM === undefined) {
    return <Loading />;
  }

  return (
    <div className="space-y-2">
      <div className="space-y-2">
        <div className="space-y-2">
          <p className="text-xs">TITLE</p>
          <p className="border border-palette_grey p-2 rounded-lg">
            {iM.title}
          </p>
        </div>
        <div>
          <p className="text-xs">SERIAL NUMBER</p>
          <p className="border border-palette_grey p-2 rounded-lg">
            {serialNumber?.value ?? "N/A"}
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-xs">AUTHOR</p>
          <p className="border border-palette_grey p-2 rounded-lg">
            {user?.name}
          </p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:space-x-4">
        <div className="space-y-2">
          <div className="space-y-2">
            <p className="text-xs">DATE/TIME</p>
            <p className="border border-palette_grey p-2 rounded-lg">
              {DateTime.fromJSDate(new Date(iM.createdAt)).toFormat("D t")}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs">TYPE</p>
            <p className="border border-palette_grey p-2 rounded-lg">
              {iM.type}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs">STATUS</p>
            <p className="border border-palette_grey p-2 rounded-lg">
              {iMStatusNormalizer(iMStatus)}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs">DEPARTMENT</p>
            <p className="border border-palette_grey p-2 rounded-lg">
              {department?.name}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs">COLLEGE</p>
            <p className="border border-palette_grey p-2 rounded-lg">
              {college?.name}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="space-y-2">
            <p className="text-xs">CO-AUTHORS</p>
            <IMCoAuthors iMId={iMId as string} />
          </div>
          {(iMStatus === "IMPLEMENTATION_DRAFT" ||
            iMStatus === "IMPLEMENTATION_DEPARTMENT_REVIEW" ||
            iMStatus === "IMPLEMENTATION_DEPARTMENT_REVIEWED") && (
            <DepartmentReviewStatus iMId={iMId} />
          )}
          {(iMStatus === "IMPLEMENTATION_DEPARTMENT_DEAN_ENDORSED" ||
            iMStatus === "IMPLEMENTATION_CITL_IDD_COORDINATOR_ENDORSED" ||
            iMStatus === "IMPLEMENTATION_CITL_REVIEWED" ||
            iMStatus === "IMPLEMENTATION_CITL_RETURNED_REVISION" ||
            iMStatus === "IMPLEMENTATION_CITL_REVISED" ||
            iMStatus === "IMPLEMENTATION_CITL_DIRECTOR_ENDORSED") && (
            <CITLSuggestionStatus iMId={iMId} />
          )}
          {(iMStatus === "IMERC_QAMIS_DEPARTMENT_ENDORSED" ||
            iMStatus === "IMERC_CITL_REVIEWED" ||
            iMStatus === "IMERC_CITL_RETURNED_REVISION") && (
            <IMERCReviewStatus iMId={iMId} />
          )}
        </div>
        {(iMStatus === "IMPLEMENTATION_DRAFT" ||
          iMStatus === "IMPLEMENTATION_DEPARTMENT_REVIEW" ||
          iMStatus === "IMPLEMENTATION_DEPARTMENT_REVIEWED") && (
          <DepartmentSuggestionStatus iMId={iMId} />
        )}
        {(iMStatus === "IMPLEMENTATION_DEPARTMENT_REVISED" ||
          iMStatus === "IMPLEMENTATION_DEPARTMENT_COORDINATOR_ENDORSED") && (
          <DepartmentEndorsementStatus iMId={iMId} />
        )}

        {(iMStatus === "IMPLEMENTATION_DEPARTMENT_DEAN_ENDORSED" ||
          iMStatus === "IMPLEMENTATION_CITL_IDD_COORDINATOR_ENDORSED" ||
          iMStatus === "IMPLEMENTATION_CITL_REVIEWED" ||
          iMStatus === "IMPLEMENTATION_CITL_RETURNED_REVISION" ||
          iMStatus === "IMPLEMENTATION_CITL_REVISED" ||
          iMStatus === "IMPLEMENTATION_CITL_DIRECTOR_ENDORSED") && (
          <CITLEndorsementStatus iMId={iMId} />
        )}
        {iMStatus === "IMERC_QAMIS_REVISED" && (
          <QAMISEndorsementStatus iMId={iMId} />
        )}
        {(iMStatus === "IMERC_QAMIS_DEPARTMENT_ENDORSED" ||
          iMStatus === "IMERC_CITL_REVIEWED" ||
          iMStatus === "IMERC_CITL_RETURNED_REVISION") && (
          <IMERCSuggestionStatus iMId={iMId} />
        )}
        {(iMStatus === "IMERC_CITL_REVISED" ||
          iMStatus === "IMERC_CITL_IDD_COORDINATOR_ENDORSED" ||
          iMStatus === "IMERC_CITL_DIRECTOR_ENDORSED") && (
          <IMERCEndorsementStatus iMId={iMId} />
        )}
      </div>
    </div>
  );
}

interface DepartmentReviewStatusProps {
  iMId: string;
}
function DepartmentReviewStatus({ iMId }: DepartmentReviewStatusProps) {
  const peerReview = usePeerReviewIM({
    id: iMId,
  });
  const chairpersonReview = useChairpersonReviewIM({
    id: iMId,
  });
  const coordinatorReview = useCoordinatorReviewIM({
    id: iMId,
  });
  return (
    <div className="space-y-2">
      <p className="text-xs">REVIEWS</p>
      <div className="inline-flex flex-col space-y-2">
        {!peerReview && (
          <p className="bg-palette_light_grey inline p-2 rounded-lg">
            Peer Review
          </p>
        )}
        {peerReview && (
          <p className="bg-palette_success text-palette_white inline p-2 rounded-lg">
            Peer Review
          </p>
        )}
        {!chairpersonReview && (
          <p className="bg-palette_light_grey inline p-2 rounded-lg">
            Chairperson Review
          </p>
        )}
        {chairpersonReview && (
          <p className="bg-palette_success text-palette_white inline p-2 rounded-lg">
            Chairperson Review
          </p>
        )}
        {!coordinatorReview && (
          <p className="bg-palette_light_grey inline p-2 rounded-lg">
            Coordinator Review
          </p>
        )}
        {coordinatorReview && (
          <p className="bg-palette_success text-palette_white inline p-2 rounded-lg">
            Coordinator Review
          </p>
        )}
      </div>
    </div>
  );
}

interface DepartmentSuggestionStatusProps {
  iMId: string;
}
function DepartmentSuggestionStatus({ iMId }: DepartmentSuggestionStatusProps) {
  const submittedPeerSuggestion = useSubmittedPeerSuggestionIM({
    id: iMId,
  });
  const submittedChairpersonSuggestion = useSubmittedChairpersonSuggestionIM({
    id: iMId,
  });
  const submittedCoordinatorSuggestion = useSubmittedCoordinatorSuggestionIM({
    id: iMId,
  });

  return (
    <div className="space-y-2">
      <p className="text-xs ">SUGGESTIONS</p>
      <div className="inline-flex flex-col space-y-2">
        {!submittedPeerSuggestion && (
          <p className="bg-palette_light_grey inline p-2 rounded-lg">
            Peer Suggestion
          </p>
        )}
        {submittedPeerSuggestion && (
          <p className="bg-palette_success text-palette_white inline p-2 rounded-lg">
            Peer Suggestion
          </p>
        )}
        {!submittedChairpersonSuggestion && (
          <p className="bg-palette_light_grey inline p-2 rounded-lg">
            Chairperson Suggestion
          </p>
        )}
        {submittedChairpersonSuggestion && (
          <p className="bg-palette_success text-palette_white inline p-2 rounded-lg">
            Chairperson Suggestion
          </p>
        )}
        {!submittedCoordinatorSuggestion && (
          <p className="bg-palette_light_grey  inline p-2 rounded-lg">
            Coordinator Suggestion
          </p>
        )}
        {submittedCoordinatorSuggestion && (
          <p className="bg-palette_success text-palette_white inline p-2 rounded-lg">
            Coordinator Suggestion
          </p>
        )}
      </div>
    </div>
  );
}

interface DepartmentEndorsementStatusProps {
  iMId: string;
}
function DepartmentEndorsementStatus({
  iMId,
}: DepartmentEndorsementStatusProps) {
  const coordinatorEndorsement = useCoordinatorEndorsementIM({
    id: iMId,
  });
  const deanEndorsement = useDeanEndorsementIM({
    id: iMId,
  });
  return (
    <div className="space-y-2">
      <p className="text-xs ">ENDORSEMENTS</p>
      <div className="inline-flex flex-col space-y-2">
        {!coordinatorEndorsement && (
          <p className="bg-palette_light_grey inline p-2 rounded-lg">
            Coordinator Endorsement
          </p>
        )}
        {coordinatorEndorsement && (
          <p className="bg-palette_success text-palette_white inline p-2 rounded-lg">
            Coordinator Endorsement
          </p>
        )}
        {!deanEndorsement && (
          <p className="bg-palette_light_grey inline p-2 rounded-lg">
            Dean Endorsement
          </p>
        )}
        {deanEndorsement && (
          <p className="bg-palette_success text-palette_white inline p-2 rounded-lg">
            Dean Endorsement
          </p>
        )}
      </div>
    </div>
  );
}

interface CITLSuggestionStatusProps {
  iMId: string;
}
function CITLSuggestionStatus({ iMId }: CITLSuggestionStatusProps) {
  const submittedIDDCoordinatorSuggestion =
    useSubmittedIDDCoordinatorSuggestionIM({
      id: iMId,
    });
  return (
    <div className="space-y-2">
      <p className="text-xs ">SUGGESTIONS</p>
      <div className="inline-flex flex-col space-y-2">
        {!submittedIDDCoordinatorSuggestion && (
          <p className="bg-palette_light_grey inline p-2 rounded-lg">
            IDD Coordinator Suggestion
          </p>
        )}
        {submittedIDDCoordinatorSuggestion && (
          <p className="bg-palette_success text-palette_white inline p-2 rounded-lg">
            IDD Coordinator Suggestion
          </p>
        )}
      </div>
    </div>
  );
}

interface CITLEndorsementStatusProps {
  iMId: string;
}
function CITLEndorsementStatus({ iMId }: CITLEndorsementStatusProps) {
  const iDDCoordinatorEndorsement = useIDDCoordinatorEndorsementIM({
    id: iMId,
  });
  const cITLDirectorEndorsement = useCITLDirectorEndorsementIM({
    id: iMId,
  });
  return (
    <div className="space-y-2">
      <p className="text-xs ">ENDORSEMENTS</p>
      <div className="inline-flex flex-col space-y-2">
        {!iDDCoordinatorEndorsement && (
          <p className="bg-palette_light_grey inline p-2 rounded-lg">
            IDD Coordinator Endorsement
          </p>
        )}
        {iDDCoordinatorEndorsement && (
          <p className="bg-palette_success text-palette_white inline p-2 rounded-lg">
            IDD Coordinator Endorsement
          </p>
        )}
        {!cITLDirectorEndorsement && (
          <p className="bg-palette_light_grey inline p-2 rounded-lg">
            CITL Director Endorsement
          </p>
        )}
        {cITLDirectorEndorsement && (
          <p className="bg-palette_success text-palette_white inline p-2 rounded-lg">
            CITL Director Endorsement
          </p>
        )}
      </div>
    </div>
  );
}

interface QAMISEndorsementStatusProps {
  iMId: string;
}

function QAMISEndorsementStatus({ iMId }: QAMISEndorsementStatusProps) {
  const chairpersonEndorsement = useQAMISChairpersonEndorsementIM({
    id: iMId,
  });
  const coordinatorEndorsement = useQAMISCoordinatorEndorsementIM({
    id: iMId,
  });
  const deanEndorsement = useQAMISDeanEndorsementIM({
    id: iMId,
  });

  return (
    <div className="space-y-2">
      <p className="text-xs ">ENDORSEMENTS</p>
      <div className="inline-flex flex-col space-y-2">
        {!chairpersonEndorsement && (
          <p className="bg-palette_light_grey inline p-2 rounded-lg">
            Chairperson Endorsement
          </p>
        )}
        {chairpersonEndorsement && (
          <p className="bg-palette_success text-palette_white inline p-2 rounded-lg">
            Chairperson Endorsement
          </p>
        )}
        {!coordinatorEndorsement && (
          <p className="bg-palette_light_grey inline p-2 rounded-lg">
            Coordinator Endorsement
          </p>
        )}
        {coordinatorEndorsement && (
          <p className="bg-palette_success text-palette_white inline p-2 rounded-lg">
            Coordinator Endorsement
          </p>
        )}
        {!deanEndorsement && (
          <p className="bg-palette_light_grey inline p-2 rounded-lg">
            Dean Endorsement
          </p>
        )}
        {deanEndorsement && (
          <p className="bg-palette_success text-palette_white inline p-2 rounded-lg">
            Dean Endorsement
          </p>
        )}
      </div>
    </div>
  );
}

interface IMERCReviewStatusProps {
  iMId: string;
}

function IMERCReviewStatus({ iMId }: IMERCReviewStatusProps) {
  const contentSpecialistReview = useContentSpecialistReviewIM({
    id: iMId,
  });
  const iDDSpecialistReview = useIDDSpecialistReviewIM({
    id: iMId,
  });
  const contentEditorReview = useContentEditorReviewIM({
    id: iMId,
  });

  return (
    <div className="space-y-2">
      <p className="text-xs">REVIEWS</p>
      <div className="inline-flex flex-col space-y-2">
        {!contentSpecialistReview && (
          <p className="bg-palette_light_grey inline p-2 rounded-lg">
            Content Specialist Review
          </p>
        )}
        {contentSpecialistReview && (
          <p className="bg-palette_success text-palette_white inline p-2 rounded-lg">
            Content Specialist Review
          </p>
        )}
        {!iDDSpecialistReview && (
          <p className="bg-palette_light_grey inline p-2 rounded-lg">
            IDD Specialist Review
          </p>
        )}
        {iDDSpecialistReview && (
          <p className="bg-palette_success text-palette_white inline p-2 rounded-lg">
            IDD Specialist Review
          </p>
        )}
        {!contentEditorReview && (
          <p className="bg-palette_light_grey inline p-2 rounded-lg">
            Content Editor Review
          </p>
        )}
        {contentEditorReview && (
          <p className="bg-palette_success text-palette_white inline p-2 rounded-lg">
            Content Editor Review
          </p>
        )}
      </div>
    </div>
  );
}

interface IMERCSuggestionStatusProps {
  iMId: string;
}
function IMERCSuggestionStatus({ iMId }: IMERCSuggestionStatusProps) {
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

  return (
    <div className="space-y-2">
      <p className="text-xs">SUGGESTIONS</p>
      <div className="inline-flex flex-col space-y-2">
        {!submittedContentSpecialistSuggestion && (
          <p className="bg-palette_light_grey inline p-2 rounded-lg">
            Content Specialist Suggestion
          </p>
        )}
        {submittedContentSpecialistSuggestion && (
          <p className="bg-palette_success text-palette_white inline p-2 rounded-lg">
            Content Specialist Suggestion
          </p>
        )}
        {!submittedIDDSpecialistSuggestion && (
          <p className="bg-palette_light_grey inline p-2 rounded-lg">
            IDD Specialist Suggestion
          </p>
        )}
        {submittedIDDSpecialistSuggestion && (
          <p className="bg-palette_success text-palette_white inline p-2 rounded-lg">
            IDD Specialist Suggestion
          </p>
        )}
        {!submittedContentEditorSuggestion && (
          <p className="bg-palette_light_grey inline p-2 rounded-lg">
            Content Editor Suggestion
          </p>
        )}
        {submittedContentEditorSuggestion && (
          <p className="bg-palette_success text-palette_white inline p-2 rounded-lg">
            Content Editor Suggestion
          </p>
        )}
      </div>
    </div>
  );
}

interface IMERCEndorsementStatusProps {
  iMId: string;
}

function IMERCEndorsementStatus({ iMId }: IMERCEndorsementStatusProps) {
  const iMERCIDDCoordinatorEndorsement = useIMERCIDDCoordinatorEndorsementIM({
    id: iMId,
  });
  const iMERCCITLDirectorEndorsement = useIMERCCITLDirectorEndorsementIM({
    id: iMId,
  });

  return (
    <div className="space-y-2">
      <p className="text-xs ">ENDORSEMENTS</p>
      <div className="inline-flex flex-col space-y-2">
        {!iMERCIDDCoordinatorEndorsement && (
          <p className="bg-palette_light_grey inline p-2 rounded-lg">
            IDD Coordinator Endorsement
          </p>
        )}
        {iMERCIDDCoordinatorEndorsement && (
          <p className="bg-palette_success text-palette_white inline p-2 rounded-lg">
            IDD Coordinator Endorsement
          </p>
        )}
        {!iMERCCITLDirectorEndorsement && (
          <p className="bg-palette_light_grey inline p-2 rounded-lg">
            CITL Director Endorsement
          </p>
        )}
        {iMERCCITLDirectorEndorsement && (
          <p className="bg-palette_success text-palette_white inline p-2 rounded-lg">
            CITL Director Endorsement
          </p>
        )}
      </div>
    </div>
  );
}
