import Loading from "@/components/Loading";
import AdminLayout from "@/components/AdminLayout";
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
      <h2 className='font-bold border-b-2 border-palette_orange pb-1 inline'>
        All Reviews
      </h2>
      {peerReview && <PeerReview peerReview={peerReview} />}
      {chairpersonReview && (
        <ChairpersonReview chairpersonReview={chairpersonReview} />
      )}
      {coordinatorReview && (
        <CoordinatorReview coordinatorReview={coordinatorReview} />
      )}
      {contentSpecialistReview && (
        <ContentSpecialistReview
          contentSpecialistReview={contentSpecialistReview}
        />
      )}
      {iDDSpecialistReview && (
        <IDDSpecialistReview iDDSpecialistReview={iDDSpecialistReview} />
      )}
      {contentEditorReview && (
        <ContentEditorReview contentEditorReview={contentEditorReview} />
      )}
    </AdminLayout>
  );
}

function PeerReview({ peerReview }: { peerReview: PeerReview }) {
  return (
    <div>
      <div>
        <h2 className='inline text-lg font-bold'>
          Instructional Material Review{" "}
          <span className='bg-palette_orange text-palette_white p-1 rounded'>
            Peer
          </span>
        </h2>
        <p className='text-sm'>Implementation Phase</p>
      </div>

      <div className='flex flex-col space-y-2 p-1'>
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

function CoordinatorReview({
  coordinatorReview,
}: {
  coordinatorReview: CoordinatorReview;
}) {
  return (
    <div>
      <div>
        <h2 className='inline text-lg font-bold'>
          Instructional Material Review{" "}
          <span className='bg-palette_orange text-palette_white p-1 rounded'>
            Coordinator
          </span>
        </h2>
        <p className='text-sm'>Implementation Phase</p>
      </div>

      <div className='flex flex-col space-y-2 p-1'>
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

function ChairpersonReview({
  chairpersonReview,
}: {
  chairpersonReview: ChairpersonReview;
}) {
  return (
    <div>
      <div>
        <h2 className='inline text-lg font-bold'>
          Instructional Material Review{" "}
          <span className='bg-palette_orange text-palette_white p-1 rounded'>
            Chairperson
          </span>
        </h2>
        <p className='text-sm'>Implementation Phase</p>
      </div>

      <div className='flex flex-col space-y-2 p-1'>
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

function ContentSpecialistReview({
  contentSpecialistReview,
}: {
  contentSpecialistReview: ContentSpecialistReview;
}) {
  return (
    <div>
      <div>
        <h2 className='inline text-lg font-bold'>
          Instructional Material Review{" "}
          <span className='bg-palette_orange text-palette_white p-1 rounded'>
            Content Specialist
          </span>
        </h2>
        <p className='text-sm'>IMERC Phase</p>
      </div>

      <div className='flex flex-col space-y-2 p-1'>
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

function ContentEditorReview({
  contentEditorReview,
}: {
  contentEditorReview: ContentEditorReview;
}) {
  return (
    <div>
      <div>
        <h2 className='inline text-lg font-bold'>
          Instructional Material Review{" "}
          <span className='bg-palette_orange text-palette_white p-1 rounded'>
            Content Editor
          </span>
        </h2>
        <p className='text-sm'>IMERC Phase</p>
      </div>
      <div className='flex flex-col space-y-2 p-1'>
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

function IDDSpecialistReview({
  iDDSpecialistReview,
}: {
  iDDSpecialistReview: IDDSpecialistReview;
}) {
  return (
    <div>
      <div>
        <h2 className='inline text-lg font-bold'>
          Instructional Material Review{" "}
          <span className='bg-palette_orange text-palette_white p-1 rounded'>
            IDD Specialist
          </span>
        </h2>
        <p className='text-sm'>IMERC Phase</p>
      </div>
      <div className='flex flex-col space-y-2 p-1'>
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
