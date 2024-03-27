import AdminLayout from "@/components/AdminLayout";
import Confirmation from "@/components/Confirmation";
import Loading from "@/components/Loading";
import Modal from "@/components/Modal";
import { SnackbarContext } from "@/components/SnackbarProvider";
import useCITLDirector from "@/hooks/useCITLDirector";
import useCITLDirectorEndorsementIM from "@/hooks/useCITLDirectorEndorsementIM";
import useCITLRevisionIM from "@/hooks/useCITLRevisionIM";
import useChairperson from "@/hooks/useChairperson";
import useChairpersonReview from "@/hooks/useChairpersonReview";
import useChairpersonSuggestion from "@/hooks/useChairpersonSuggestion";
import useContentEditorReview from "@/hooks/useContentEditorReview";
import useContentEditorSuggestion from "@/hooks/useContentEditorSuggestion";
import useContentSpecialist from "@/hooks/useContentSpecialist";
import useContentSpecialistReview from "@/hooks/useContentSpecialistReview";
import useContentSpecialistSuggestion from "@/hooks/useContentSpecialistSuggestion";
import useCoordinator from "@/hooks/useCoordinator";
import useCoordinatorEndorsementIM from "@/hooks/useCoordinatorEndorsementIM";
import useCoordinatorReview from "@/hooks/useCoordinatorReview";
import useCoordinatorSuggestion from "@/hooks/useCoordinatorSuggestion";
import useDean from "@/hooks/useDean";
import useDeanEndorsementIM from "@/hooks/useDeanEndorsementIM";
import useDepartmentReviewIM from "@/hooks/useDepartmentReviewIM";
import useDepartmentReviewedIM from "@/hooks/useDepartmentReviewedIM";
import useDepartmentRevisionIM from "@/hooks/useDepartmentRevisionIM";
import useFaculty from "@/hooks/useFaculty";
import useIDDCoordinator from "@/hooks/useIDDCoordinator";
import useIDDCoordinatorEndorsementIM from "@/hooks/useIDDCoordinatorEndorsementIM";
import useIDDCoordinatorSuggestion from "@/hooks/useIDDCoordinatorSuggestion";
import useIDDSpecialistReview from "@/hooks/useIDDSpecialistReview";
import useIDDSpecialistSuggestion from "@/hooks/useIDDSpecialistSuggestion";
import useIM from "@/hooks/useIM";
import useIMERCCITLDirectorEndorsementIM from "@/hooks/useIMERCCITLDirectorEndorsementIM";
import useIMERCCITLReviewedIM from "@/hooks/useIMERCCITLReviewedIM";
import useIMERCCITLRevisionIM from "@/hooks/useIMERCCITLRevisionIM";
import useIMERCIDDCoordinatorEndorsementIM from "@/hooks/useIMERCIDDCoordinatorEndorsementIM";
import usePeerReview from "@/hooks/usePeerReview";
import usePeerSuggestion from "@/hooks/usePeerSuggestion";
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
import useUser from "@/hooks/useUser";
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
import axios from "axios";
import { DateTime } from "luxon";
import Error from "next/error";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useContext, useState } from "react";
import { Edge, Node } from "reactflow";

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
    id: iMId,
  });
  const departmentReviewed = useDepartmentReviewedIM({
    id: iMId,
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
  const qAMISDepartmentEndorsed = useQAMISDepartmentEndorsementByIM({
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

  const iMERCCITLReviewed = useIMERCCITLReviewedIM({
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
      id: "2_2-3_1",
      source: "2_2",
      target: "3",
    },
    {
      id: "2_2-3_2",
      source: "2_2",
      target: "3",
    },
    {
      id: "2_3-3_3",
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
        <Error statusCode={404} title="IM Not Found" />
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
      <div className="h-full w-full bg-palette_white p-4 rounded-2xl overflow-auto">
        <div className="h-full w-full overflow-auto">
          <TimelineSegment
            onView={(label: string) =>
              setState((prev) => ({ ...prev, openModal: label }))
            }
            label="Draft"
            mode={iM ? "success" : "pending"}
            secondaryLabel={
              iM
                ? DateTime.fromJSDate(new Date(iM.createdAt)).toFormat("D | t")
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
              onView={(label: string) =>
                setState((prev) => ({ ...prev, openModal: label }))
              }
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
              onView={(label: string) =>
                setState((prev) => ({ ...prev, openModal: label }))
              }
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
              onView={(label: string) =>
                setState((prev) => ({ ...prev, openModal: label }))
              }
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
            onView={(label: string) =>
              setState((prev) => ({ ...prev, openModal: label }))
            }
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
            onView={(label: string) =>
              setState((prev) => ({ ...prev, openModal: label }))
            }
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
            onView={(label: string) =>
              setState((prev) => ({ ...prev, openModal: label }))
            }
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
            onView={(label: string) =>
              setState((prev) => ({ ...prev, openModal: label }))
            }
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
            onView={(label: string) =>
              setState((prev) => ({ ...prev, openModal: label }))
            }
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
            onView={(label: string) =>
              setState((prev) => ({ ...prev, openModal: label }))
            }
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
            onView={(label: string) =>
              setState((prev) => ({ ...prev, openModal: label }))
            }
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
            onView={(label: string) =>
              setState((prev) => ({ ...prev, openModal: label }))
            }
            label="Try-out"
            mode={cITLDirectorEndorsement ? "success" : "pending"}
            secondaryLabel="IM will be utilized for 1 semester."
          />
          <TimelineSegment
            onView={(label: string) =>
              setState((prev) => ({ ...prev, openModal: label }))
            }
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
              onView={(label: string) =>
                setState((prev) => ({ ...prev, openModal: label }))
              }
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
              onView={(label: string) =>
                setState((prev) => ({ ...prev, openModal: label }))
              }
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
              onView={(label: string) =>
                setState((prev) => ({ ...prev, openModal: label }))
              }
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
              onView={(label: string) =>
                setState((prev) => ({ ...prev, openModal: label }))
              }
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
              onView={(label: string) =>
                setState((prev) => ({ ...prev, openModal: label }))
              }
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
              onView={(label: string) =>
                setState((prev) => ({ ...prev, openModal: label }))
              }
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
            onView={(label: string) =>
              setState((prev) => ({ ...prev, openModal: label }))
            }
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
            onView={(label: string) =>
              setState((prev) => ({ ...prev, openModal: label }))
            }
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
            onView={(label: string) =>
              setState((prev) => ({ ...prev, openModal: label }))
            }
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
                  submittedChairpersonSuggestion={
                    submittedChairpersonSuggestion
                  }
                />
              )}
            {state.openModal === "Coordinator Review" &&
              submittedCoordinatorSuggestion && (
                <CoordinatorReviewModal
                  iMId={iMId}
                  submittedCoordinatorSuggestion={
                    submittedCoordinatorSuggestion
                  }
                />
              )}

            {state.openModal === "Department Revision" &&
              departmentRevision && (
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
                  iMERCIDDCoordinatorEndorsement={
                    iMERCIDDCoordinatorEndorsement
                  }
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
      </div>
    </AdminLayout>
  );
}

interface TimelineSegmentProps {
  label: string;
  mode?: "success" | "pending";
  end?: boolean;
  children?: ReactNode;
  secondaryLabel?: string;
  onView?: (label: string) => any;
}
function TimelineSegment({
  label,
  mode = "pending",
  end = false,
  children,
  secondaryLabel,
  onView,
}: TimelineSegmentProps) {
  return (
    <div
      className={`${end ? "" : "border-l border-l-palette_light_grey"} ${
        children || end ? "" : "pb-10"
      } flex space-x-4 ml-5`}
    >
      <div
        className={`-ml-5 rounded-full w-10 h-10 flex items-center justify-center ${
          onView &&
          "hover:bg-opacity-50 active:bg-opacity-100 hover:cursor-pointer bg-palette_light_grey bg-opacity-70"
        }`}
        onClick={() => {
          if (onView) {
            onView(label);
          }
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`w-7 h-7 ${
            mode === "success" ? "bg-palette_timeline_green" : "bg-palette_grey"
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

interface DepartmentReviewModalProps {
  departmentReview: DepartmentReview;
}

function DepartmentReviewModal({
  departmentReview,
}: DepartmentReviewModalProps) {
  const [state, setState] = useState({
    openDeleteConfirmation: false,
  });
  const { addSnackbar } = useContext(SnackbarContext);
  const router = useRouter();

  async function deleteHandler() {
    return axios
      .delete(`/api/im_file/${departmentReview.iMFileId}`)
      .then((res) => {
        addSnackbar(
          "Submitted chairperson suggestion has been deleted successfully"
        );
      })
      .catch((error: any) => {
        addSnackbar(
          error?.response?.data?.error?.message ??
            "Failed to delete submitted chairperson suggestion",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  }

  return (
    <div>
      <p className="text-sm">
        Submitted for review{" "}
        <span className="text-palette_light_blue">
          {DateTime.fromJSDate(
            new Date(departmentReview?.updatedAt ?? "")
          ).toFormat("D | t")}
        </span>
      </p>
      <button
        className="rounded bg-palette_error text-palette_white px-1 hover:bg-opacity-90"
        onClick={() =>
          setState((prev) => ({ ...prev, openDeleteConfirmation: true }))
        }
      >
        Delete
      </button>
      {state.openDeleteConfirmation && (
        <Confirmation
          onClose={() =>
            setState((prev) => ({ ...prev, openDeleteConfirmation: false }))
          }
          onConfirm={deleteHandler}
        />
      )}
    </div>
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
  const [state, setState] = useState({
    openDeleteConfirmation: false,
  });
  const { addSnackbar } = useContext(SnackbarContext);
  const router = useRouter();

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

  async function deleteHandler() {
    return axios
      .delete(`/api/submitted_peer_suggestion/${submittedPeerSuggestion.id}`)
      .then((res) => {
        addSnackbar("Submitted peer suggestion has been deleted successfully");
      })
      .catch((error: any) => {
        addSnackbar(
          error?.response?.data?.error?.message ??
            "Failed to delete submitted peer suggestion",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  }

  return (
    <div className="text-sm flex flex-col space-y-4">
      {user && (
        <p>
          Reviewed by{" "}
          <Link
            href={`/admin/user/${user.id}`}
            className="text-palette_light_blue hover:underline"
          >
            {user.name}
          </Link>{" "}
          |{" "}
          <span className="text-palette_light_blue">
            {DateTime.fromJSDate(
              new Date(submittedPeerSuggestion?.updatedAt ?? "")
            ).toFormat("D | t")}
          </span>
          .
        </p>
      )}
      {!user && <p className="animate-pulse">Loading...</p>}
      <div className="flex justify-start space-x-2">
        <Link
          href={`/admin/im/${iMId}/all_reviews`}
          className="hover:bg-opacity-90 rounded px-2 py-1 text-palette_white bg-palette_blue flex space-x-1 items-center"
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16"
              width="16"
              viewBox="0 0 512 512"
              className="fill-palette_white w-3 h-3"
            >
              <path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z" />
            </svg>
          </span>
          <span>Evaluation</span>
        </Link>
        <Link
          href={`/admin/im/${iMId}/all_suggestions`}
          className="hover:bg-opacity-90 rounded px-2 py-1 text-palette_white bg-palette_blue flex space-x-1 items-center"
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16"
              width="16"
              viewBox="0 0 512 512"
              className="fill-palette_white w-3 h-3"
            >
              <path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z" />
            </svg>
          </span>
          <span>Suggestion</span>
        </Link>
        <button
          className="rounded bg-palette_error text-palette_white px-1 hover:bg-opacity-90"
          onClick={() =>
            setState((prev) => ({ ...prev, openDeleteConfirmation: true }))
          }
        >
          Delete
        </button>
      </div>
      {state.openDeleteConfirmation && (
        <Confirmation
          onClose={() =>
            setState((prev) => ({ ...prev, openDeleteConfirmation: false }))
          }
          onConfirm={deleteHandler}
        />
      )}
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
  const [state, setState] = useState({
    openDeleteConfirmation: false,
  });
  const { addSnackbar } = useContext(SnackbarContext);
  const router = useRouter();

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

  async function deleteHandler() {
    return axios
      .delete(
        `/api/submitted_chairperson_suggestion/${submittedChairpersonSuggestion.id}`
      )
      .then((res) => {
        addSnackbar(
          "Submitted chairperson suggestion has been deleted successfully"
        );
      })
      .catch((error: any) => {
        addSnackbar(
          error?.response?.data?.error?.message ??
            "Failed to delete submitted chairperson suggestion",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  }

  return (
    <div className="text-sm flex flex-col space-y-4">
      {user && (
        <p>
          Reviewed by{" "}
          <Link
            href={`/admin/user/${user.id}`}
            className="text-palette_light_blue hover:underline"
          >
            {user.name}
          </Link>{" "}
          |{" "}
          <span className="text-palette_light_blue">
            {DateTime.fromJSDate(
              new Date(submittedChairpersonSuggestion?.updatedAt ?? "")
            ).toFormat("D | t")}
          </span>
          .
        </p>
      )}
      {!user && <p className="animate-pulse">Loading...</p>}
      <div className="flex justify-start space-x-2">
        <Link
          href={`/admin/im/${iMId}/all_reviews`}
          className="hover:bg-opacity-90 rounded px-2 py-1 text-palette_white bg-palette_blue flex space-x-1 items-center"
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16"
              width="16"
              viewBox="0 0 512 512"
              className="fill-palette_white"
            >
              <path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z" />
            </svg>
          </span>
          <span>Evaluation</span>
        </Link>
        <Link
          href={`/admin/im/${iMId}/all_suggestions`}
          className="hover:bg-opacity-90 rounded px-2 py-1 text-palette_white bg-palette_blue flex space-x-1 items-center"
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16"
              width="16"
              viewBox="0 0 512 512"
              className="fill-palette_white"
            >
              <path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z" />
            </svg>
          </span>
          <span>Suggestion</span>
        </Link>
        <button
          className="rounded bg-palette_error text-palette_white px-1 hover:bg-opacity-90"
          onClick={() =>
            setState((prev) => ({ ...prev, openDeleteConfirmation: true }))
          }
        >
          Delete
        </button>
      </div>
      {state.openDeleteConfirmation && (
        <Confirmation
          onClose={() =>
            setState((prev) => ({ ...prev, openDeleteConfirmation: false }))
          }
          onConfirm={deleteHandler}
        />
      )}
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
  const [state, setState] = useState({
    openDeleteConfirmation: false,
  });
  const { addSnackbar } = useContext(SnackbarContext);
  const router = useRouter();

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

  async function deleteHandler() {
    return axios
      .delete(
        `/api/submitted_coordinator_suggestion/${submittedCoordinatorSuggestion.id}`
      )
      .then((res) => {
        addSnackbar(
          "Submitted coordinator suggestion has been deleted successfully"
        );
      })
      .catch((error: any) => {
        addSnackbar(
          error?.response?.data?.error?.message ??
            "Failed to delete submitted coordinator suggestion",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  }

  return (
    <div className="text-sm flex flex-col space-y-4">
      {user && (
        <p>
          Reviewed by{" "}
          <Link
            href={`/admin/user/${user.id}`}
            className="text-palette_light_blue hover:underline"
          >
            {user.name}
          </Link>{" "}
          |{" "}
          <span className="text-palette_light_blue">
            {DateTime.fromJSDate(
              new Date(submittedCoordinatorSuggestion?.updatedAt ?? "")
            ).toFormat("D | t")}
          </span>
          .
        </p>
      )}
      {!user && <p className="animate-pulse">Loading...</p>}
      <div className="flex justify-start space-x-2">
        <Link
          href={`/admin/im/${iMId}/all_reviews`}
          className="hover:bg-opacity-90 rounded px-2 py-1 text-palette_white bg-palette_blue flex space-x-1 items-center"
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16"
              width="16"
              viewBox="0 0 512 512"
              className="fill-palette_white"
            >
              <path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z" />
            </svg>
          </span>
          <span>Evaluation</span>
        </Link>
        <Link
          href={`/admin/im/${iMId}/all_suggestions`}
          className="hover:bg-opacity-90 rounded px-2 py-1 text-palette_white bg-palette_blue flex space-x-1 items-center"
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16"
              width="16"
              viewBox="0 0 512 512"
              className="fill-palette_white"
            >
              <path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z" />
            </svg>
          </span>
          <span>Suggestion</span>
        </Link>
        <button
          className="rounded bg-palette_error text-palette_white px-1 hover:bg-opacity-90"
          onClick={() =>
            setState((prev) => ({ ...prev, openDeleteConfirmation: true }))
          }
        >
          Delete
        </button>
      </div>
      {state.openDeleteConfirmation && (
        <Confirmation
          onClose={() =>
            setState((prev) => ({ ...prev, openDeleteConfirmation: false }))
          }
          onConfirm={deleteHandler}
        />
      )}
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
  const [state, setState] = useState({
    openDeleteConfirmation: false,
  });
  const { addSnackbar } = useContext(SnackbarContext);
  const router = useRouter();

  const iM = useIM({
    id: iMId,
  });
  const faculty = useFaculty({ id: iM?.facultyId });
  const user = useUser({
    id: faculty?.userId,
  });

  async function deleteHandler() {
    return axios
      .delete(`/api/im_file/${departmentRevision.iMFileId}`)
      .then((res) => {
        addSnackbar("Department revision has been deleted successfully");
      })
      .catch((error: any) => {
        addSnackbar(
          error?.response?.data?.error?.message ??
            "Failed to delete department revision",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  }

  return (
    <div className="text-sm">
      {user && (
        <p>
          Revised by{" "}
          <Link
            href={`/admin/user/${user.id}`}
            className="text-palette_light_blue hover:underline"
          >
            {user.name}
          </Link>{" "}
          |{" "}
          <span className="text-palette_light_blue">
            {DateTime.fromJSDate(
              new Date(departmentRevision?.updatedAt ?? "")
            ).toFormat("D | t")}
          </span>
        </p>
      )}
      {!user && <p className="animate-pulse">Loading...</p>}
      <button
        className="rounded bg-palette_error text-palette_white px-1 hover:bg-opacity-90"
        onClick={() =>
          setState((prev) => ({ ...prev, openDeleteConfirmation: true }))
        }
      >
        Delete
      </button>
      {state.openDeleteConfirmation && (
        <Confirmation
          onClose={() =>
            setState((prev) => ({ ...prev, openDeleteConfirmation: false }))
          }
          onConfirm={deleteHandler}
        />
      )}
    </div>
  );
}

interface CoordinatorEndorsementModalProps {
  coordinatorEndorsement: CoordinatorEndorsement;
}

function CoordinatorEndorsementModal({
  coordinatorEndorsement,
}: CoordinatorEndorsementModalProps) {
  const [state, setState] = useState({
    openDeleteConfirmation: false,
  });
  const { addSnackbar } = useContext(SnackbarContext);
  const router = useRouter();

  const coordinator = useCoordinator({
    id: coordinatorEndorsement.coordinatorId,
  });
  const faculty = useFaculty({ id: coordinator?.facultyId });
  const user = useUser({
    id: faculty?.userId,
  });

  async function deleteHandler() {
    return axios
      .delete(`/api/coordinator_endorsement/${coordinatorEndorsement.id}`)
      .then((res) => {
        addSnackbar("Coordinator endorsement has been deleted successfully");
      })
      .catch((error: any) => {
        addSnackbar(
          error?.response?.data?.error?.message ??
            "Failed to delete coordinator endorsement",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  }

  return (
    <div className="text-sm">
      {user && (
        <p>
          Endorsed by{" "}
          <Link
            href={`/admin/user/${user.id}`}
            className="text-palette_light_blue hover:underline"
          >
            {user.name}
          </Link>{" "}
          |{" "}
          <span className="text-palette_light_blue">
            {DateTime.fromJSDate(
              new Date(coordinatorEndorsement?.updatedAt ?? "")
            ).toFormat("D | t")}
          </span>
        </p>
      )}
      {!user && <p className="animate-pulse">Loading...</p>}
      <button
        className="rounded bg-palette_error text-palette_white px-1 hover:bg-opacity-90"
        onClick={() =>
          setState((prev) => ({ ...prev, openDeleteConfirmation: true }))
        }
      >
        Delete
      </button>
      {state.openDeleteConfirmation && (
        <Confirmation
          onClose={() =>
            setState((prev) => ({ ...prev, openDeleteConfirmation: false }))
          }
          onConfirm={deleteHandler}
        />
      )}
    </div>
  );
}

interface DeanEndorsementModalProps {
  deanEndorsement: DeanEndorsement;
}

function DeanEndorsementModal({ deanEndorsement }: DeanEndorsementModalProps) {
  const [state, setState] = useState({
    openDeleteConfirmation: false,
  });
  const { addSnackbar } = useContext(SnackbarContext);
  const router = useRouter();

  const dean = useDean({ id: deanEndorsement.deanId });
  const faculty = useFaculty({ id: dean?.facultyId });
  const user = useUser({ id: faculty?.userId });

  async function deleteHandler() {
    return axios
      .delete(`/api/dean_endorsement/${deanEndorsement.id}`)
      .then((res) => {
        addSnackbar("Dean endorsement has been deleted successfully");
      })
      .catch((error: any) => {
        addSnackbar(
          error?.response?.data?.error?.message ??
            "Failed to delete dean endorsement",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  }

  return (
    <div className="text-sm">
      {user && (
        <p>
          Endorsed by{" "}
          <Link
            href={`/admin/user/${user.id}`}
            className="text-palette_light_blue hover:underline"
          >
            {user.name}
          </Link>{" "}
          |{" "}
          <span className="text-palette_light_blue">
            {DateTime.fromJSDate(
              new Date(deanEndorsement?.updatedAt ?? "")
            ).toFormat("D | t")}
          </span>
        </p>
      )}
      {!user && <p className="animate-pulse">Loading...</p>}
      <button
        className="rounded bg-palette_error text-palette_white px-1 hover:bg-opacity-90"
        onClick={() =>
          setState((prev) => ({ ...prev, openDeleteConfirmation: true }))
        }
      >
        Delete
      </button>
      {state.openDeleteConfirmation && (
        <Confirmation
          onClose={() =>
            setState((prev) => ({ ...prev, openDeleteConfirmation: false }))
          }
          onConfirm={deleteHandler}
        />
      )}
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
  const [state, setState] = useState({
    openDeleteConfirmation: false,
  });
  const { addSnackbar } = useContext(SnackbarContext);
  const router = useRouter();

  const iDDCoordinatorSuggestion = useIDDCoordinatorSuggestion({
    id: submittedIDDCoordinatorSuggestion.iDDCoordinatorSuggestionId,
  });
  const iDDCoordinator = useIDDCoordinator({
    id: iDDCoordinatorSuggestion?.iDDCoordinatorId,
  });
  const user = useUser({
    id: iDDCoordinator?.userId,
  });

  async function deleteHandler() {
    return axios
      .delete(
        `/api/submitted_idd_coordinator_suggestion/${submittedIDDCoordinatorSuggestion.id}`
      )
      .then((res) => {
        addSnackbar(
          "Submitted IDD coordinator suggestion has been deleted successfully"
        );
      })
      .catch((error: any) => {
        addSnackbar(
          error?.response?.data?.error?.message ??
            "Failed to delete submitted IDD coordinator suggestion",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  }

  return (
    <div className="text-sm space-y-4">
      {user && (
        <p>
          Reviewed by{" "}
          <Link
            href={`/admin/user/${user.id}`}
            className="text-palette_light_blue hover:underline"
          >
            {user.name}
          </Link>{" "}
          |{" "}
          <span className="text-palette_light_blue">
            {DateTime.fromJSDate(
              new Date(submittedIDDCoordinatorSuggestion?.updatedAt ?? "")
            ).toFormat("D | t")}
          </span>
        </p>
      )}
      {!user && <p className="animate-pulse">Loading...</p>}
      <div className="flex justify-start space-x-2">
        <Link
          href={`/admin/im/${iMId}/all_suggestions`}
          className="hover:bg-opacity-90 rounded px-2 py-1 text-palette_white bg-palette_blue flex space-x-1 items-center"
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16"
              width="16"
              viewBox="0 0 512 512"
              className="fill-palette_white w-3 h-3"
            >
              <path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z" />
            </svg>
          </span>
          <span>Suggestion</span>
        </Link>
        <button
          className="rounded bg-palette_error text-palette_white px-1 hover:bg-opacity-90"
          onClick={() =>
            setState((prev) => ({ ...prev, openDeleteConfirmation: true }))
          }
        >
          Delete
        </button>
      </div>
      {state.openDeleteConfirmation && (
        <Confirmation
          onClose={() =>
            setState((prev) => ({ ...prev, openDeleteConfirmation: false }))
          }
          onConfirm={deleteHandler}
        />
      )}
    </div>
  );
}

interface CITLRevisionModalProps {
  cITLRevision: CITLRevision;
  iMId: string;
}
function CITLRevisionModal({ cITLRevision, iMId }: CITLRevisionModalProps) {
  const [state, setState] = useState({
    openDeleteConfirmation: false,
  });
  const { addSnackbar } = useContext(SnackbarContext);
  const router = useRouter();

  const iM = useIM({ id: iMId });
  const faculty = useFaculty({
    id: iM?.facultyId,
  });
  const user = useUser({
    id: faculty?.userId,
  });

  async function deleteHandler() {
    return axios
      .delete(`/api/im_file/${cITLRevision.iMFileId}`)
      .then((res) => {
        addSnackbar("CITL revision has been deleted successfully");
      })
      .catch((error: any) => {
        addSnackbar(
          error?.response?.data?.error?.message ??
            "Failed to delete CITL revision",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  }

  return (
    <div className="text-sm">
      {user && (
        <p>
          Revised by{" "}
          <Link
            href={`/admin/user/${user.id}`}
            className="text-palette_light_blue hover:underline"
          >
            {user.name}
          </Link>{" "}
          |{" "}
          <span className="text-palette_light_blue">
            {DateTime.fromJSDate(
              new Date(cITLRevision?.updatedAt ?? "")
            ).toFormat("D | t")}
          </span>
          .
        </p>
      )}
      {!user && <p className="animate-pulse">Loading...</p>}
      <button
        className="rounded bg-palette_error text-palette_white px-1 hover:bg-opacity-90"
        onClick={() =>
          setState((prev) => ({ ...prev, openDeleteConfirmation: true }))
        }
      >
        Delete
      </button>
      {state.openDeleteConfirmation && (
        <Confirmation
          onClose={() =>
            setState((prev) => ({ ...prev, openDeleteConfirmation: false }))
          }
          onConfirm={deleteHandler}
        />
      )}
    </div>
  );
}

interface IDDCoordinatorEndorsementModalProps {
  iDDCoordinatorEndorsement: IDDCoordinatorEndorsement;
}

function IDDCoordinatorEndorsementModal({
  iDDCoordinatorEndorsement,
}: IDDCoordinatorEndorsementModalProps) {
  const [state, setState] = useState({
    openDeleteConfirmation: false,
  });
  const { addSnackbar } = useContext(SnackbarContext);
  const router = useRouter();

  const iDDCoordinator = useIDDCoordinator({
    id: iDDCoordinatorEndorsement.iDDCoordinatorId,
  });
  const user = useUser({ id: iDDCoordinator?.userId });

  async function deleteHandler() {
    return axios
      .delete(
        `/api/idd_coordinator_endorsement/${iDDCoordinatorEndorsement.id}`
      )
      .then((res) => {
        addSnackbar(
          "IDD coordinator endorsement has been deleted successfully"
        );
      })
      .catch((error: any) => {
        addSnackbar(
          error?.response?.data?.error?.message ??
            "Failed to delete IDD coordinator endorsement",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  }

  return (
    <div className="text-sm">
      {user && (
        <p>
          Endorsed by{" "}
          <Link
            href={`/admin/user/${user.id}`}
            className="text-palette_light_blue hover:underline"
          >
            {user.name}
          </Link>{" "}
          |{" "}
          <span className="text-palette_light_blue">
            {DateTime.fromJSDate(
              new Date(iDDCoordinatorEndorsement?.updatedAt ?? "")
            ).toFormat("D | t")}
          </span>
        </p>
      )}
      {!user && <p className="animate-pulse">Loading...</p>}
      <button
        className="rounded bg-palette_error text-palette_white px-1 hover:bg-opacity-90"
        onClick={() =>
          setState((prev) => ({ ...prev, openDeleteConfirmation: true }))
        }
      >
        Delete
      </button>
      {state.openDeleteConfirmation && (
        <Confirmation
          onClose={() =>
            setState((prev) => ({ ...prev, openDeleteConfirmation: false }))
          }
          onConfirm={deleteHandler}
        />
      )}
    </div>
  );
}

interface CITLDirectorEndorsementModalProps {
  cITLDirectorEndorsement: CITLDirectorEndorsement;
}

function CITLDirectorEndorsementModal({
  cITLDirectorEndorsement,
}: CITLDirectorEndorsementModalProps) {
  const [state, setState] = useState({
    openDeleteConfirmation: false,
  });
  const { addSnackbar } = useContext(SnackbarContext);
  const router = useRouter();

  const cITLDirector = useCITLDirector({
    id: cITLDirectorEndorsement.cITLDirectorId,
  });
  const user = useUser({
    id: cITLDirector?.userId,
  });

  async function deleteHandler() {
    return axios
      .delete(`/api/citl_director_endorsement/${cITLDirectorEndorsement.id}`)
      .then((res) => {
        addSnackbar("CITL director endorsement has been deleted successfully");
      })
      .catch((error: any) => {
        addSnackbar(
          error?.response?.data?.error?.message ??
            "Failed to delete CITL director endorsement",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  }

  return (
    <div className="text-sm">
      {user && (
        <p>
          Endorsed by{" "}
          <Link
            href={`/admin/user/${user.id}`}
            className="text-palette_light_blue hover:underline"
          >
            {user.name}
          </Link>{" "}
          |{" "}
          <span className="text-palette_light_blue">
            {DateTime.fromJSDate(
              new Date(cITLDirectorEndorsement?.updatedAt ?? "")
            ).toFormat("D | t")}
          </span>
        </p>
      )}
      {!user && <p className="animate-pulse">Loading...</p>}
      <button
        className="rounded bg-palette_error text-palette_white px-1 hover:bg-opacity-90"
        onClick={() =>
          setState((prev) => ({ ...prev, openDeleteConfirmation: true }))
        }
      >
        Delete
      </button>
      {state.openDeleteConfirmation && (
        <Confirmation
          onClose={() =>
            setState((prev) => ({ ...prev, openDeleteConfirmation: false }))
          }
          onConfirm={deleteHandler}
        />
      )}
    </div>
  );
}

interface TryOutModalProps {
  cITLDirectorEndorsement: CITLDirectorEndorsement;
}
function TryOutModal({ cITLDirectorEndorsement }: TryOutModalProps) {
  return (
    <div className="text-sm">
      <p>
        On try-out until{" "}
        <span className="text-palette_light_blue">
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
  const [state, setState] = useState({
    openDeleteConfirmation: false,
  });
  const { addSnackbar } = useContext(SnackbarContext);
  const router = useRouter();

  const iM = useIM({ id: iMId });
  const faculty = useFaculty({
    id: iM?.facultyId,
  });
  const user = useUser({ id: faculty?.userId });

  async function deleteHandler() {
    return axios
      .delete(
        `/api/submitted_qamis_suggestion/${qAMISRevision.submittedQAMISSuggestionId}`
      )
      .then((res) => {
        addSnackbar("QAMIS revision has been deleted successfully");
      })
      .catch((error: any) => {
        addSnackbar(
          error?.response?.data?.error?.message ??
            "Failed to delete QAMIS revision",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  }

  return (
    <div className="text-sm">
      {user && (
        <p>
          Revised by{" "}
          <Link
            href={`/admin/user/${user.id}`}
            className="text-palette_light_blue hover:underline"
          >
            {user.name}
          </Link>{" "}
          |{" "}
          <span className="text-palette_light_blue">
            {DateTime.fromJSDate(
              new Date(qAMISRevision?.updatedAt ?? "")
            ).toFormat("D | t")}
          </span>
          .
        </p>
      )}
      {!user && <p className="animate-pulse">Loading...</p>}
      <button
        className="rounded bg-palette_error text-palette_white px-1 hover:bg-opacity-90"
        onClick={() =>
          setState((prev) => ({ ...prev, openDeleteConfirmation: true }))
        }
      >
        Delete
      </button>
      {state.openDeleteConfirmation && (
        <Confirmation
          onClose={() =>
            setState((prev) => ({ ...prev, openDeleteConfirmation: false }))
          }
          onConfirm={deleteHandler}
        />
      )}
    </div>
  );
}

interface QAMISChairpersonEndorsementModalProps {
  qAMISChairpersonEndorsement: QAMISChairpersonEndorsement;
}
function QAMISChairpersonEndorsementModal({
  qAMISChairpersonEndorsement,
}: QAMISChairpersonEndorsementModalProps) {
  const [state, setState] = useState({
    openDeleteConfirmation: false,
  });
  const { addSnackbar } = useContext(SnackbarContext);
  const router = useRouter();

  const chairperson = useChairperson({
    id: qAMISChairpersonEndorsement.chairpersonId,
  });
  const faculty = useFaculty({ id: chairperson?.facultyId });
  const user = useUser({ id: faculty?.userId });

  async function deleteHandler() {
    return axios
      .delete(
        `/api/qamis_chairperson_endorsement/${qAMISChairpersonEndorsement.id}`
      )
      .then((res) => {
        addSnackbar(
          "QAMIS chairperson endorsement has been deleted successfully"
        );
      })
      .catch((error: any) => {
        addSnackbar(
          error?.response?.data?.error?.message ??
            "Failed to delete QAMIS chairperson endorsement",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  }

  return (
    <div className="text-sm">
      {user && (
        <p>
          Revised by{" "}
          <Link
            href={`/admin/user/${user.id}`}
            className="text-palette_light_blue hover:underline"
          >
            {user.name}
          </Link>{" "}
          |{" "}
          <span className="text-palette_light_blue">
            {DateTime.fromJSDate(
              new Date(qAMISChairpersonEndorsement?.updatedAt ?? "")
            ).toFormat("D | t")}
          </span>
          .
        </p>
      )}
      {!user && <p className="animate-pulse">Loading...</p>}
      <button
        className="rounded bg-palette_error text-palette_white px-1 hover:bg-opacity-90"
        onClick={() =>
          setState((prev) => ({ ...prev, openDeleteConfirmation: true }))
        }
      >
        Delete
      </button>
      {state.openDeleteConfirmation && (
        <Confirmation
          onClose={() =>
            setState((prev) => ({ ...prev, openDeleteConfirmation: false }))
          }
          onConfirm={deleteHandler}
        />
      )}
    </div>
  );
}

interface QAMISCoordinatorEndorsementModalProps {
  qAMISCoordinatorEndorsement: QAMISCoordinatorEndorsement;
}
function QAMISCoordinatorEndorsementModal({
  qAMISCoordinatorEndorsement,
}: QAMISCoordinatorEndorsementModalProps) {
  const [state, setState] = useState({
    openDeleteConfirmation: false,
  });
  const { addSnackbar } = useContext(SnackbarContext);
  const router = useRouter();

  const coordinator = useCoordinator({
    id: qAMISCoordinatorEndorsement.coordinatorId,
  });
  const faculty = useFaculty({ id: coordinator?.facultyId });
  const user = useUser({ id: faculty?.userId });

  async function deleteHandler() {
    return axios
      .delete(
        `/api/qamis_coordinator_endorsement/${qAMISCoordinatorEndorsement.id}`
      )
      .then((res) => {
        addSnackbar(
          "QAMIS coordinator endorsement has been deleted successfully"
        );
      })
      .catch((error: any) => {
        addSnackbar(
          error?.response?.data?.error?.message ??
            "Failed to delete QAMIS coordinator endorsement",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  }

  return (
    <div className="text-sm">
      {user && (
        <p>
          Revised by{" "}
          <Link
            href={`/admin/user/${user.id}`}
            className="text-palette_light_blue hover:underline"
          >
            {user.name}
          </Link>{" "}
          |{" "}
          <span className="text-palette_light_blue">
            {DateTime.fromJSDate(
              new Date(qAMISCoordinatorEndorsement?.updatedAt ?? "")
            ).toFormat("D | t")}
          </span>
          .
        </p>
      )}
      {!user && <p className="animate-pulse">Loading...</p>}
      <button
        className="rounded bg-palette_error text-palette_white px-1 hover:bg-opacity-90"
        onClick={() =>
          setState((prev) => ({ ...prev, openDeleteConfirmation: true }))
        }
      >
        Delete
      </button>
      {state.openDeleteConfirmation && (
        <Confirmation
          onClose={() =>
            setState((prev) => ({ ...prev, openDeleteConfirmation: false }))
          }
          onConfirm={deleteHandler}
        />
      )}
    </div>
  );
}

interface QAMISDeanEndorsementModalProps {
  qAMISDeanEndorsement: QAMISDeanEndorsement;
}
function QAMISDeanEndorsementModal({
  qAMISDeanEndorsement,
}: QAMISDeanEndorsementModalProps) {
  const [state, setState] = useState({
    openDeleteConfirmation: false,
  });
  const { addSnackbar } = useContext(SnackbarContext);
  const router = useRouter();

  const dean = useDean({
    id: qAMISDeanEndorsement.deanId,
  });
  const faculty = useFaculty({ id: dean?.facultyId });
  const user = useUser({ id: faculty?.userId });

  async function deleteHandler() {
    return axios
      .delete(`/api/qamis_dean_endorsement/${qAMISDeanEndorsement.id}`)
      .then((res) => {
        addSnackbar("QAMIS dean endorsement has been deleted successfully");
      })
      .catch((error: any) => {
        addSnackbar(
          error?.response?.data?.error?.message ??
            "Failed to delete QAMIS dean endorsement",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  }

  return (
    <div className="text-sm">
      {user && (
        <p>
          Revised by{" "}
          <Link
            href={`/admin/user/${user.id}`}
            className="text-palette_light_blue hover:underline"
          >
            {user.name}
          </Link>{" "}
          |{" "}
          <span className="text-palette_light_blue">
            {DateTime.fromJSDate(
              new Date(qAMISDeanEndorsement?.updatedAt ?? "")
            ).toFormat("D | t")}
          </span>
          .
        </p>
      )}
      {!user && <p className="animate-pulse">Loading...</p>}
      <button
        className="rounded bg-palette_error text-palette_white px-1 hover:bg-opacity-90"
        onClick={() =>
          setState((prev) => ({ ...prev, openDeleteConfirmation: true }))
        }
      >
        Delete
      </button>
      {state.openDeleteConfirmation && (
        <Confirmation
          onClose={() =>
            setState((prev) => ({ ...prev, openDeleteConfirmation: false }))
          }
          onConfirm={deleteHandler}
        />
      )}
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
    <div className="text-sm">
      <p>
        Endorsed{" "}
        <span className="text-palette_light_blue">
          {DateTime.fromJSDate(
            new Date(qAMISDepartmentEndorsement?.updatedAt ?? "")
          ).toFormat("D | t")}
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
  const [state, setState] = useState({
    openDeleteConfirmation: false,
  });
  const { addSnackbar } = useContext(SnackbarContext);
  const router = useRouter();

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

  async function deleteHandler() {
    return axios
      .delete(
        `/api/submitted_content_specialist_suggestion/${submittedContentSpecialistSuggestion.id}`
      )
      .then((res) => {
        addSnackbar(
          "submitted content specialist has been deleted successfully"
        );
      })
      .catch((error: any) => {
        addSnackbar(
          error?.response?.data?.error?.message ??
            "Failed to delete submitted content specialist",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  }

  return (
    <div className="text-sm flex flex-col space-y-4">
      {user && (
        <p>
          Reviewed by{" "}
          <Link
            href={`/admin/user/${user.id}`}
            className="text-palette_light_blue hover:underline"
          >
            {user.name}
          </Link>{" "}
          |{" "}
          <span className="text-palette_light_blue">
            {DateTime.fromJSDate(
              new Date(submittedContentSpecialistSuggestion?.updatedAt ?? "")
            ).toFormat("D | t")}
          </span>
          .
        </p>
      )}
      {!user && <p className="animate-pulse">Loading...</p>}
      <div className="flex justify-start space-x-2">
        <Link
          href={`/admin/im/${iMId}/all_reviews`}
          className="hover:bg-opacity-90 rounded px-2 py-1 text-palette_white bg-palette_blue flex space-x-1 items-center"
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16"
              width="16"
              viewBox="0 0 512 512"
              className="fill-palette_white"
            >
              <path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z" />
            </svg>
          </span>
          <span>Evaluation</span>
        </Link>
        <Link
          href={`/admin/im/${iMId}/all_suggestions`}
          className="hover:bg-opacity-90 rounded px-2 py-1 text-palette_white bg-palette_blue flex space-x-1 items-center"
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16"
              width="16"
              viewBox="0 0 512 512"
              className="fill-palette_white"
            >
              <path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z" />
            </svg>
          </span>
          <span>Suggestion</span>
        </Link>
        <button
          className="rounded bg-palette_error text-palette_white px-1 hover:bg-opacity-90"
          onClick={() =>
            setState((prev) => ({ ...prev, openDeleteConfirmation: true }))
          }
        >
          Delete
        </button>
      </div>
      {state.openDeleteConfirmation && (
        <Confirmation
          onClose={() =>
            setState((prev) => ({ ...prev, openDeleteConfirmation: false }))
          }
          onConfirm={deleteHandler}
        />
      )}
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
  const [state, setState] = useState({
    openDeleteConfirmation: false,
  });
  const { addSnackbar } = useContext(SnackbarContext);
  const router = useRouter();

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

  async function deleteHandler() {
    return axios
      .delete(
        `/api/submitted_idd_specialist_suggestion/${submittedIDDSpecialistSuggestion.id}`
      )
      .then((res) => {
        addSnackbar("submitted content editor has been deleted successfully");
      })
      .catch((error: any) => {
        addSnackbar(
          error?.response?.data?.error?.message ??
            "Failed to delete submitted content editor",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  }

  return (
    <div className="text-sm flex flex-col space-y-4">
      {user && (
        <p>
          Reviewed by{" "}
          <Link
            href={`/admin/user/${user.id}`}
            className="text-palette_light_blue hover:underline"
          >
            {user.name}
          </Link>{" "}
          |{" "}
          <span className="text-palette_light_blue">
            {DateTime.fromJSDate(
              new Date(submittedIDDSpecialistSuggestion?.updatedAt ?? "")
            ).toFormat("D | t")}
          </span>
          .
        </p>
      )}
      {!user && <p className="animate-pulse">Loading...</p>}
      <div className="flex justify-start space-x-2">
        <Link
          href={`/admin/im/${iMId}/all_reviews`}
          className="hover:bg-opacity-90 rounded px-2 py-1 text-palette_white bg-palette_blue flex space-x-1 items-center"
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16"
              width="16"
              viewBox="0 0 512 512"
              className="fill-palette_white"
            >
              <path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z" />
            </svg>
          </span>
          <span>Evaluation</span>
        </Link>
        <Link
          href={`/admin/im/${iMId}/all_suggestions`}
          className="hover:bg-opacity-90 rounded px-2 py-1 text-palette_white bg-palette_blue flex space-x-1 items-center"
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16"
              width="16"
              viewBox="0 0 512 512"
              className="fill-palette_white"
            >
              <path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z" />
            </svg>
          </span>
          <span>Suggestion</span>
        </Link>
        <button
          className="rounded bg-palette_error text-palette_white px-1 hover:bg-opacity-90"
          onClick={() =>
            setState((prev) => ({ ...prev, openDeleteConfirmation: true }))
          }
        >
          Delete
        </button>
      </div>
      {state.openDeleteConfirmation && (
        <Confirmation
          onClose={() =>
            setState((prev) => ({ ...prev, openDeleteConfirmation: false }))
          }
          onConfirm={deleteHandler}
        />
      )}
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
  const [state, setState] = useState({
    openDeleteConfirmation: false,
  });
  const { addSnackbar } = useContext(SnackbarContext);
  const router = useRouter();

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

  async function deleteHandler() {
    return axios
      .delete(
        `/api/submitted_content_editor_suggestion/${submittedContentEditorSuggestion.id}`
      )
      .then((res) => {
        addSnackbar("submitted content editor has been deleted successfully");
      })
      .catch((error: any) => {
        addSnackbar(
          error?.response?.data?.error?.message ??
            "Failed to delete submitted content editor",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  }

  return (
    <div className="text-sm flex flex-col space-y-4">
      {user && (
        <p>
          Reviewed by{" "}
          <Link
            href={`/admin/user/${user.id}`}
            className="text-palette_light_blue hover:underline"
          >
            {user.name}
          </Link>{" "}
          |{" "}
          <span className="text-palette_light_blue">
            {DateTime.fromJSDate(
              new Date(submittedContentEditorSuggestion?.updatedAt ?? "")
            ).toFormat("D | t")}
          </span>
          .
        </p>
      )}
      {!user && <p className="animate-pulse">Loading...</p>}
      <div className="flex justify-start space-x-2">
        <Link
          href={`/admin/im/${iMId}/all_reviews`}
          className="hover:bg-opacity-90 rounded px-2 py-1 text-palette_white bg-palette_blue flex space-x-1 items-center"
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16"
              width="16"
              viewBox="0 0 512 512"
              className="fill-palette_white"
            >
              <path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z" />
            </svg>
          </span>
          <span>Evaluation</span>
        </Link>
        <Link
          href={`/admin/im/${iMId}/all_suggestions`}
          className="hover:bg-opacity-90 rounded px-2 py-1 text-palette_white bg-palette_blue flex space-x-1 items-center"
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16"
              width="16"
              viewBox="0 0 512 512"
              className="fill-palette_white"
            >
              <path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z" />
            </svg>
          </span>
          <span>Suggestion</span>
        </Link>
        <button
          className="rounded bg-palette_error text-palette_white px-1 hover:bg-opacity-90"
          onClick={() =>
            setState((prev) => ({ ...prev, openDeleteConfirmation: true }))
          }
        >
          Delete
        </button>
      </div>
      {state.openDeleteConfirmation && (
        <Confirmation
          onClose={() =>
            setState((prev) => ({ ...prev, openDeleteConfirmation: false }))
          }
          onConfirm={deleteHandler}
        />
      )}
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
  const [state, setState] = useState({
    openDeleteConfirmation: false,
  });
  const { addSnackbar } = useContext(SnackbarContext);
  const router = useRouter();

  const iM = useIM({ id: iMId });
  const faculty = useFaculty({
    id: iM?.facultyId,
  });
  const user = useUser({
    id: faculty?.userId,
  });

  async function deleteHandler() {
    return axios
      .delete(`/api/im_file/${iMERCCITLRevision.iMFileId}`)
      .then((res) => {
        addSnackbar("IMERC CITL revision has been deleted successfully");
      })
      .catch((error: any) => {
        addSnackbar(
          error?.response?.data?.error?.message ??
            "Failed to delete IMERC CITL revision",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  }

  return (
    <div className="text-sm">
      {user && (
        <p>
          Revised by{" "}
          <Link
            href={`/admin/user/${user.id}`}
            className="text-palette_light_blue hover:underline"
          >
            {user.name}
          </Link>{" "}
          |{" "}
          <span className="text-palette_light_blue">
            {DateTime.fromJSDate(
              new Date(iMERCCITLRevision?.updatedAt ?? "")
            ).toFormat("D | t")}
          </span>
        </p>
      )}
      {!user && <p className="animate-pulse">Loading...</p>}
      <button
        className="rounded bg-palette_error text-palette_white px-1 hover:bg-opacity-90"
        onClick={() =>
          setState((prev) => ({ ...prev, openDeleteConfirmation: true }))
        }
      >
        Delete
      </button>
      {state.openDeleteConfirmation && (
        <Confirmation
          onClose={() =>
            setState((prev) => ({ ...prev, openDeleteConfirmation: false }))
          }
          onConfirm={deleteHandler}
        />
      )}
    </div>
  );
}

interface IMERCIDDCoordinatorEndorsementModalProps {
  iMERCIDDCoordinatorEndorsement: IMERCIDDCoordinatorEndorsement;
}
function IMERCIDDCoordinatorEndorsementModal({
  iMERCIDDCoordinatorEndorsement,
}: IMERCIDDCoordinatorEndorsementModalProps) {
  const [state, setState] = useState({
    openDeleteConfirmation: false,
  });
  const { addSnackbar } = useContext(SnackbarContext);
  const router = useRouter();

  const iDDCoordinator = useIDDCoordinator({
    id: iMERCIDDCoordinatorEndorsement.iDDCoordinatorId,
  });
  const user = useUser({
    id: iDDCoordinator?.userId,
  });

  async function deleteHandler() {
    return axios
      .delete(
        `/api/imerc_idd_coordinator_endorsement/${iMERCIDDCoordinatorEndorsement.id}`
      )
      .then((res) => {
        addSnackbar(
          "IMERC IDD coordinator endorsement has been deleted successfully"
        );
      })
      .catch((error: any) => {
        addSnackbar(
          error?.response?.data?.error?.message ??
            "Failed to delete IMERC IDD coordinator",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  }

  return (
    <div className="text-sm">
      {user && (
        <p>
          Endorsed by{" "}
          <Link
            href={`/admin/user/${user.id}`}
            className="text-palette_light_blue hover:underline"
          >
            {user.name}
          </Link>{" "}
          |{" "}
          <span className="text-palette_light_blue">
            {DateTime.fromJSDate(
              new Date(iMERCIDDCoordinatorEndorsement?.updatedAt ?? "")
            ).toFormat("D | t")}
          </span>
        </p>
      )}
      {!user && <p className="animate-pulse">Loading...</p>}
      <button
        className="rounded bg-palette_error text-palette_white px-1 hover:bg-opacity-90"
        onClick={() =>
          setState((prev) => ({ ...prev, openDeleteConfirmation: true }))
        }
      >
        Delete
      </button>
      {state.openDeleteConfirmation && (
        <Confirmation
          onClose={() =>
            setState((prev) => ({ ...prev, openDeleteConfirmation: false }))
          }
          onConfirm={deleteHandler}
        />
      )}
    </div>
  );
}

interface IMERCCITLDirectorEndorsementModalProps {
  iMERCCITLDirectorEndorsement: IMERCCITLDirectorEndorsement;
}
function IMERCCITLDirectorEndorsementModal({
  iMERCCITLDirectorEndorsement,
}: IMERCCITLDirectorEndorsementModalProps) {
  const [state, setState] = useState({
    openDeleteConfirmation: false,
  });
  const { addSnackbar } = useContext(SnackbarContext);
  const router = useRouter();

  const cITLDirector = useCITLDirector({
    id: iMERCCITLDirectorEndorsement.cITLDirectorId,
  });
  const user = useUser({
    id: cITLDirector?.userId,
  });

  async function deleteHandler() {
    return axios
      .delete(
        `/api/imerc_citl_director_endorsement/${iMERCCITLDirectorEndorsement.id}`
      )
      .then((res) => {
        addSnackbar(
          "IMERC CITL director endorsement has been deleted successfully"
        );
      })
      .catch((error: any) => {
        addSnackbar(
          error?.response?.data?.error?.message ??
            "Failed to delete IMERC CITL Endorsement",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  }

  return (
    <div className="text-sm">
      {user && (
        <p>
          Endorsed by{" "}
          <Link
            href={`/admin/user/${user.id}`}
            className="text-palette_light_blue hover:underline"
          >
            {user.name}
          </Link>{" "}
          |{" "}
          <span className="text-palette_light_blue">
            {DateTime.fromJSDate(
              new Date(iMERCCITLDirectorEndorsement?.updatedAt ?? "")
            ).toFormat("D | t")}
          </span>
        </p>
      )}
      {!user && <p className="animate-pulse">Loading...</p>}
      <button
        className="rounded bg-palette_error text-palette_white px-1 hover:bg-opacity-90"
        onClick={() =>
          setState((prev) => ({ ...prev, openDeleteConfirmation: true }))
        }
      >
        Delete
      </button>
      {state.openDeleteConfirmation && (
        <Confirmation
          onClose={() =>
            setState((prev) => ({ ...prev, openDeleteConfirmation: false }))
          }
          onConfirm={deleteHandler}
        />
      )}
    </div>
  );
}
