import Loading from "@/components/Loading";
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
import useQAMISDepartmentEndorsementByIM from "@/hooks/useQAMISDepartmentEndorsementByIM";
import useQAMISRevisionIM from "@/hooks/useQAMISRevisionIM";
import useSubmittedChairpersonSuggestionIM from "@/hooks/useSubmittedChairpersonSuggestionIM";
import useSubmittedContentEditorSuggestionIM from "@/hooks/useSubmittedContentEditorSuggestionIM";
import useSubmittedContentSpecialistSuggestionIM from "@/hooks/useSubmittedContentSpecialistSuggestionIM";
import useSubmittedCoordinatorSuggestionIM from "@/hooks/useSubmittedCoordinatorSuggestionIM";
import useSubmittedIDDCoordinatorSuggestionIM from "@/hooks/useSubmittedIDDCoordinatorSuggestionIM";
import useSubmittedIDDSpecialistSuggestionIM from "@/hooks/useSubmittedIDDSpecialistSuggestionIM";
import useSubmittedPeerSuggestionIM from "@/hooks/useSubmittedPeerSuggestionIM";
import Error from "next/error";
import Link from "next/link";
import { useRouter } from "next/router";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  PanOnScrollMode,
} from "reactflow";

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
  const qAMISDepartmentEndorsement = useQAMISDepartmentEndorsementByIM({
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

  const nodes: Node<any, string | undefined>[] = [
    {
      id: "0",
      data: { label: "Empty" },
      position: { x: 300, y: 10 },
      hidden: Boolean(departmentReview),
    },
    {
      id: "1",
      data: {
        label: "Draft",
        object: {
          departmentReview,
        },
      },
      position: { x: 300, y: 10 },
      hidden: !Boolean(departmentReview),
    },
    {
      id: "2_1",
      data: { label: "Peer Review" },
      position: { x: 100, y: 100 },
      hidden: !Boolean(submittedPeerSuggestion),
    },
    {
      id: "2_2",
      data: { label: "Chairperson Review" },
      position: { x: 300, y: 100 },
      hidden: !Boolean(submittedChairpersonSuggestion),
    },
    {
      id: "2_3",
      data: { label: "Coordinator Review" },
      position: { x: 500, y: 100 },
      hidden: !Boolean(submittedCoordinatorSuggestion),
    },
    {
      id: "3",
      data: { label: "Department Revision" },
      position: { x: 300, y: 200 },
      hidden: !Boolean(departmentRevision),
    },
    {
      id: "4",
      data: { label: "Coordinator Endorsement" },
      position: { x: 300, y: 300 },
      hidden: !Boolean(coordinatorEndorsement),
    },
    {
      id: "5",
      data: { label: "Dean Endorsement" },
      position: { x: 300, y: 400 },
      hidden: !Boolean(deanEndorsement),
    },
    {
      id: "6",
      data: { label: "IDD Coordinator Review" },
      position: { x: 300, y: 500 },
      hidden: !Boolean(submittedIDDCoordinatorSuggestion),
    },
    {
      id: "7",
      data: { label: "CITL Revision" },
      position: { x: 300, y: 600 },
      hidden: !Boolean(cITLRevision),
    },
    {
      id: "8",
      data: { label: "IDD Coordinator Endorsement" },
      position: { x: 300, y: 700 },
      hidden: !Boolean(iDDCoordinatorEndorsement),
    },
    {
      id: "9",
      data: { label: "CITL Director Endorsement" },
      position: { x: 300, y: 800 },
      hidden: !Boolean(cITLDirectorEndorsement),
    },
    {
      id: "10",
      data: { label: "Try-out" },
      position: { x: 300, y: 900 },
      hidden: !Boolean(cITLDirectorEndorsement),
    },
    {
      id: "11",
      data: { label: "QAMIS Revision" },
      position: { x: 300, y: 1000 },
      hidden: !Boolean(qAMISRevision),
    },
    {
      id: "12_1",
      data: { label: "QAMIS Chairperson Endorsement" },
      position: { x: 100, y: 1100 },
      hidden: !Boolean(qAMISChairpersonEndorsement),
    },
    {
      id: "12_2",
      data: { label: "QAMIS Coordinator Endorsement" },
      position: { x: 300, y: 1100 },
      hidden: !Boolean(qAMISCoordinatorEndorsement),
    },
    {
      id: "12_3",
      data: { label: "QAMIS Dean Endorsement" },
      position: { x: 500, y: 1100 },
      hidden: !Boolean(qAMISDeanEndorsement),
    },
    {
      id: "13",
      data: { label: "Department Endorsement" },
      position: { x: 300, y: 1200 },
      hidden: !Boolean(qAMISDepartmentEndorsement),
    },
    {
      id: "14_1",
      data: { label: "Content Specialist Review" },
      position: { x: 100, y: 1300 },
      hidden: !Boolean(submittedContentSpecialistSuggestion),
    },
    {
      id: "14_2",
      data: { label: "IDD Specialist Review" },
      position: { x: 300, y: 1300 },
      hidden: !Boolean(submittedIDDSpecialistSuggestion),
    },
    {
      id: "14_3",
      data: { label: "Content Editor Review" },
      position: { x: 500, y: 1300 },
      hidden: !Boolean(submittedContentEditorSuggestion),
    },
    {
      id: "15",
      data: { label: "IMERC Revision" },
      position: { x: 300, y: 1400 },
      hidden: !Boolean(iMERCCITLRevision),
    },
    {
      id: "16",
      data: { label: "IMERC IDD Coordinator Endorsement" },
      position: { x: 300, y: 1500 },
      hidden: !Boolean(iMERCIDDCoordinatorEndorsement),
    },
    {
      id: "17",
      data: { label: "IMERC CITL Director Endorsement" },
      position: { x: 300, y: 1600 },
      hidden: !Boolean(iMERCCITLDirectorEndorsement),
    },
  ];

  const edges: Edge<any>[] = [
    {
      id: "1-2_1",
      source: "1",
      target: "2_1",
    },
    {
      id: "1-2_2",
      source: "1",
      target: "2_2",
    },
    {
      id: "1-2_3",
      source: "1",
      target: "2_3",
    },
    {
      id: "2_1-3",
      source: "2_1",
      target: "3",
    },
    {
      id: "2_2-3",
      source: "2_2",
      target: "3",
    },
    {
      id: "2_2-3",
      source: "2_2",
      target: "3",
    },
    {
      id: "2_3-3",
      source: "2_3",
      target: "3",
    },
    {
      id: "3-4",
      source: "3",
      target: "4",
    },
    {
      id: "4-5",
      source: "4",
      target: "5",
    },
    {
      id: "5-6",
      source: "5",
      target: "6",
    },
    {
      id: "6-7",
      source: "6",
      target: "7",
    },
    {
      id: "7-8",
      source: "7",
      target: "8",
    },
    {
      id: "8-9",
      source: "8",
      target: "9",
    },
    {
      id: "9-10",
      source: "9",
      target: "10",
    },
    {
      id: "10-11",
      source: "10",
      target: "11",
    },
    {
      id: "11-12_1",
      source: "11",
      target: "12_1",
    },
    {
      id: "11-12_2",
      source: "11",
      target: "12_2",
    },
    {
      id: "11-12_3",
      source: "11",
      target: "12_3",
    },
    {
      id: "12_1-13",
      source: "12_1",
      target: "13",
    },
    {
      id: "12_2-13",
      source: "12_2",
      target: "13",
    },
    {
      id: "12_3-13",
      source: "12_3",
      target: "13",
    },
    {
      id: "13-14_1",
      source: "13",
      target: "14_1",
    },
    {
      id: "13-14_2",
      source: "13",
      target: "14_2",
    },
    {
      id: "13-14_3",
      source: "13",
      target: "14_3",
    },
    {
      id: "14_1-15",
      source: "14_1",
      target: "15",
    },
    {
      id: "14_2-15",
      source: "14_2",
      target: "15",
    },
    {
      id: "14_3-15",
      source: "14_3",
      target: "15",
    },
    {
      id: "15-16",
      source: "15",
      target: "16",
    },
    {
      id: "16-17",
      source: "16",
      target: "17",
    },
  ];

  if (iM === null) {
    return (
      <MainLayout>
        <Error statusCode={404} title='IM Not Found' />
      </MainLayout>
    );
  }
  if (iM === undefined) {
    return (
      <MainLayout>
        <Loading />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className='h-full w-full mr-50'>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnScroll={true}
          panOnScrollMode={PanOnScrollMode.Vertical}
          translateExtent={[
            [0, 0],
            [800, 1700],
          ]}
        >
          <Background />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
      {/* <div className="h-4 w-full -mt-4 bg-palette_white z-50 relative"></div> */}
    </MainLayout>
  );
}
