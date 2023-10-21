import MainLayout from "@/components/MainLayout";
import useCITLDirectorEndorsementIM from "@/hooks/useCITLDirectorEndorsementIM";
import useCITLRevisionIM from "@/hooks/useCITLRevisionIM";
import useCoordinatorEndorsementIM from "@/hooks/useCoordinatorEndorsementIM";
import useDeanEndorsementIM from "@/hooks/useDeanEndorsementIM";
import useDepartmentReviewIM from "@/hooks/useDepartmentReviewIM";
import useDepartmentRevisionIM from "@/hooks/useDepartmentRevisionIM";
import useIDDCoordinatorEndorsementIM from "@/hooks/useIDDCoordinatorEndorsementIM";
import useIM from "@/hooks/useIM";
import useIMERCCITLDirectorEndorsementIM from "@/hooks/useIMERCCITLDirectorEndorsementIM";
import useIMERCCITLRevisionIM from "@/hooks/useIMERCCITLRevisionIM";
import useIMERCIDDCoordinatorEndorsementIM from "@/hooks/useIMERCIDDCoordinatorEndorsementIM";
import useQAMISChairpersonEndorsementIM from "@/hooks/useQAMISChairpersonEndorsementIM";
import useQAMISCoordinatorEndorsementIM from "@/hooks/useQAMISCoordinatorEndorsementIM";
import useQAMISDeanEndorsementIM from "@/hooks/useQAMISDeanEndorsementIM";
import useQAMISRevisionIM from "@/hooks/useQAMISRevisionIM";
import useSubmittedChairpersonSuggestionIM from "@/hooks/useSubmittedChairpersonSuggestionIM";
import useSubmittedContentEditorSuggestionIM from "@/hooks/useSubmittedContentEditorSuggestionIM";
import useSubmittedContentSpecialistSuggestionIM from "@/hooks/useSubmittedContentSpecialistSuggestionIM";
import useSubmittedCoordinatorSuggestionIM from "@/hooks/useSubmittedCoordinatorSuggestionIM";
import useSubmittedIDDCoordinatorSuggestionIM from "@/hooks/useSubmittedIDDCoordinatorSuggestionIM";
import useSubmittedIDDSpecialistSuggestionIM from "@/hooks/useSubmittedIDDSpecialistSuggestionIM";
import useSubmittedPeerSuggestionIM from "@/hooks/useSubmittedPeerSuggestionIM";
import Link from "next/link";
import { useRouter } from "next/router";

export default function IMTrackingPage() {
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
  const submittedIDDSpecialistSuggestionIM =
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

  return (
    <MainLayout>
      <div>
        <div className='flex justify-between'>
          <Link href={`/im/${iMId}`} className='underline'>
            Go back
          </Link>
          <h2 className='inline'>IM Tracking</h2>
          <Link
            href={`/api/im_file/im/${iMId}/pdf`}
            className='underline'
            target='_blank'
          >
            View PDF
          </Link>
        </div>
        <p className={`text-center ${departmentReview ? "font-bold" : ""}`}>
          Draft
        </p>
        <div className='flex flex-row justify-evenly'>
          <p
            className={`w-full text-center ${
              submittedPeerSuggestion ? "font-bold" : ""
            }`}
          >
            Peer Review
          </p>
          <p
            className={`w-full text-center ${
              submittedChairpersonSuggestion ? "font-bold" : ""
            }`}
          >
            Chairperson Review
          </p>
          <p
            className={`w-full text-center ${
              submittedCoordinatorSuggestion ? "font-bold" : ""
            }`}
          >
            Coordinator Review
          </p>
        </div>
        <p className={`text-center ${departmentRevision ? "font-bold" : ""}`}>
          Revision
        </p>
        <p
          className={`text-center ${coordinatorEndorsement ? "font-bold" : ""}`}
        >
          Coordinator Endorsement
        </p>
        <p className={`text-center ${deanEndorsement ? "font-bold" : ""}`}>
          Dean Endorsement
        </p>
        <p
          className={`text-center ${
            submittedIDDCoordinatorSuggestion ? "font-bold" : ""
          }`}
        >
          IDD Coordinator Review
        </p>
        <p className={`text-center ${cITLRevision ? "font-bold" : ""}`}>
          Revision
        </p>
        <p
          className={`text-center ${
            iDDCoordinatorEndorsement ? "font-bold" : ""
          }`}
        >
          IDD Coordinator Endorsement
        </p>
        <p
          className={`text-center ${
            cITLDirectorEndorsement ? "font-bold" : ""
          }`}
        >
          CITL Director Endorsement
        </p>
        <p
          className={`text-center ${
            cITLDirectorEndorsement ? "font-bold" : ""
          }`}
        >
          Try-out
        </p>
        <p className={`text-center ${qAMISRevision ? "font-bold" : ""}`}>
          Revision
        </p>
        <div className='flex flex-row justify-evenly'>
          <p
            className={`w-full text-center ${
              qAMISChairpersonEndorsement ? "font-bold" : ""
            }`}
          >
            Chairperson Endorsement
          </p>
          <p
            className={`w-full text-center ${
              qAMISCoordinatorEndorsement ? "font-bold" : ""
            }`}
          >
            Coordinator Endorsement
          </p>
          <p
            className={`w-full text-center ${
              qAMISDeanEndorsement ? "font-bold" : ""
            }`}
          >
            Dean Endorsement
          </p>
        </div>
        <div className='flex flex-row justify-evenly'>
          <p
            className={`w-full text-center ${
              submittedContentSpecialistSuggestion ? "font-bold" : ""
            }`}
          >
            Content Specialist Review
          </p>
          <p
            className={`w-full text-center ${
              submittedContentEditorSuggestion ? "font-bold" : ""
            }`}
          >
            Content Editor Review
          </p>
          <p
            className={`w-full text-center ${
              submittedIDDSpecialistSuggestionIM ? "font-bold" : ""
            }`}
          >
            IDD Specialist Review
          </p>
        </div>
        <p className={`text-center ${iMERCCITLRevision ? "font-bold" : ""}`}>
          Revision
        </p>
        <p
          className={`text-center ${
            iMERCIDDCoordinatorEndorsement ? "font-bold" : ""
          }`}
        >
          IDD Coordinator Endorsement
        </p>
        <p
          className={`text-center ${
            iMERCCITLDirectorEndorsement ? "font-bold" : ""
          }`}
        >
          CITL Director Endorsement
        </p>

        <p
          className={`text-center ${
            iMERCCITLDirectorEndorsement ? "font-bold" : ""
          }`}
        >
          Endorsed for Copyright
        </p>
      </div>
    </MainLayout>
  );
}
