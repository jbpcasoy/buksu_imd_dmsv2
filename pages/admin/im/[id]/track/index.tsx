import Loading from "@/components/Loading";
import AdminLayout from "@/components/AdminLayout";
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
import { useState } from "react";
import Modal, { ModalProps } from "@/components/Modal";
import { DateTime } from "luxon";
import {
  CITLDirectorEndorsement,
  CITLRevision,
  CoordinatorEndorsement,
  DeanEndorsement,
  DepartmentReview,
  DepartmentRevision,
  IDDCoordinatorEndorsement,
  IMERCCITLDirectorEndorsement,
  IMERCCITLRevision,
  IMERCIDDCoordinatorEndorsement,
  QAMISChairpersonEndorsement,
  QAMISCoordinatorEndorsement,
  QAMISDeanEndorsement,
  QAMISDepartmentEndorsement,
  QAMISRevision,
  SubmittedChairpersonSuggestion,
  SubmittedContentEditorSuggestion,
  SubmittedContentSpecialistSuggestion,
  SubmittedCoordinatorSuggestion,
  SubmittedIDDCoordinatorSuggestion,
  SubmittedIDDSpecialistSuggestion,
  SubmittedPeerSuggestion,
} from "@prisma/client";
import useQAMISDepartmentEndorsementByIM from "@/hooks/useQAMISDepartmentEndorsementByIM";
import usePeerSuggestion from "@/hooks/usePeerSuggestion";
import usePeerReview from "@/hooks/usePeerReview";
import useFaculty from "@/hooks/useFaculty";
import useUser from "@/hooks/useUser";
import useChairpersonSuggestion from "@/hooks/useChairpersonSuggestion";
import useChairpersonReview from "@/hooks/useChairpersonReview";
import useChairperson from "@/hooks/useChairperson";
import useCoordinatorSuggestion from "@/hooks/useCoordinatorSuggestion";
import useCoordinatorReview from "@/hooks/useCoordinatorReview";
import useCoordinator from "@/hooks/useCoordinator";
import useIMFile from "@/hooks/useIMFile";
import useDean from "@/hooks/useDean";
import useIDDCoordinatorSuggestion from "@/hooks/useIDDCoordinatorSuggestion";
import useIDDCoordinator from "@/hooks/useIDDCoordinator";
import useCITLDirector from "@/hooks/useCITLDirector";
import useContentSpecialist from "@/hooks/useContentSpecialist";
import useContentSpecialistSuggestion from "@/hooks/useContentSpecialistSuggestion";
import useContentSpecialistReview from "@/hooks/useContentSpecialistReview";
import useIDDSpecialistSuggestion from "@/hooks/useIDDSpecialistSuggestion";
import useIDDSpecialistReview from "@/hooks/useIDDSpecialistReview";
import useContentEditorSuggestion from "@/hooks/useContentEditorSuggestion";
import useContentEditorReview from "@/hooks/useContentEditorReview";

