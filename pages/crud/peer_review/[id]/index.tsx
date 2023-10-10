import CrudLayout from "@/components/CrudLayout";
import usePeerReview from "@/hooks/usePeerReview";
import ReviewQuestions from "@/services/ReviewQuestions";
import ReviewSections from "@/services/ReviewSections";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function PeerReviewPage() {
  const router = useRouter();
  const peerReviewId = router.query.id;
  const peerReview = usePeerReview({ id: peerReviewId as string });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/peer_review/${peerReviewId}`)
      .then(() => {
        alert("PeerReview deleted successfully.");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  if (!peerReview) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>PeerReview</h2>
        <div className='space-x-1'>
          <Link
            className='border rounded'
            href={`/crud/peer_review/${peerReviewId}/edit`}
          >
            edit
          </Link>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {peerReview.id}</p>
      <p>createdAt: {new Date(peerReview.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(peerReview.updatedAt).toLocaleString()}</p>
      <p>
        departmentReviewId:{" "}
        <Link href={`/crud/department_review`} className='underline'>
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
    </CrudLayout>
  );
}
