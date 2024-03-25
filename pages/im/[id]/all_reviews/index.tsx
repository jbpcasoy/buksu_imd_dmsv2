import Loading from "@/components/Loading";
import MainLayout from "@/components/MainLayout";
import ReviewItem from "@/components/ReviewItem";
import ReviewSection from "@/components/ReviewSection";
import useChairpersonReviewIM from "@/hooks/useChairpersonReviewIM";
import useContentEditorReviewIM from "@/hooks/useContentEditorReviewIM";
import useContentSpecialistReviewIM from "@/hooks/useContentSpecialistReviewIM";
import useCoordinatorReviewIM from "@/hooks/useCoordinatorReviewIM";
import useIDDSpecialistReviewIM from "@/hooks/useIDDSpecialistReviewIM";
import useIM from "@/hooks/useIM";
import usePeerReviewIM from "@/hooks/usePeerReviewIM";
import ReviewQuestions from "@/services/ReviewQuestions";
import ReviewSections from "@/services/ReviewSections";
import {
  ChairpersonReview,
  ContentEditorReview,
  ContentSpecialistReview,
  CoordinatorReview,
  IDDSpecialistReview,
  PeerReview,
} from "@prisma/client";
import Error from "next/error";
import { useRouter } from "next/router";

export default function AllReviewsPage() {
  const router = useRouter();
  const iMId = router.query.id as string;
  const peerReview = usePeerReviewIM({ id: iMId });
  const coordinatorReview = useCoordinatorReviewIM({ id: iMId });
  const chairpersonReview = useChairpersonReviewIM({ id: iMId });
  const contentSpecialistReview = useContentSpecialistReviewIM({ id: iMId });
  const contentEditorReview = useContentEditorReviewIM({ id: iMId });
  const iDDSpecialistReview = useIDDSpecialistReviewIM({ id: iMId });
  const iM = useIM({ id: iMId as string });

  if (iM === null) {
    return (
      <MainLayout>
        <Error statusCode={404} title="IM Not Found" />
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
      <div className="bg-palette_white rounded-2xl p-4 overflow-auto flex flex-col h-full w-full">
        <div className="pb-4">
          <div className="border border-palette_orange p-4 rounded-lg inline-flex space-x-2">
            <svg
              width="18"
              height="22"
              viewBox="0 0 18 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-palette_grey"
            >
              <path
                d="M16.5 13.25V10.625C16.5 9.72989 16.1444 8.87145 15.5115 8.23851C14.8786 7.60558 14.0201 7.25 13.125 7.25H11.625C11.3266 7.25 11.0405 7.13147 10.8295 6.9205C10.6185 6.70952 10.5 6.42337 10.5 6.125V4.625C10.5 3.72989 10.1444 2.87145 9.51149 2.23851C8.87855 1.60558 8.02011 1.25 7.125 1.25H5.25M5.25 14H12.75M5.25 17H9M7.5 1.25H2.625C2.004 1.25 1.5 1.754 1.5 2.375V19.625C1.5 20.246 2.004 20.75 2.625 20.75H15.375C15.996 20.75 16.5 20.246 16.5 19.625V10.25C16.5 7.86305 15.5518 5.57387 13.864 3.88604C12.1761 2.19821 9.88695 1.25 7.5 1.25Z"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h2 className="font-bold ">All Reviews</h2>
          </div>
        </div>
        <div className="overflow-auto">
          {peerReview && <PeerReviewView peerReview={peerReview} />}
          {chairpersonReview && (
            <ChairpersonReviewView chairpersonReview={chairpersonReview} />
          )}
          {coordinatorReview && (
            <CoordinatorReviewView coordinatorReview={coordinatorReview} />
          )}
          {contentSpecialistReview && (
            <ContentSpecialistReviewView
              contentSpecialistReview={contentSpecialistReview}
            />
          )}
          {iDDSpecialistReview && (
            <IDDSpecialistReviewView
              iDDSpecialistReview={iDDSpecialistReview}
            />
          )}
          {contentEditorReview && (
            <ContentEditorReviewView
              contentEditorReview={contentEditorReview}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}

function PeerReviewView({ peerReview }: { peerReview: PeerReview }) {
  return (
    <div>
      <div>
        <h2 className="inline  font-bold">
          Instructional Material Review{" "}
          <span className="bg-palette_orange text-palette_white p-1 rounded">
            Peer
          </span>
        </h2>
        <p className="text-sm">Implementation Phase</p>
      </div>

      <div className="flex flex-col space-y-2 p-1">
        <ReviewSection title={ReviewSections.s1}>
          <ReviewItem
            question={ReviewQuestions.q1_1}
            disabled={true}
            checkedValue={peerReview?.q1_1 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q1_2}
            disabled={true}
            checkedValue={peerReview?.q1_2 ?? ""}
          />
        </ReviewSection>

        <ReviewSection title={ReviewSections.s2}>
          <ReviewItem
            question={ReviewQuestions.q2_1}
            disabled={true}
            checkedValue={peerReview?.q2_1 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q2_2}
            disabled={true}
            checkedValue={peerReview?.q2_2 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q2_3}
            disabled={true}
            checkedValue={peerReview?.q2_3 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q2_4}
            disabled={true}
            checkedValue={peerReview?.q2_4 ?? ""}
          />
        </ReviewSection>

        <ReviewSection title={ReviewSections.s3}>
          <ReviewItem
            question={ReviewQuestions.q3_1}
            disabled={true}
            checkedValue={peerReview?.q3_1 ?? ""}
          />
        </ReviewSection>

        <ReviewSection title={ReviewSections.s4}>
          <ReviewItem
            question={ReviewQuestions.q4_1}
            disabled={true}
            checkedValue={peerReview?.q4_1 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q4_2}
            disabled={true}
            checkedValue={peerReview?.q4_2 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q4_3}
            disabled={true}
            checkedValue={peerReview?.q4_3 ?? ""}
          />
        </ReviewSection>

        <ReviewSection title={ReviewSections.s5}>
          <ReviewItem
            question={ReviewQuestions.q5_1}
            disabled={true}
            checkedValue={peerReview?.q5_1 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q5_2}
            disabled={true}
            checkedValue={peerReview?.q5_2 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q5_3}
            disabled={true}
            checkedValue={peerReview?.q5_3 ?? ""}
          />
        </ReviewSection>

        <ReviewSection title={ReviewSections.s6}>
          <ReviewItem
            question={ReviewQuestions.q6_1}
            disabled={true}
            checkedValue={peerReview?.q6_1 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q6_2}
            disabled={true}
            checkedValue={peerReview?.q6_2 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q6_3}
            disabled={true}
            checkedValue={peerReview?.q6_3 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q6_4}
            disabled={true}
            checkedValue={peerReview?.q6_4 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q6_5}
            disabled={true}
            checkedValue={peerReview?.q6_5 ?? ""}
          />
        </ReviewSection>
        <ReviewSection title={ReviewSections.s7}>
          <ReviewItem
            question={ReviewQuestions.q7_1}
            disabled={true}
            checkedValue={peerReview?.q7_1 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q7_2}
            disabled={true}
            checkedValue={peerReview?.q7_2 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q7_3}
            disabled={true}
            checkedValue={peerReview?.q7_3 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q7_4}
            disabled={true}
            checkedValue={peerReview?.q7_4 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q7_5}
            disabled={true}
            checkedValue={peerReview?.q7_5 ?? ""}
          />
        </ReviewSection>
        <ReviewSection title={ReviewSections.s8}>
          <ReviewItem
            question={ReviewQuestions.q8_1}
            disabled={true}
            checkedValue={peerReview?.q8_1 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q8_2}
            disabled={true}
            checkedValue={peerReview?.q8_2 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q8_3}
            disabled={true}
            checkedValue={peerReview?.q8_3 ?? ""}
          />
        </ReviewSection>
      </div>
    </div>
  );
}

function CoordinatorReviewView({
  coordinatorReview,
}: {
  coordinatorReview: CoordinatorReview;
}) {
  return (
    <div>
      <div>
        <h2 className="inline  font-bold">
          Instructional Material Review{" "}
          <span className="bg-palette_orange text-palette_white p-1 rounded">
            Coordinator
          </span>
        </h2>
        <p className="text-sm">Implementation Phase</p>
      </div>

      <div className="flex flex-col space-y-2 p-1">
        <ReviewSection title={ReviewSections.s1}>
          <ReviewItem
            question={ReviewQuestions.q1_1}
            disabled={true}
            checkedValue={coordinatorReview?.q1_1 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q1_2}
            disabled={true}
            checkedValue={coordinatorReview?.q1_2 ?? ""}
          />
        </ReviewSection>

        <ReviewSection title={ReviewSections.s2}>
          <ReviewItem
            question={ReviewQuestions.q2_1}
            disabled={true}
            checkedValue={coordinatorReview?.q2_1 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q2_2}
            disabled={true}
            checkedValue={coordinatorReview?.q2_2 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q2_3}
            disabled={true}
            checkedValue={coordinatorReview?.q2_3 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q2_4}
            disabled={true}
            checkedValue={coordinatorReview?.q2_4 ?? ""}
          />
        </ReviewSection>

        <ReviewSection title={ReviewSections.s3}>
          <ReviewItem
            question={ReviewQuestions.q3_1}
            disabled={true}
            checkedValue={coordinatorReview?.q3_1 ?? ""}
          />
        </ReviewSection>

        <ReviewSection title={ReviewSections.s4}>
          <ReviewItem
            question={ReviewQuestions.q4_1}
            disabled={true}
            checkedValue={coordinatorReview?.q4_1 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q4_2}
            disabled={true}
            checkedValue={coordinatorReview?.q4_2 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q4_3}
            disabled={true}
            checkedValue={coordinatorReview?.q4_3 ?? ""}
          />
        </ReviewSection>

        <ReviewSection title={ReviewSections.s5}>
          <ReviewItem
            question={ReviewQuestions.q5_1}
            disabled={true}
            checkedValue={coordinatorReview?.q5_1 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q5_2}
            disabled={true}
            checkedValue={coordinatorReview?.q5_2 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q5_3}
            disabled={true}
            checkedValue={coordinatorReview?.q5_3 ?? ""}
          />
        </ReviewSection>

        <ReviewSection title={ReviewSections.s6}>
          <ReviewItem
            question={ReviewQuestions.q6_1}
            disabled={true}
            checkedValue={coordinatorReview?.q6_1 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q6_2}
            disabled={true}
            checkedValue={coordinatorReview?.q6_2 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q6_3}
            disabled={true}
            checkedValue={coordinatorReview?.q6_3 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q6_4}
            disabled={true}
            checkedValue={coordinatorReview?.q6_4 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q6_5}
            disabled={true}
            checkedValue={coordinatorReview?.q6_5 ?? ""}
          />
        </ReviewSection>
        <ReviewSection title={ReviewSections.s7}>
          <ReviewItem
            question={ReviewQuestions.q7_1}
            disabled={true}
            checkedValue={coordinatorReview?.q7_1 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q7_2}
            disabled={true}
            checkedValue={coordinatorReview?.q7_2 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q7_3}
            disabled={true}
            checkedValue={coordinatorReview?.q7_3 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q7_4}
            disabled={true}
            checkedValue={coordinatorReview?.q7_4 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q7_5}
            disabled={true}
            checkedValue={coordinatorReview?.q7_5 ?? ""}
          />
        </ReviewSection>
        <ReviewSection title={ReviewSections.s8}>
          <ReviewItem
            question={ReviewQuestions.q8_1}
            disabled={true}
            checkedValue={coordinatorReview?.q8_1 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q8_2}
            disabled={true}
            checkedValue={coordinatorReview?.q8_2 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q8_3}
            disabled={true}
            checkedValue={coordinatorReview?.q8_3 ?? ""}
          />
        </ReviewSection>
      </div>
    </div>
  );
}

function ChairpersonReviewView({
  chairpersonReview,
}: {
  chairpersonReview: ChairpersonReview;
}) {
  return (
    <div>
      <div>
        <h2 className="inline  font-bold">
          Instructional Material Review{" "}
          <span className="bg-palette_orange text-palette_white p-1 rounded">
            Chairperson
          </span>
        </h2>
        <p className="text-sm">Implementation Phase</p>
      </div>

      <div className="flex flex-col space-y-2 p-1">
        <ReviewSection title={ReviewSections.s1}>
          <ReviewItem
            question={ReviewQuestions.q1_1}
            disabled={true}
            checkedValue={chairpersonReview?.q1_1 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q1_2}
            disabled={true}
            checkedValue={chairpersonReview?.q1_2 ?? ""}
          />
        </ReviewSection>

        <ReviewSection title={ReviewSections.s2}>
          <ReviewItem
            question={ReviewQuestions.q2_1}
            disabled={true}
            checkedValue={chairpersonReview?.q2_1 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q2_2}
            disabled={true}
            checkedValue={chairpersonReview?.q2_2 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q2_3}
            disabled={true}
            checkedValue={chairpersonReview?.q2_3 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q2_4}
            disabled={true}
            checkedValue={chairpersonReview?.q2_4 ?? ""}
          />
        </ReviewSection>

        <ReviewSection title={ReviewSections.s3}>
          <ReviewItem
            question={ReviewQuestions.q3_1}
            disabled={true}
            checkedValue={chairpersonReview?.q3_1 ?? ""}
          />
        </ReviewSection>

        <ReviewSection title={ReviewSections.s4}>
          <ReviewItem
            question={ReviewQuestions.q4_1}
            disabled={true}
            checkedValue={chairpersonReview?.q4_1 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q4_2}
            disabled={true}
            checkedValue={chairpersonReview?.q4_2 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q4_3}
            disabled={true}
            checkedValue={chairpersonReview?.q4_3 ?? ""}
          />
        </ReviewSection>

        <ReviewSection title={ReviewSections.s5}>
          <ReviewItem
            question={ReviewQuestions.q5_1}
            disabled={true}
            checkedValue={chairpersonReview?.q5_1 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q5_2}
            disabled={true}
            checkedValue={chairpersonReview?.q5_2 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q5_3}
            disabled={true}
            checkedValue={chairpersonReview?.q5_3 ?? ""}
          />
        </ReviewSection>

        <ReviewSection title={ReviewSections.s6}>
          <ReviewItem
            question={ReviewQuestions.q6_1}
            disabled={true}
            checkedValue={chairpersonReview?.q6_1 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q6_2}
            disabled={true}
            checkedValue={chairpersonReview?.q6_2 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q6_3}
            disabled={true}
            checkedValue={chairpersonReview?.q6_3 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q6_4}
            disabled={true}
            checkedValue={chairpersonReview?.q6_4 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q6_5}
            disabled={true}
            checkedValue={chairpersonReview?.q6_5 ?? ""}
          />
        </ReviewSection>
        <ReviewSection title={ReviewSections.s7}>
          <ReviewItem
            question={ReviewQuestions.q7_1}
            disabled={true}
            checkedValue={chairpersonReview?.q7_1 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q7_2}
            disabled={true}
            checkedValue={chairpersonReview?.q7_2 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q7_3}
            disabled={true}
            checkedValue={chairpersonReview?.q7_3 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q7_4}
            disabled={true}
            checkedValue={chairpersonReview?.q7_4 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q7_5}
            disabled={true}
            checkedValue={chairpersonReview?.q7_5 ?? ""}
          />
        </ReviewSection>
        <ReviewSection title={ReviewSections.s8}>
          <ReviewItem
            question={ReviewQuestions.q8_1}
            disabled={true}
            checkedValue={chairpersonReview?.q8_1 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q8_2}
            disabled={true}
            checkedValue={chairpersonReview?.q8_2 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q8_3}
            disabled={true}
            checkedValue={chairpersonReview?.q8_3 ?? ""}
          />
        </ReviewSection>
      </div>
    </div>
  );
}

function ContentSpecialistReviewView({
  contentSpecialistReview,
}: {
  contentSpecialistReview: ContentSpecialistReview;
}) {
  return (
    <div>
      <div>
        <h2 className="inline  font-bold">
          Instructional Material Review{" "}
          <span className="bg-palette_orange text-palette_white p-1 rounded">
            Content Specialist
          </span>
        </h2>
        <p className="text-sm">IMERC Phase</p>
      </div>

      <div className="flex flex-col space-y-2 p-1">
        <ReviewSection title={ReviewSections.s1}>
          <ReviewItem
            question={ReviewQuestions.q1_1}
            disabled={true}
            checkedValue={contentSpecialistReview?.q1_1 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q1_2}
            disabled={true}
            checkedValue={contentSpecialistReview?.q1_2 ?? ""}
          />
        </ReviewSection>

        <ReviewSection title={ReviewSections.s2}>
          <ReviewItem
            question={ReviewQuestions.q2_1}
            disabled={true}
            checkedValue={contentSpecialistReview?.q2_1 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q2_2}
            disabled={true}
            checkedValue={contentSpecialistReview?.q2_2 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q2_3}
            disabled={true}
            checkedValue={contentSpecialistReview?.q2_3 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q2_4}
            disabled={true}
            checkedValue={contentSpecialistReview?.q2_4 ?? ""}
          />
        </ReviewSection>

        <ReviewSection title={ReviewSections.s3}>
          <ReviewItem
            question={ReviewQuestions.q3_1}
            disabled={true}
            checkedValue={contentSpecialistReview?.q3_1 ?? ""}
          />
        </ReviewSection>

        <ReviewSection title={ReviewSections.s4}>
          <ReviewItem
            question={ReviewQuestions.q4_1}
            disabled={true}
            checkedValue={contentSpecialistReview?.q4_1 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q4_2}
            disabled={true}
            checkedValue={contentSpecialistReview?.q4_2 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q4_3}
            disabled={true}
            checkedValue={contentSpecialistReview?.q4_3 ?? ""}
          />
        </ReviewSection>

        <ReviewSection title={ReviewSections.s5}>
          <ReviewItem
            question={ReviewQuestions.q5_1}
            disabled={true}
            checkedValue={contentSpecialistReview?.q5_1 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q5_2}
            disabled={true}
            checkedValue={contentSpecialistReview?.q5_2 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q5_3}
            disabled={true}
            checkedValue={contentSpecialistReview?.q5_3 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q5_4}
            disabled={true}
            checkedValue={contentSpecialistReview?.q5_4 ?? ""}
          />
        </ReviewSection>

        <ReviewSection title={ReviewSections.s6}>
          <ReviewItem
            question={ReviewQuestions.q6_1}
            disabled={true}
            checkedValue={contentSpecialistReview?.q6_1 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q6_2}
            disabled={true}
            checkedValue={contentSpecialistReview?.q6_2 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q6_3}
            disabled={true}
            checkedValue={contentSpecialistReview?.q6_3 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q6_4}
            disabled={true}
            checkedValue={contentSpecialistReview?.q6_4 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q6_5}
            disabled={true}
            checkedValue={contentSpecialistReview?.q6_5 ?? ""}
          />
        </ReviewSection>
        <ReviewSection title={ReviewSections.s7}>
          <ReviewItem
            question={ReviewQuestions.q7_1}
            disabled={true}
            checkedValue={contentSpecialistReview?.q7_1 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q7_2}
            disabled={true}
            checkedValue={contentSpecialistReview?.q7_2 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q7_3}
            disabled={true}
            checkedValue={contentSpecialistReview?.q7_3 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q7_4}
            disabled={true}
            checkedValue={contentSpecialistReview?.q7_4 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q7_5}
            disabled={true}
            checkedValue={contentSpecialistReview?.q7_5 ?? ""}
          />
        </ReviewSection>
        <ReviewSection title={ReviewSections.s8}>
          <ReviewItem
            question={ReviewQuestions.q8_1}
            disabled={true}
            checkedValue={contentSpecialistReview?.q8_1 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q8_2}
            disabled={true}
            checkedValue={contentSpecialistReview?.q8_2 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q8_3}
            disabled={true}
            checkedValue={contentSpecialistReview?.q8_3 ?? ""}
          />
        </ReviewSection>
      </div>
    </div>
  );
}

function ContentEditorReviewView({
  contentEditorReview,
}: {
  contentEditorReview: ContentEditorReview;
}) {
  return (
    <div>
      <div>
        <h2 className="inline  font-bold">
          Instructional Material Review{" "}
          <span className="bg-palette_orange text-palette_white p-1 rounded">
            Content Editor
          </span>
        </h2>
        <p className="text-sm">IMERC Phase</p>
      </div>
      <div className="flex flex-col space-y-2 p-1">
        <ReviewSection title={ReviewSections.s1}>
          <ReviewItem
            question={ReviewQuestions.q1_1}
            disabled={true}
            checkedValue={contentEditorReview?.q1_1 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q1_2}
            disabled={true}
            checkedValue={contentEditorReview?.q1_2 ?? ""}
          />
        </ReviewSection>

        <ReviewSection title={ReviewSections.s2}>
          <ReviewItem
            question={ReviewQuestions.q2_1}
            disabled={true}
            checkedValue={contentEditorReview?.q2_1 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q2_2}
            disabled={true}
            checkedValue={contentEditorReview?.q2_2 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q2_3}
            disabled={true}
            checkedValue={contentEditorReview?.q2_3 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q2_4}
            disabled={true}
            checkedValue={contentEditorReview?.q2_4 ?? ""}
          />
        </ReviewSection>

        <ReviewSection title={ReviewSections.s3}>
          <ReviewItem
            question={ReviewQuestions.q3_1}
            disabled={true}
            checkedValue={contentEditorReview?.q3_1 ?? ""}
          />
        </ReviewSection>

        <ReviewSection title={ReviewSections.s4}>
          <ReviewItem
            question={ReviewQuestions.q4_1}
            disabled={true}
            checkedValue={contentEditorReview?.q4_1 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q4_2}
            disabled={true}
            checkedValue={contentEditorReview?.q4_2 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q4_3}
            disabled={true}
            checkedValue={contentEditorReview?.q4_3 ?? ""}
          />
        </ReviewSection>

        <ReviewSection title={ReviewSections.s5}>
          <ReviewItem
            question={ReviewQuestions.q5_1}
            disabled={true}
            checkedValue={contentEditorReview?.q5_1 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q5_2}
            disabled={true}
            checkedValue={contentEditorReview?.q5_2 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q5_3}
            disabled={true}
            checkedValue={contentEditorReview?.q5_3 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q5_4}
            disabled={true}
            checkedValue={contentEditorReview?.q5_4 ?? ""}
          />
        </ReviewSection>

        <ReviewSection title={ReviewSections.s6}>
          <ReviewItem
            question={ReviewQuestions.q6_1}
            disabled={true}
            checkedValue={contentEditorReview?.q6_1 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q6_2}
            disabled={true}
            checkedValue={contentEditorReview?.q6_2 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q6_3}
            disabled={true}
            checkedValue={contentEditorReview?.q6_3 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q6_4}
            disabled={true}
            checkedValue={contentEditorReview?.q6_4 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q6_5}
            disabled={true}
            checkedValue={contentEditorReview?.q6_5 ?? ""}
          />
        </ReviewSection>
        <ReviewSection title={ReviewSections.s7}>
          <ReviewItem
            question={ReviewQuestions.q7_1}
            disabled={true}
            checkedValue={contentEditorReview?.q7_1 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q7_2}
            disabled={true}
            checkedValue={contentEditorReview?.q7_2 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q7_3}
            disabled={true}
            checkedValue={contentEditorReview?.q7_3 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q7_4}
            disabled={true}
            checkedValue={contentEditorReview?.q7_4 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q7_5}
            disabled={true}
            checkedValue={contentEditorReview?.q7_5 ?? ""}
          />
        </ReviewSection>
        <ReviewSection title={ReviewSections.s8}>
          <ReviewItem
            question={ReviewQuestions.q8_1}
            disabled={true}
            checkedValue={contentEditorReview?.q8_1 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q8_2}
            disabled={true}
            checkedValue={contentEditorReview?.q8_2 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q8_3}
            disabled={true}
            checkedValue={contentEditorReview?.q8_3 ?? ""}
          />
        </ReviewSection>
      </div>
    </div>
  );
}

function IDDSpecialistReviewView({
  iDDSpecialistReview,
}: {
  iDDSpecialistReview: IDDSpecialistReview;
}) {
  return (
    <div>
      <div>
        <h2 className="inline  font-bold">
          Instructional Material Review{" "}
          <span className="bg-palette_orange text-palette_white p-1 rounded">
            IDD Specialist
          </span>
        </h2>
        <p className="text-sm">IMERC Phase</p>
      </div>
      <div className="flex flex-col space-y-2 p-1">
        <ReviewSection title={ReviewSections.s1}>
          <ReviewItem
            question={ReviewQuestions.q1_1}
            disabled={true}
            checkedValue={iDDSpecialistReview?.q1_1 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q1_2}
            disabled={true}
            checkedValue={iDDSpecialistReview?.q1_2 ?? ""}
          />
        </ReviewSection>

        <ReviewSection title={ReviewSections.s2}>
          <ReviewItem
            question={ReviewQuestions.q2_1}
            disabled={true}
            checkedValue={iDDSpecialistReview?.q2_1 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q2_2}
            disabled={true}
            checkedValue={iDDSpecialistReview?.q2_2 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q2_3}
            disabled={true}
            checkedValue={iDDSpecialistReview?.q2_3 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q2_4}
            disabled={true}
            checkedValue={iDDSpecialistReview?.q2_4 ?? ""}
          />
        </ReviewSection>

        <ReviewSection title={ReviewSections.s3}>
          <ReviewItem
            question={ReviewQuestions.q3_1}
            disabled={true}
            checkedValue={iDDSpecialistReview?.q3_1 ?? ""}
          />
        </ReviewSection>

        <ReviewSection title={ReviewSections.s4}>
          <ReviewItem
            question={ReviewQuestions.q4_1}
            disabled={true}
            checkedValue={iDDSpecialistReview?.q4_1 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q4_2}
            disabled={true}
            checkedValue={iDDSpecialistReview?.q4_2 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q4_3}
            disabled={true}
            checkedValue={iDDSpecialistReview?.q4_3 ?? ""}
          />
        </ReviewSection>

        <ReviewSection title={ReviewSections.s5}>
          <ReviewItem
            question={ReviewQuestions.q5_1}
            disabled={true}
            checkedValue={iDDSpecialistReview?.q5_1 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q5_2}
            disabled={true}
            checkedValue={iDDSpecialistReview?.q5_2 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q5_3}
            disabled={true}
            checkedValue={iDDSpecialistReview?.q5_3 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q5_4}
            disabled={true}
            checkedValue={iDDSpecialistReview?.q5_4 ?? ""}
          />
        </ReviewSection>

        <ReviewSection title={ReviewSections.s6}>
          <ReviewItem
            question={ReviewQuestions.q6_1}
            disabled={true}
            checkedValue={iDDSpecialistReview?.q6_1 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q6_2}
            disabled={true}
            checkedValue={iDDSpecialistReview?.q6_2 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q6_3}
            disabled={true}
            checkedValue={iDDSpecialistReview?.q6_3 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q6_4}
            disabled={true}
            checkedValue={iDDSpecialistReview?.q6_4 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q6_5}
            disabled={true}
            checkedValue={iDDSpecialistReview?.q6_5 ?? ""}
          />
        </ReviewSection>
        <ReviewSection title={ReviewSections.s7}>
          <ReviewItem
            question={ReviewQuestions.q7_1}
            disabled={true}
            checkedValue={iDDSpecialistReview?.q7_1 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q7_2}
            disabled={true}
            checkedValue={iDDSpecialistReview?.q7_2 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q7_3}
            disabled={true}
            checkedValue={iDDSpecialistReview?.q7_3 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q7_4}
            disabled={true}
            checkedValue={iDDSpecialistReview?.q7_4 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q7_5}
            disabled={true}
            checkedValue={iDDSpecialistReview?.q7_5 ?? ""}
          />
        </ReviewSection>
        <ReviewSection title={ReviewSections.s8}>
          <ReviewItem
            question={ReviewQuestions.q8_1}
            disabled={true}
            checkedValue={iDDSpecialistReview?.q8_1 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q8_2}
            disabled={true}
            checkedValue={iDDSpecialistReview?.q8_2 ?? ""}
          />
          <ReviewItem
            question={ReviewQuestions.q8_3}
            disabled={true}
            checkedValue={iDDSpecialistReview?.q8_3 ?? ""}
          />
        </ReviewSection>
      </div>
    </div>
  );
}