export default function IMTrackingPage() {
  const [state, setState] = useState({
    openModal: "",
  });
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

  const closeModal = () => {
    setState((prev) => ({
      ...prev,
      openModal: "",
    }));
  };

  if (iM === null) {
    return (
      <AdminLayout>
        <Error statusCode={404} title='IM Not Found' />
      </AdminLayout>
    );
  }
  if (iM === undefined) {
    return (
      <AdminLayout>
        <Loading />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
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
          onNodeClick={(e, node) => {
            setState((prev) => ({ ...prev, openModal: node.data.label }));
          }}
        >
          <Background />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>

      {state.openModal !== "" && (
        <Modal onClose={closeModal} title={state.openModal}>
          {state.openModal === "Draft" && departmentReview && (
            <DepartmentReviewModal departmentReview={departmentReview} />
          )}
          {state.openModal === "Peer Review" && submittedPeerSuggestion && (
            <PeerReviewModal
              iMId={iMId}
              submittedPeerSuggestion={submittedPeerSuggestion}
            />
          )}
          {state.openModal === "Chairperson Review" &&
            submittedChairpersonSuggestion && (
              <ChairpersonReviewModal
                iMId={iMId}
                submittedChairpersonSuggestion={submittedChairpersonSuggestion}
              />
            )}
          {state.openModal === "Coordinator Review" &&
            submittedCoordinatorSuggestion && (
              <CoordinatorReviewModal
                iMId={iMId}
                submittedCoordinatorSuggestion={submittedCoordinatorSuggestion}
              />
            )}

          {state.openModal === "Department Revision" && departmentRevision && (
            <DepartmentRevisionModal
              departmentRevision={departmentRevision}
              iMId={iMId}
            />
          )}

          {state.openModal === "Coordinator Endorsement" &&
            coordinatorEndorsement && (
              <CoordinatorEndorsementModal
                coordinatorEndorsement={coordinatorEndorsement}
              />
            )}
          {state.openModal === "Dean Endorsement" && deanEndorsement && (
            <DeanEndorsementModal deanEndorsement={deanEndorsement} />
          )}
          {state.openModal === "IDD Coordinator Review" &&
            submittedIDDCoordinatorSuggestion && (
              <IDDCoordinatorReviewModal
                iMId={iMId}
                submittedIDDCoordinatorSuggestion={
                  submittedIDDCoordinatorSuggestion
                }
              />
            )}
          {state.openModal === "CITL Revision" && cITLRevision && (
            <CITLRevisionModal cITLRevision={cITLRevision} iMId={iMId} />
          )}
          {state.openModal === "IDD Coordinator Endorsement" &&
            iDDCoordinatorEndorsement && (
              <IDDCoordinatorEndorsementModal
                iDDCoordinatorEndorsement={iDDCoordinatorEndorsement}
              />
            )}
          {state.openModal === "CITL Director Endorsement" &&
            cITLDirectorEndorsement && (
              <CITLDirectorEndorsementModal
                cITLDirectorEndorsement={cITLDirectorEndorsement}
              />
            )}
          {state.openModal === "Try-out" && cITLDirectorEndorsement && (
            <TryOutModal cITLDirectorEndorsement={cITLDirectorEndorsement} />
          )}
          {state.openModal === "QAMIS Revision" && qAMISRevision && (
            <QAMISRevisionModal qAMISRevision={qAMISRevision} iMId={iMId} />
          )}
          {state.openModal === "QAMIS Chairperson Endorsement" &&
            qAMISChairpersonEndorsement && (
              <QAMISChairpersonEndorsementModal
                qAMISChairpersonEndorsement={qAMISChairpersonEndorsement}
              />
            )}
          {state.openModal === "QAMIS Coordinator Endorsement" &&
            qAMISCoordinatorEndorsement && (
              <QAMISCoordinatorEndorsementModal
                qAMISCoordinatorEndorsement={qAMISCoordinatorEndorsement}
              />
            )}
          {state.openModal === "QAMIS Dean Endorsement" &&
            qAMISDeanEndorsement && (
              <QAMISDeanEndorsementModal
                qAMISDeanEndorsement={qAMISDeanEndorsement}
              />
            )}
          {state.openModal === "Department Endorsement" &&
            qAMISDepartmentEndorsement && (
              <QAMISDepartmentEndorsementModal
                qAMISDepartmentEndorsement={qAMISDepartmentEndorsement}
              />
            )}
          {state?.openModal === "Content Specialist Review" &&
            submittedContentSpecialistSuggestion && (
              <ContentSpecialistReviewModal
                iMId={iMId}
                submittedContentSpecialistSuggestion={
                  submittedContentSpecialistSuggestion
                }
              />
            )}
          {state?.openModal === "IDD Specialist Review" &&
            submittedIDDSpecialistSuggestion && (
              <IDDSpecialistReviewModal
                iMId={iMId}
                submittedIDDSpecialistSuggestion={
                  submittedIDDSpecialistSuggestion
                }
              />
            )}
          {state?.openModal === "Content Editor Review" &&
            submittedContentEditorSuggestion && (
              <ContentEditorReviewModal
                iMId={iMId}
                submittedContentEditorSuggestion={
                  submittedContentEditorSuggestion
                }
              />
            )}
          {state?.openModal === "IMERC Revision" && iMERCCITLRevision && (
            <IMERCCITLRevisionModal
              iMERCCITLRevision={iMERCCITLRevision}
              iMId={iMId}
            />
          )}
          {state?.openModal === "IMERC IDD Coordinator Endorsement" &&
            iMERCIDDCoordinatorEndorsement && (
              <IMERCIDDCoordinatorEndorsementModal
                iMERCIDDCoordinatorEndorsement={iMERCIDDCoordinatorEndorsement}
              />
            )}
          {state?.openModal === "IMERC CITL Director Endorsement" &&
            iMERCCITLDirectorEndorsement && (
              <IMERCCITLDirectorEndorsementModal
                iMERCCITLDirectorEndorsement={iMERCCITLDirectorEndorsement}
              />
            )}
        </Modal>
      )}
    </AdminLayout>
  );
}

interface DepartmentReviewModalProps {
  departmentReview: DepartmentReview;
}

function DepartmentReviewModal({
  departmentReview,
}: DepartmentReviewModalProps) {
  return (
    <p className='text-sm'>
      Submitted for review{" "}
      <span className='text-palette_light_blue'>
        {DateTime.fromJSDate(
          new Date(departmentReview?.updatedAt ?? "")
        ).toFormat( "D | t")}
      </span>
    </p>
  );
}

interface PeerReviewModalProps {
  submittedPeerSuggestion: SubmittedPeerSuggestion;
  iMId: string;
}

function PeerReviewModal({
  submittedPeerSuggestion,
  iMId,
}: PeerReviewModalProps) {
  const peerSuggestion = usePeerSuggestion({
    id: submittedPeerSuggestion.peerSuggestionId,
  });
  const peerReview = usePeerReview({
    id: peerSuggestion?.peerReviewId,
  });
  const faculty = useFaculty({
    id: peerReview?.facultyId,
  });
  const user = useUser({
    id: faculty?.userId,
  });

  return (
    <div className='text-sm flex flex-col space-y-4'>
      {user && (
        <p>
          Reviewed by{" "}
          <Link
            href={`/admin/user/${user.id}`}
            className='text-palette_light_blue hover:underline'
          >
            {user.name}
          </Link>{" "}
          |{" "}
          <span className='text-palette_light_blue'>
            {DateTime.fromJSDate(
              new Date(submittedPeerSuggestion?.updatedAt ?? "")
            ).toFormat( "D | t")}
          </span>
          .
        </p>
      )}
      {!user && <p className='animate-pulse'>Loading...</p>}
      <div className='flex justify-start space-x-2'>
        <Link
          href={`/admin/im/${iMId}/all_reviews`}
          className='hover:bg-opacity-90 rounded px-2 py-1 text-palette_white bg-palette_blue flex space-x-1 items-center'
        >
          <span>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              height='16'
              width='16'
              viewBox='0 0 512 512'
              className='fill-palette_white w-3 h-3'
            >
              <path d='M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z' />
            </svg>
          </span>
          <span>Evaluation</span>
        </Link>
        <Link
          href={`/admin/im/${iMId}/all_suggestions`}
          className='hover:bg-opacity-90 rounded px-2 py-1 text-palette_white bg-palette_blue flex space-x-1 items-center'
        >
          <span>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              height='16'
              width='16'
              viewBox='0 0 512 512'
              className='fill-palette_white w-3 h-3'
            >
              <path d='M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z' />
            </svg>
          </span>
          <span>Suggestion</span>
        </Link>
      </div>
    </div>
  );
}

interface ChairpersonReviewModalProps {
  submittedChairpersonSuggestion: SubmittedChairpersonSuggestion;
  iMId: string;
}

function ChairpersonReviewModal({
  submittedChairpersonSuggestion,
  iMId,
}: ChairpersonReviewModalProps) {
  const chairpersonSuggestion = useChairpersonSuggestion({
    id: submittedChairpersonSuggestion.chairpersonSuggestionId,
  });
  const chairpersonReview = useChairpersonReview({
    id: chairpersonSuggestion?.chairpersonReviewId,
  });
  const chairperson = useChairperson({
    id: chairpersonReview?.chairpersonId,
  });
  const faculty = useFaculty({
    id: chairperson?.facultyId,
  });
  const user = useUser({
    id: faculty?.userId,
  });
  return (
    <div className='text-sm flex flex-col space-y-4'>
      {user && (
        <p>
          Reviewed by{" "}
          <Link
            href={`/admin/user/${user.id}`}
            className='text-palette_light_blue hover:underline'
          >
            {user.name}
          </Link>{" "}
          |{" "}
          <span className='text-palette_light_blue'>
            {DateTime.fromJSDate(
              new Date(submittedChairpersonSuggestion?.updatedAt ?? "")
            ).toFormat( "D | t")}
          </span>
          .
        </p>
      )}
      {!user && <p className='animate-pulse'>Loading...</p>}
      <div className='flex justify-start space-x-2'>
        <Link
          href={`/admin/im/${iMId}/all_reviews`}
          className='hover:bg-opacity-90 rounded px-2 py-1 text-palette_white bg-palette_blue flex space-x-1 items-center'
        >
          <span>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              height='16'
              width='16'
              viewBox='0 0 512 512'
              className='fill-palette_white'
            >
              <path d='M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z' />
            </svg>
          </span>
          <span>Evaluation</span>
        </Link>
        <Link
          href={`/admin/im/${iMId}/all_suggestions`}
          className='hover:bg-opacity-90 rounded px-2 py-1 text-palette_white bg-palette_blue flex space-x-1 items-center'
        >
          <span>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              height='16'
              width='16'
              viewBox='0 0 512 512'
              className='fill-palette_white'
            >
              <path d='M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z' />
            </svg>
          </span>
          <span>Suggestion</span>
        </Link>
      </div>
    </div>
  );
}

interface CoordinatorReviewModalProps {
  submittedCoordinatorSuggestion: SubmittedCoordinatorSuggestion;
  iMId: string;
}

function CoordinatorReviewModal({
  submittedCoordinatorSuggestion,
  iMId,
}: CoordinatorReviewModalProps) {
  const coordinatorSuggestion = useCoordinatorSuggestion({
    id: submittedCoordinatorSuggestion.coordinatorSuggestionId,
  });
  const coordinatorReview = useCoordinatorReview({
    id: coordinatorSuggestion?.coordinatorReviewId,
  });
  const coordinator = useCoordinator({
    id: coordinatorReview?.coordinatorId,
  });
  const faculty = useFaculty({
    id: coordinator?.facultyId,
  });
  const user = useUser({
    id: faculty?.userId,
  });

  return (
    <div className='text-sm flex flex-col space-y-4'>
      {user && (
        <p>
          Reviewed by{" "}
          <Link
            href={`/admin/user/${user.id}`}
            className='text-palette_light_blue hover:underline'
          >
            {user.name}
          </Link>{" "}
          |{" "}
          <span className='text-palette_light_blue'>
            {DateTime.fromJSDate(
              new Date(submittedCoordinatorSuggestion?.updatedAt ?? "")
            ).toFormat( "D | t")}
          </span>
          .
        </p>
      )}
      {!user && <p className='animate-pulse'>Loading...</p>}
      <div className='flex justify-start space-x-2'>
        <Link
          href={`/admin/im/${iMId}/all_reviews`}
          className='hover:bg-opacity-90 rounded px-2 py-1 text-palette_white bg-palette_blue flex space-x-1 items-center'
        >
          <span>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              height='16'
              width='16'
              viewBox='0 0 512 512'
              className='fill-palette_white'
            >
              <path d='M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z' />
            </svg>
          </span>
          <span>Evaluation</span>
        </Link>
        <Link
          href={`/admin/im/${iMId}/all_suggestions`}
          className='hover:bg-opacity-90 rounded px-2 py-1 text-palette_white bg-palette_blue flex space-x-1 items-center'
        >
          <span>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              height='16'
              width='16'
              viewBox='0 0 512 512'
              className='fill-palette_white'
            >
              <path d='M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z' />
            </svg>
          </span>
          <span>Suggestion</span>
        </Link>
      </div>
    </div>
  );
}

interface DepartmentRevisionModalProps {
  departmentRevision: DepartmentRevision;
  iMId: string;
}

function DepartmentRevisionModal({
  departmentRevision,
  iMId,
}: DepartmentRevisionModalProps) {
  const iM = useIM({
    id: iMId,
  });
  const faculty = useFaculty({ id: iM?.facultyId });
  const user = useUser({
    id: faculty?.userId,
  });

  return (
    <div className='text-sm'>
      {user && (
        <p>
          Revised by{" "}
          <Link
            href={`/admin/user/${user.id}`}
            className='text-palette_light_blue hover:underline'
          >
            {user.name}
          </Link>{" "}
          |{" "}
          <span className='text-palette_light_blue'>
            {DateTime.fromJSDate(
              new Date(departmentRevision?.updatedAt ?? "")
            ).toFormat( "D | t")}
          </span>
        </p>
      )}
      {!user && <p className='animate-pulse'>Loading...</p>}
    </div>
  );
}

interface CoordinatorEndorsementModalProps {
  coordinatorEndorsement: CoordinatorEndorsement;
}

function CoordinatorEndorsementModal({
  coordinatorEndorsement,
}: CoordinatorEndorsementModalProps) {
  const coordinator = useCoordinator({
    id: coordinatorEndorsement.coordinatorId,
  });
  const faculty = useFaculty({ id: coordinator?.facultyId });
  const user = useUser({
    id: faculty?.userId,
  });

  return (
    <div className='text-sm'>
      {user && (
        <p>
          Endorsed by{" "}
          <Link
            href={`/admin/user/${user.id}`}
            className='text-palette_light_blue hover:underline'
          >
            {user.name}
          </Link>{" "}
          |{" "}
          <span className='text-palette_light_blue'>
            {DateTime.fromJSDate(
              new Date(coordinatorEndorsement?.updatedAt ?? "")
            ).toFormat( "D | t")}
          </span>
        </p>
      )}
      {!user && <p className='animate-pulse'>Loading...</p>}
    </div>
  );
}

interface DeanEndorsementModalProps {
  deanEndorsement: DeanEndorsement;
}

function DeanEndorsementModal({ deanEndorsement }: DeanEndorsementModalProps) {
  const dean = useDean({ id: deanEndorsement.deanId });
  const faculty = useFaculty({ id: dean?.facultyId });
  const user = useUser({ id: faculty?.userId });

  return (
    <div className='text-sm'>
      {user && (
        <p>
          Endorsed by{" "}
          <Link
            href={`/admin/user/${user.id}`}
            className='text-palette_light_blue hover:underline'
          >
            {user.name}
          </Link>{" "}
          |{" "}
          <span className='text-palette_light_blue'>
            {DateTime.fromJSDate(
              new Date(deanEndorsement?.updatedAt ?? "")
            ).toFormat( "D | t")}
          </span>
        </p>
      )}
      {!user && <p className='animate-pulse'>Loading...</p>}
    </div>
  );
}

interface IDDCoordinatorReviewModalProps {
  submittedIDDCoordinatorSuggestion: SubmittedIDDCoordinatorSuggestion;
  iMId: string;
}
function IDDCoordinatorReviewModal({
  iMId,
  submittedIDDCoordinatorSuggestion,
}: IDDCoordinatorReviewModalProps) {
  const iDDCoordinatorSuggestion = useIDDCoordinatorSuggestion({
    id: submittedIDDCoordinatorSuggestion.iDDCoordinatorSuggestionId,
  });
  const iDDCoordinator = useIDDCoordinator({
    id: iDDCoordinatorSuggestion?.iDDCoordinatorId,
  });
  const user = useUser({
    id: iDDCoordinator?.userId,
  });

  return (
    <div className='text-sm space-y-4'>
      {user && (
        <p>
          Reviewed by{" "}
          <Link
            href={`/admin/user/${user.id}`}
            className='text-palette_light_blue hover:underline'
          >
            {user.name}
          </Link>{" "}
          |{" "}
          <span className='text-palette_light_blue'>
            {DateTime.fromJSDate(
              new Date(submittedIDDCoordinatorSuggestion?.updatedAt ?? "")
            ).toFormat( "D | t")}
          </span>
        </p>
      )}
      {!user && <p className='animate-pulse'>Loading...</p>}
      <div className='flex justify-start space-x-2'>
        <Link
          href={`/admin/im/${iMId}/all_suggestions`}
          className='hover:bg-opacity-90 rounded px-2 py-1 text-palette_white bg-palette_blue flex space-x-1 items-center'
        >
          <span>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              height='16'
              width='16'
              viewBox='0 0 512 512'
              className='fill-palette_white w-3 h-3'
            >
              <path d='M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z' />
            </svg>
          </span>
          <span>Suggestion</span>
        </Link>
      </div>
    </div>
  );
}

interface CITLRevisionModalProps {
  cITLRevision: CITLRevision;
  iMId: string;
}
function CITLRevisionModal({ cITLRevision, iMId }: CITLRevisionModalProps) {
  const iM = useIM({ id: iMId });
  const faculty = useFaculty({
    id: iM?.facultyId,
  });
  const user = useUser({
    id: faculty?.userId,
  });

  return (
    <div className='text-sm'>
      {user && (
        <p>
          Revised by{" "}
          <Link
            href={`/admin/user/${user.id}`}
            className='text-palette_light_blue hover:underline'
          >
            {user.name}
          </Link>{" "}
          |{" "}
          <span className='text-palette_light_blue'>
            {DateTime.fromJSDate(
              new Date(cITLRevision?.updatedAt ?? "")
            ).toFormat( "D | t")}
          </span>
          .
        </p>
      )}
      {!user && <p className='animate-pulse'>Loading...</p>}
    </div>
  );
}

interface IDDCoordinatorEndorsementModalProps {
  iDDCoordinatorEndorsement: IDDCoordinatorEndorsement;
}

function IDDCoordinatorEndorsementModal({
  iDDCoordinatorEndorsement,
}: IDDCoordinatorEndorsementModalProps) {
  const iDDCoordinator = useIDDCoordinator({
    id: iDDCoordinatorEndorsement.iDDCoordinatorId,
  });
  const user = useUser({ id: iDDCoordinator?.userId });
  return (
    <div className='text-sm'>
      {user && (
        <p>
          Endorsed by{" "}
          <Link
            href={`/admin/user/${user.id}`}
            className='text-palette_light_blue hover:underline'
          >
            {user.name}
          </Link>{" "}
          |{" "}
          <span className='text-palette_light_blue'>
            {DateTime.fromJSDate(
              new Date(iDDCoordinatorEndorsement?.updatedAt ?? "")
            ).toFormat( "D | t")}
          </span>
        </p>
      )}
      {!user && <p className='animate-pulse'>Loading...</p>}
    </div>
  );
}

interface CITLDirectorEndorsementModalProps {
  cITLDirectorEndorsement: CITLDirectorEndorsement;
}

function CITLDirectorEndorsementModal({
  cITLDirectorEndorsement,
}: CITLDirectorEndorsementModalProps) {
  const cITLDirector = useCITLDirector({
    id: cITLDirectorEndorsement.cITLDirectorId,
  });
  const user = useUser({
    id: cITLDirector?.userId,
  });

  return (
    <div className='text-sm'>
      {user && (
        <p>
          Endorsed by{" "}
          <Link
            href={`/admin/user/${user.id}`}
            className='text-palette_light_blue hover:underline'
          >
            {user.name}
          </Link>{" "}
          |{" "}
          <span className='text-palette_light_blue'>
            {DateTime.fromJSDate(
              new Date(cITLDirectorEndorsement?.updatedAt ?? "")
            ).toFormat( "D | t")}
          </span>
        </p>
      )}
      {!user && <p className='animate-pulse'>Loading...</p>}
    </div>
  );
}

interface TryOutModalProps {
  cITLDirectorEndorsement: CITLDirectorEndorsement;
}
function TryOutModal({ cITLDirectorEndorsement }: TryOutModalProps) {
  return (
    <div className='text-sm'>
      <p>
        On try-out until{" "}
        <span className='text-palette_light_blue'>
          {DateTime.fromJSDate(
            new Date(cITLDirectorEndorsement?.updatedAt ?? "")
          )
            .plus({
              months: 5,
            })
            .toLocaleString(DateTime.DATE_FULL)}
        </span>
      </p>
    </div>
  );
}

interface QAMISRevisionModalProps {
  qAMISRevision: QAMISRevision;
  iMId: string;
}
function QAMISRevisionModal({ qAMISRevision, iMId }: QAMISRevisionModalProps) {
  const iM = useIM({ id: iMId });
  const faculty = useFaculty({
    id: iM?.facultyId,
  });
  const user = useUser({ id: faculty?.userId });
  return (
    <div className='text-sm'>
      {user && (
        <p>
          Revised by{" "}
          <Link
            href={`/admin/user/${user.id}`}
            className='text-palette_light_blue hover:underline'
          >
            {user.name}
          </Link>{" "}
          |{" "}
          <span className='text-palette_light_blue'>
            {DateTime.fromJSDate(
              new Date(qAMISRevision?.updatedAt ?? "")
            ).toFormat( "D | t")}
          </span>
          .
        </p>
      )}
      {!user && <p className='animate-pulse'>Loading...</p>}
    </div>
  );
}

interface QAMISChairpersonEndorsementModalProps {
  qAMISChairpersonEndorsement: QAMISChairpersonEndorsement;
}
function QAMISChairpersonEndorsementModal({
  qAMISChairpersonEndorsement,
}: QAMISChairpersonEndorsementModalProps) {
  const chairperson = useChairperson({
    id: qAMISChairpersonEndorsement.chairpersonId,
  });
  const faculty = useFaculty({ id: chairperson?.facultyId });
  const user = useUser({ id: faculty?.userId });

  return (
    <div className='text-sm'>
      {user && (
        <p>
          Revised by{" "}
          <Link
            href={`/admin/user/${user.id}`}
            className='text-palette_light_blue hover:underline'
          >
            {user.name}
          </Link>{" "}
          |{" "}
          <span className='text-palette_light_blue'>
            {DateTime.fromJSDate(
              new Date(qAMISChairpersonEndorsement?.updatedAt ?? "")
            ).toFormat( "D | t")}
          </span>
          .
        </p>
      )}
      {!user && <p className='animate-pulse'>Loading...</p>}
    </div>
  );
}

interface QAMISCoordinatorEndorsementModalProps {
  qAMISCoordinatorEndorsement: QAMISCoordinatorEndorsement;
}
function QAMISCoordinatorEndorsementModal({
  qAMISCoordinatorEndorsement,
}: QAMISCoordinatorEndorsementModalProps) {
  const coordinator = useCoordinator({
    id: qAMISCoordinatorEndorsement.coordinatorId,
  });
  const faculty = useFaculty({ id: coordinator?.facultyId });
  const user = useUser({ id: faculty?.userId });
  return (
    <div className='text-sm'>
      {user && (
        <p>
          Revised by{" "}
          <Link
            href={`/admin/user/${user.id}`}
            className='text-palette_light_blue hover:underline'
          >
            {user.name}
          </Link>{" "}
          |{" "}
          <span className='text-palette_light_blue'>
            {DateTime.fromJSDate(
              new Date(qAMISCoordinatorEndorsement?.updatedAt ?? "")
            ).toFormat( "D | t")}
          </span>
          .
        </p>
      )}
      {!user && <p className='animate-pulse'>Loading...</p>}
    </div>
  );
}

interface QAMISDeanEndorsementModalProps {
  qAMISDeanEndorsement: QAMISDeanEndorsement;
}
function QAMISDeanEndorsementModal({
  qAMISDeanEndorsement,
}: QAMISDeanEndorsementModalProps) {
  const dean = useDean({
    id: qAMISDeanEndorsement.deanId,
  });
  const faculty = useFaculty({ id: dean?.facultyId });
  const user = useUser({ id: faculty?.userId });
  return (
    <div className='text-sm'>
      {user && (
        <p>
          Revised by{" "}
          <Link
            href={`/admin/user/${user.id}`}
            className='text-palette_light_blue hover:underline'
          >
            {user.name}
          </Link>{" "}
          |{" "}
          <span className='text-palette_light_blue'>
            {DateTime.fromJSDate(
              new Date(qAMISDeanEndorsement?.updatedAt ?? "")
            ).toFormat( "D | t")}
          </span>
          .
        </p>
      )}
      {!user && <p className='animate-pulse'>Loading...</p>}
    </div>
  );
}

interface QAMISDepartmentEndorsementModalProps {
  qAMISDepartmentEndorsement: QAMISDepartmentEndorsement;
}
function QAMISDepartmentEndorsementModal({
  qAMISDepartmentEndorsement,
}: QAMISDepartmentEndorsementModalProps) {
  return (
    <div className='text-sm'>
      <p>
        Endorsed{" "}
        <span className='text-palette_light_blue'>
          {DateTime.fromJSDate(
            new Date(qAMISDepartmentEndorsement?.updatedAt ?? "")
          ).toFormat( "D | t")}
        </span>
      </p>
    </div>
  );
}

interface ContentSpecialistReviewModalProps {
  submittedContentSpecialistSuggestion: SubmittedContentSpecialistSuggestion;
  iMId: string;
}
function ContentSpecialistReviewModal({
  iMId,
  submittedContentSpecialistSuggestion,
}: ContentSpecialistReviewModalProps) {
  const contentSpecialistSuggestion = useContentSpecialistSuggestion({
    id: submittedContentSpecialistSuggestion.contentSpecialistSuggestionId,
  });
  const contentSpecialistReview = useContentSpecialistReview({
    id: contentSpecialistSuggestion?.contentSpecialistReviewId,
  });
  const contentSpecialist = useContentSpecialist({
    id: contentSpecialistReview?.contentSpecialistId,
  });
  const faculty = useFaculty({
    id: contentSpecialist?.facultyId,
  });
  const user = useUser({
    id: faculty?.userId,
  });

  return (
    <div className='text-sm flex flex-col space-y-4'>
      {user && (
        <p>
          Reviewed by{" "}
          <Link
            href={`/admin/user/${user.id}`}
            className='text-palette_light_blue hover:underline'
          >
            {user.name}
          </Link>{" "}
          |{" "}
          <span className='text-palette_light_blue'>
            {DateTime.fromJSDate(
              new Date(submittedContentSpecialistSuggestion?.updatedAt ?? "")
            ).toFormat( "D | t")}
          </span>
          .
        </p>
      )}
      {!user && <p className='animate-pulse'>Loading...</p>}
      <div className='flex justify-start space-x-2'>
        <Link
          href={`/admin/im/${iMId}/all_reviews`}
          className='hover:bg-opacity-90 rounded px-2 py-1 text-palette_white bg-palette_blue flex space-x-1 items-center'
        >
          <span>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              height='16'
              width='16'
              viewBox='0 0 512 512'
              className='fill-palette_white'
            >
              <path d='M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z' />
            </svg>
          </span>
          <span>Evaluation</span>
        </Link>
        <Link
          href={`/admin/im/${iMId}/all_suggestions`}
          className='hover:bg-opacity-90 rounded px-2 py-1 text-palette_white bg-palette_blue flex space-x-1 items-center'
        >
          <span>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              height='16'
              width='16'
              viewBox='0 0 512 512'
              className='fill-palette_white'
            >
              <path d='M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z' />
            </svg>
          </span>
          <span>Suggestion</span>
        </Link>
      </div>
    </div>
  );
}

interface IDDSpecialistReviewModalProps {
  submittedIDDSpecialistSuggestion: SubmittedIDDSpecialistSuggestion;
  iMId: string;
}
function IDDSpecialistReviewModal({
  iMId,
  submittedIDDSpecialistSuggestion,
}: IDDSpecialistReviewModalProps) {
  const iDDSpecialistSuggestion = useIDDSpecialistSuggestion({
    id: submittedIDDSpecialistSuggestion.iDDSpecialistSuggestionId,
  });
  const iDDSpecialistReview = useIDDSpecialistReview({
    id: iDDSpecialistSuggestion?.iDDSpecialistReviewId,
  });
  const iDDCoordinator = useIDDCoordinator({
    id: iDDSpecialistReview?.iDDCoordinatorId,
  });
  const user = useUser({
    id: iDDCoordinator?.userId,
  });

  return (
    <div className='text-sm flex flex-col space-y-4'>
      {user && (
        <p>
          Reviewed by{" "}
          <Link
            href={`/admin/user/${user.id}`}
            className='text-palette_light_blue hover:underline'
          >
            {user.name}
          </Link>{" "}
          |{" "}
          <span className='text-palette_light_blue'>
            {DateTime.fromJSDate(
              new Date(submittedIDDSpecialistSuggestion?.updatedAt ?? "")
            ).toFormat( "D | t")}
          </span>
          .
        </p>
      )}
      {!user && <p className='animate-pulse'>Loading...</p>}
      <div className='flex justify-start space-x-2'>
        <Link
          href={`/admin/im/${iMId}/all_reviews`}
          className='hover:bg-opacity-90 rounded px-2 py-1 text-palette_white bg-palette_blue flex space-x-1 items-center'
        >
          <span>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              height='16'
              width='16'
              viewBox='0 0 512 512'
              className='fill-palette_white'
            >
              <path d='M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z' />
            </svg>
          </span>
          <span>Evaluation</span>
        </Link>
        <Link
          href={`/admin/im/${iMId}/all_suggestions`}
          className='hover:bg-opacity-90 rounded px-2 py-1 text-palette_white bg-palette_blue flex space-x-1 items-center'
        >
          <span>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              height='16'
              width='16'
              viewBox='0 0 512 512'
              className='fill-palette_white'
            >
              <path d='M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z' />
            </svg>
          </span>
          <span>Suggestion</span>
        </Link>
      </div>
    </div>
  );
}

interface ContentEditorReviewModalProps {
  submittedContentEditorSuggestion: SubmittedContentEditorSuggestion;
  iMId: string;
}
function ContentEditorReviewModal({
  iMId,
  submittedContentEditorSuggestion,
}: ContentEditorReviewModalProps) {
  const contentEditorSuggestion = useContentEditorSuggestion({
    id: submittedContentEditorSuggestion.contentEditorSuggestionId,
  });
  const contentEditorReview = useContentEditorReview({
    id: contentEditorSuggestion?.contentEditorReviewId,
  });
  const cITLDirector = useCITLDirector({
    id: contentEditorReview?.cITLDirectorId,
  });
  const user = useUser({
    id: cITLDirector?.userId,
  });
  return (
    <div className='text-sm flex flex-col space-y-4'>
      {user && (
        <p>
          Reviewed by{" "}
          <Link
            href={`/admin/user/${user.id}`}
            className='text-palette_light_blue hover:underline'
          >
            {user.name}
          </Link>{" "}
          |{" "}
          <span className='text-palette_light_blue'>
            {DateTime.fromJSDate(
              new Date(submittedContentEditorSuggestion?.updatedAt ?? "")
            ).toFormat( "D | t")}
          </span>
          .
        </p>
      )}
      {!user && <p className='animate-pulse'>Loading...</p>}
      <div className='flex justify-start space-x-2'>
        <Link
          href={`/admin/im/${iMId}/all_reviews`}
          className='hover:bg-opacity-90 rounded px-2 py-1 text-palette_white bg-palette_blue flex space-x-1 items-center'
        >
          <span>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              height='16'
              width='16'
              viewBox='0 0 512 512'
              className='fill-palette_white'
            >
              <path d='M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z' />
            </svg>
          </span>
          <span>Evaluation</span>
        </Link>
        <Link
          href={`/admin/im/${iMId}/all_suggestions`}
          className='hover:bg-opacity-90 rounded px-2 py-1 text-palette_white bg-palette_blue flex space-x-1 items-center'
        >
          <span>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              height='16'
              width='16'
              viewBox='0 0 512 512'
              className='fill-palette_white'
            >
              <path d='M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z' />
            </svg>
          </span>
          <span>Suggestion</span>
        </Link>
      </div>
    </div>
  );
}

interface IMERCCITLRevisionModal {
  iMERCCITLRevision: IMERCCITLRevision;
  iMId: string;
}
function IMERCCITLRevisionModal({
  iMERCCITLRevision,
  iMId,
}: IMERCCITLRevisionModal) {
  const iM = useIM({ id: iMId });
  const faculty = useFaculty({
    id: iM?.facultyId,
  });
  const user = useUser({
    id: faculty?.userId,
  });

  return (
    <div className='text-sm'>
      {user && (
        <p>
          Revised by{" "}
          <Link
            href={`/admin/user/${user.id}`}
            className='text-palette_light_blue hover:underline'
          >
            {user.name}
          </Link>{" "}
          |{" "}
          <span className='text-palette_light_blue'>
            {DateTime.fromJSDate(
              new Date(iMERCCITLRevision?.updatedAt ?? "")
            ).toFormat( "D | t")}
          </span>
        </p>
      )}
      {!user && <p className='animate-pulse'>Loading...</p>}
    </div>
  );
}

interface IMERCIDDCoordinatorEndorsementModalProps {
  iMERCIDDCoordinatorEndorsement: IMERCIDDCoordinatorEndorsement;
}
function IMERCIDDCoordinatorEndorsementModal({
  iMERCIDDCoordinatorEndorsement,
}: IMERCIDDCoordinatorEndorsementModalProps) {
  const iDDCoordinator = useIDDCoordinator({
    id: iMERCIDDCoordinatorEndorsement.iDDCoordinatorId,
  });
  const user = useUser({
    id: iDDCoordinator?.userId,
  });

  return (
    <div className='text-sm'>
      {user && (
        <p>
          Endorsed by{" "}
          <Link
            href={`/admin/user/${user.id}`}
            className='text-palette_light_blue hover:underline'
          >
            {user.name}
          </Link>{" "}
          |{" "}
          <span className='text-palette_light_blue'>
            {DateTime.fromJSDate(
              new Date(iMERCIDDCoordinatorEndorsement?.updatedAt ?? "")
            ).toFormat( "D | t")}
          </span>
        </p>
      )}
      {!user && <p className='animate-pulse'>Loading...</p>}
    </div>
  );
}

interface IMERCCITLDirectorEndorsementModalProps {
  iMERCCITLDirectorEndorsement: IMERCCITLDirectorEndorsement;
}
function IMERCCITLDirectorEndorsementModal({
  iMERCCITLDirectorEndorsement,
}: IMERCCITLDirectorEndorsementModalProps) {

  const cITLDirector = useCITLDirector({
    id: iMERCCITLDirectorEndorsement.cITLDirectorId,
  });
  const user = useUser({
    id: cITLDirector?.userId,
  });
  return (
    <div className='text-sm'>
      {user && (
        <p>
          Endorsed by{" "}
          <Link
            href={`/admin/user/${user.id}`}
            className='text-palette_light_blue hover:underline'
          >
            {user.name}
          </Link>{" "}
          |{" "}
          <span className='text-palette_light_blue'>
            {DateTime.fromJSDate(
              new Date(iMERCCITLDirectorEndorsement?.updatedAt ?? "")
            ).toFormat( "D | t")}
          </span>
        </p>
      )}
      {!user && <p className='animate-pulse'>Loading...</p>}
    </div>
  );
}
