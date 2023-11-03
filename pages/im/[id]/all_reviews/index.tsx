import MainLayout from "@/components/MainLayout";
import usePeerReviewIM from "@/hooks/usePeerReviewIM";
import ReviewQuestions from "@/services/ReviewQuestions";
import ReviewSections from "@/services/ReviewSections";
import { PeerReview } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";

export default function AllReviewsPage() {
  const router = useRouter();
  const iMId = router.query.id as string;
  const peerReview = usePeerReviewIM({ id: iMId });

  return (
    <MainLayout>
      <h2>All Reviews</h2>
      {peerReview && <PeerReview peerReview={peerReview} />}
    </MainLayout>
  );
}

function PeerReview({ peerReview }: { peerReview: PeerReview }) {
  return (
    <div>
      <div className='flex'>
        <h3 className='flex-1'>PeerReview</h3>
      </div>
      <p>id: {peerReview.id}</p>
      <p>createdAt: {new Date(peerReview.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(peerReview.updatedAt).toLocaleString()}</p>
      <p>
        departmentReviewId:{" "}
        <Link
          href={`/crud/department_review/${peerReview.departmentReviewId}`}
          className='underline'
        >
          {peerReview.departmentReviewId}
        </Link>
      </p>

      <p className='font-bold'>{ReviewSections.s1}</p>
      <p>
        <span className='font-bold'>{peerReview.q1_1}</span> -{" "}
        {ReviewQuestions.q1_1}
      </p>
      <p>
        <span className='font-bold'>{peerReview.q1_2}</span> -{" "}
        {ReviewQuestions.q1_2}
      </p>

      <p className='font-bold'>{ReviewSections.s2}</p>
      <p>
        <span className='font-bold'>{peerReview.q2_1}</span> -{" "}
        {ReviewQuestions.q2_1}
      </p>
      <p>
        <span className='font-bold'>{peerReview.q2_2}</span> -{" "}
        {ReviewQuestions.q2_2}
      </p>
      <p>
        <span className='font-bold'>{peerReview.q2_3}</span> -{" "}
        {ReviewQuestions.q2_3}
      </p>
      <p>
        <span className='font-bold'>{peerReview.q2_4}</span> -{" "}
        {ReviewQuestions.q2_4}
      </p>

      <p className='font-bold'>{ReviewSections.s3}</p>
      <p>
        <span className='font-bold'>{peerReview.q3_1}</span> -{" "}
        {ReviewQuestions.q3_1}
      </p>

      <p className='font-bold'>{ReviewSections.s4}</p>
      <p>
        <span className='font-bold'>{peerReview.q4_1}</span> -{" "}
        {ReviewQuestions.q4_1}
      </p>
      <p>
        <span className='font-bold'>{peerReview.q4_2}</span> -{" "}
        {ReviewQuestions.q4_2}
      </p>
      <p>
        <span className='font-bold'>{peerReview.q4_3}</span> -{" "}
        {ReviewQuestions.q4_3}
      </p>

      <p className='font-bold'>{ReviewSections.s5}</p>
      <p>
        <span className='font-bold'>{peerReview.q5_1}</span> -{" "}
        {ReviewQuestions.q5_1}
      </p>
      <p>
        <span className='font-bold'>{peerReview.q5_2}</span> -{" "}
        {ReviewQuestions.q5_2}
      </p>
      <p>
        <span className='font-bold'>{peerReview.q5_3}</span> -{" "}
        {ReviewQuestions.q5_3}
      </p>

      <p className='font-bold'>{ReviewSections.s6}</p>
      <p>
        <span className='font-bold'>{peerReview.q6_1}</span> -{" "}
        {ReviewQuestions.q6_1}
      </p>
      <p>
        <span className='font-bold'>{peerReview.q6_2}</span> -{" "}
        {ReviewQuestions.q6_2}
      </p>
      <p>
        <span className='font-bold'>{peerReview.q6_3}</span> -{" "}
        {ReviewQuestions.q6_3}
      </p>
      <p>
        <span className='font-bold'>{peerReview.q6_4}</span> -{" "}
        {ReviewQuestions.q6_4}
      </p>
      <p>
        <span className='font-bold'>{peerReview.q6_5}</span> -{" "}
        {ReviewQuestions.q6_5}
      </p>

      <p className='font-bold'>{ReviewSections.s7}</p>
      <p>
        <span className='font-bold'>{peerReview.q7_1}</span> -{" "}
        {ReviewQuestions.q7_1}
      </p>
      <p>
        <span className='font-bold'>{peerReview.q7_2}</span> -{" "}
        {ReviewQuestions.q7_3}
      </p>
      <p>
        <span className='font-bold'>{peerReview.q7_3}</span> -{" "}
        {ReviewQuestions.q7_3}
      </p>
      <p>
        <span className='font-bold'>{peerReview.q7_4}</span> -{" "}
        {ReviewQuestions.q7_4}
      </p>
      <p>
        <span className='font-bold'>{peerReview.q7_5}</span> -{" "}
        {ReviewQuestions.q7_5}
      </p>

      <p className='font-bold'>{ReviewSections.s8}</p>
      <p>
        <span className='font-bold'>{peerReview.q8_1}</span> -{" "}
        {ReviewQuestions.q8_1}
      </p>
      <p>
        <span className='font-bold'>{peerReview.q8_2}</span> -{" "}
        {ReviewQuestions.q8_2}
      </p>
      <p>
        <span className='font-bold'>{peerReview.q8_3}</span> -{" "}
        {ReviewQuestions.q8_3}
      </p>
    </div>
  );
}
