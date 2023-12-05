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
          ]
        }
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
            <DepartmentRevisionModal departmentRevision={departmentRevision} />
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
            <CITLRevisionModal cITLRevision={cITLRevision} />
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
            <QAMISRevisionModal qAMISRevision={qAMISRevision} />
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
          {state.openModal === "QAMIS Department Endorsement" &&
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
            <IMERCCITLRevisionModal iMERCCITLRevision={iMERCCITLRevision} />
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
        ).toRelative()}
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
  return (
    <div className='text-sm'>
      <p>
        Reviewed{" "}
        <span className='text-palette_light_blue'>
          {DateTime.fromJSDate(
            new Date(submittedPeerSuggestion?.updatedAt ?? "")
          ).toRelative()}
        </span>
      </p>
      <p>
        Click{" "}
        <Link
          href={`/admin/im/${iMId}/all_reviews`}
          className='hover:underline text-palette_light_blue'
        >
          here
        </Link>{" "}
        to view evaluation.
      </p>
      <p>
        Click{" "}
        <Link
          href={`/admin/im/${iMId}/all_suggestions`}
          className='hover:underline text-palette_light_blue'
        >
          here
        </Link>{" "}
        to view suggestion.
      </p>
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
  return (
    <div className='text-sm'>
      <p>
        Reviewed{" "}
        <span className='text-palette_light_blue'>
          {DateTime.fromJSDate(
            new Date(submittedChairpersonSuggestion?.updatedAt ?? "")
          ).toRelative()}
        </span>
      </p>
      <p>
        Click{" "}
        <Link
          href={`/admin/im/${iMId}/all_reviews`}
          className='hover:underline text-palette_light_blue'
        >
          here
        </Link>{" "}
        to view evaluation.
      </p>
      <p>
        Click{" "}
        <Link
          href={`/admin/im/${iMId}/all_suggestions`}
          className='hover:underline text-palette_light_blue'
        >
          here
        </Link>{" "}
        to view suggestion.
      </p>
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
  return (
    <div className='text-sm'>
      <p>
        Reviewed{" "}
        <span className='text-palette_light_blue'>
          {DateTime.fromJSDate(
            new Date(submittedCoordinatorSuggestion?.updatedAt ?? "")
          ).toRelative()}
        </span>
      </p>
      <p>
        Click{" "}
        <Link
          href={`/admin/im/${iMId}/all_reviews`}
          className='hover:underline text-palette_light_blue'
        >
          here
        </Link>{" "}
        to view evaluation.
      </p>
      <p>
        Click{" "}
        <Link
          href={`/admin/im/${iMId}/all_suggestions`}
          className='hover:underline text-palette_light_blue'
        >
          here
        </Link>{" "}
        to view suggestion.
      </p>
    </div>
  );
}

interface DepartmentRevisionModalProps {
  departmentRevision: DepartmentRevision;
}

function DepartmentRevisionModal({
  departmentRevision,
}: DepartmentRevisionModalProps) {
  return (
    <div className='text-sm'>
      <p>
        Revised{" "}
        <span className='text-palette_light_blue'>
          {DateTime.fromJSDate(
            new Date(departmentRevision?.updatedAt ?? "")
          ).toRelative()}
        </span>
      </p>
    </div>
  );
}

interface CoordinatorEndorsementModalProps {
  coordinatorEndorsement: CoordinatorEndorsement;
}

function CoordinatorEndorsementModal({
  coordinatorEndorsement,
}: CoordinatorEndorsementModalProps) {
  return (
    <div className='text-sm'>
      <p>
        Endorsed{" "}
        <span className='text-palette_light_blue'>
          {DateTime.fromJSDate(
            new Date(coordinatorEndorsement?.updatedAt ?? "")
          ).toRelative()}
        </span>
      </p>
    </div>
  );
}

interface DeanEndorsementModalProps {
  deanEndorsement: DeanEndorsement;
}

function DeanEndorsementModal({ deanEndorsement }: DeanEndorsementModalProps) {
  return (
    <div className='text-sm'>
      <p>
        Endorsed{" "}
        <span className='text-palette_light_blue'>
          {DateTime.fromJSDate(
            new Date(deanEndorsement?.updatedAt ?? "")
          ).toRelative()}
        </span>
      </p>
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
  return (
    <div className='text-sm'>
      <p>
        Reviewed{" "}
        <span className='text-palette_light_blue'>
          {DateTime.fromJSDate(
            new Date(submittedIDDCoordinatorSuggestion?.updatedAt ?? "")
          ).toRelative()}
        </span>
      </p>
      <p>
        Click{" "}
        <Link
          href={`/admin/im/${iMId}/all_reviews`}
          className='hover:underline text-palette_light_blue'
        >
          here
        </Link>{" "}
        to view evaluation.
      </p>
      <p>
        Click{" "}
        <Link
          href={`/admin/im/${iMId}/all_suggestions`}
          className='hover:underline text-palette_light_blue'
        >
          here
        </Link>{" "}
        to view suggestion.
      </p>
    </div>
  );
}

interface CITLRevisionModalProps {
  cITLRevision: CITLRevision;
}
function CITLRevisionModal({ cITLRevision }: CITLRevisionModalProps) {
  return (
    <div className='text-sm'>
      <p>
        Revised{" "}
        <span className='text-palette_light_blue'>
          {DateTime.fromJSDate(
            new Date(cITLRevision?.updatedAt ?? "")
          ).toRelative()}
        </span>
      </p>
    </div>
  );
}

interface IDDCoordinatorEndorsementModalProps {
  iDDCoordinatorEndorsement: IDDCoordinatorEndorsement;
}

function IDDCoordinatorEndorsementModal({
  iDDCoordinatorEndorsement,
}: IDDCoordinatorEndorsementModalProps) {
  return (
    <div className='text-sm'>
      <p>
        Endorsed{" "}
        <span className='text-palette_light_blue'>
          {DateTime.fromJSDate(
            new Date(iDDCoordinatorEndorsement?.updatedAt ?? "")
          ).toRelative()}
        </span>
      </p>
    </div>
  );
}

interface CITLDirectorEndorsementModalProps {
  cITLDirectorEndorsement: CITLDirectorEndorsement;
}

function CITLDirectorEndorsementModal({
  cITLDirectorEndorsement,
}: CITLDirectorEndorsementModalProps) {
  return (
    <div className='text-sm'>
      <p>
        Endorsed{" "}
        <span className='text-palette_light_blue'>
          {DateTime.fromJSDate(
            new Date(cITLDirectorEndorsement?.updatedAt ?? "")
          ).toRelative()}
        </span>
      </p>
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
}
function QAMISRevisionModal({ qAMISRevision }: QAMISRevisionModalProps) {
  return (
    <div className='text-sm'>
      <p>
        Revised{" "}
        <span className='text-palette_light_blue'>
          {DateTime.fromJSDate(
            new Date(qAMISRevision?.updatedAt ?? "")
          ).toRelative()}
        </span>
      </p>
    </div>
  );
}

interface QAMISChairpersonEndorsementModalProps {
  qAMISChairpersonEndorsement: QAMISChairpersonEndorsement;
}
function QAMISChairpersonEndorsementModal({
  qAMISChairpersonEndorsement,
}: QAMISChairpersonEndorsementModalProps) {
  return (
    <div className='text-sm'>
      <p>
        Endorsed{" "}
        <span className='text-palette_light_blue'>
          {DateTime.fromJSDate(
            new Date(qAMISChairpersonEndorsement?.updatedAt ?? "")
          ).toRelative()}
        </span>
      </p>
    </div>
  );
}

interface QAMISCoordinatorEndorsementModalProps {
  qAMISCoordinatorEndorsement: QAMISCoordinatorEndorsement;
}
function QAMISCoordinatorEndorsementModal({
  qAMISCoordinatorEndorsement,
}: QAMISCoordinatorEndorsementModalProps) {
  return (
    <div className='text-sm'>
      <p>
        Endorsed{" "}
        <span className='text-palette_light_blue'>
          {DateTime.fromJSDate(
            new Date(qAMISCoordinatorEndorsement?.updatedAt ?? "")
          ).toRelative()}
        </span>
      </p>
    </div>
  );
}

interface QAMISDeanEndorsementModalProps {
  qAMISDeanEndorsement: QAMISDeanEndorsement;
}
function QAMISDeanEndorsementModal({
  qAMISDeanEndorsement,
}: QAMISDeanEndorsementModalProps) {
  return (
    <div className='text-sm'>
      <p>
        Endorsed{" "}
        <span className='text-palette_light_blue'>
          {DateTime.fromJSDate(
            new Date(qAMISDeanEndorsement?.updatedAt ?? "")
          ).toRelative()}
        </span>
      </p>
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
          ).toRelative()}
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
  return (
    <div className='text-sm'>
      <p>
        Reviewed{" "}
        <span className='text-palette_light_blue'>
          {DateTime.fromJSDate(
            new Date(submittedContentSpecialistSuggestion?.updatedAt ?? "")
          ).toRelative()}
        </span>
      </p>
      <p>
        Click{" "}
        <Link
          href={`/admin/im/${iMId}/all_reviews`}
          className='hover:underline text-palette_light_blue'
        >
          here
        </Link>{" "}
        to view evaluation.
      </p>
      <p>
        Click{" "}
        <Link
          href={`/admin/im/${iMId}/all_suggestions`}
          className='hover:underline text-palette_light_blue'
        >
          here
        </Link>{" "}
        to view suggestion.
      </p>
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
  return (
    <div className='text-sm'>
      <p>
        Reviewed{" "}
        <span className='text-palette_light_blue'>
          {DateTime.fromJSDate(
            new Date(submittedIDDSpecialistSuggestion?.updatedAt ?? "")
          ).toRelative()}
        </span>
      </p>
      <p>
        Click{" "}
        <Link
          href={`/admin/im/${iMId}/all_reviews`}
          className='hover:underline text-palette_light_blue'
        >
          here
        </Link>{" "}
        to view evaluation.
      </p>
      <p>
        Click{" "}
        <Link
          href={`/admin/im/${iMId}/all_suggestions`}
          className='hover:underline text-palette_light_blue'
        >
          here
        </Link>{" "}
        to view suggestion.
      </p>
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
  return (
    <div className='text-sm'>
      <p>
        Reviewed{" "}
        <span className='text-palette_light_blue'>
          {DateTime.fromJSDate(
            new Date(submittedContentEditorSuggestion?.updatedAt ?? "")
          ).toRelative()}
        </span>
      </p>
      <p>
        Click{" "}
        <Link
          href={`/admin/im/${iMId}/all_reviews`}
          className='hover:underline text-palette_light_blue'
        >
          here
        </Link>{" "}
        to view evaluation.
      </p>
      <p>
        Click{" "}
        <Link
          href={`/admin/im/${iMId}/all_suggestions`}
          className='hover:underline text-palette_light_blue'
        >
          here
        </Link>{" "}
        to view suggestion.
      </p>
    </div>
  );
}

interface IMERCCITLRevisionModal {
  iMERCCITLRevision: IMERCCITLRevision;
}
function IMERCCITLRevisionModal({ iMERCCITLRevision }: IMERCCITLRevisionModal) {
  return (
    <div className='text-sm'>
      <p>
        Revised{" "}
        <span className='text-palette_light_blue'>
          {DateTime.fromJSDate(
            new Date(iMERCCITLRevision?.updatedAt ?? "")
          ).toRelative()}
        </span>
      </p>
    </div>
  );
}

interface IMERCIDDCoordinatorEndorsementModalProps {
  iMERCIDDCoordinatorEndorsement: IMERCIDDCoordinatorEndorsement;
}
function IMERCIDDCoordinatorEndorsementModal({
  iMERCIDDCoordinatorEndorsement,
}: IMERCIDDCoordinatorEndorsementModalProps) {
  return (
    <div className='text-sm'>
      <p>
        Endorsed{" "}
        <span className='text-palette_light_blue'>
          {DateTime.fromJSDate(
            new Date(iMERCIDDCoordinatorEndorsement?.updatedAt ?? "")
          ).toRelative()}
        </span>
      </p>
    </div>
  );
}

interface IMERCCITLDirectorEndorsementModalProps {
  iMERCCITLDirectorEndorsement: IMERCCITLDirectorEndorsement;
}
function IMERCCITLDirectorEndorsementModal({
  iMERCCITLDirectorEndorsement,
}: IMERCCITLDirectorEndorsementModalProps) {
  return (
    <div className='text-sm'>
      <p>
        Endorsed{" "}
        <span className='text-palette_light_blue'>
          {DateTime.fromJSDate(
            new Date(iMERCCITLDirectorEndorsement?.updatedAt ?? "")
          ).toRelative()}
        </span>
      </p>
    </div>
  );
}
