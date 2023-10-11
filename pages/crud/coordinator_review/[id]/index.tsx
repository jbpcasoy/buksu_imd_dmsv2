import CrudLayout from "@/components/CrudLayout";
import useCoordinatorReview from "@/hooks/useCoordinatorReview";
import ReviewQuestions from "@/services/ReviewQuestions";
import ReviewSections from "@/services/ReviewSections";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function CoordinatorReviewPage() {
  const router = useRouter();
  const coordinatorReviewId = router.query.id;
  const coordinatorReview = useCoordinatorReview({ id: coordinatorReviewId as string });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/coordinator_review/${coordinatorReviewId}`)
      .then(() => {
        alert("CoordinatorReview deleted successfully.");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  if (!coordinatorReview) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>CoordinatorReview</h2>
        <div className='space-x-1'>
          <Link
            className='border rounded'
            href={`/crud/coordinator_review/${coordinatorReviewId}/edit`}
          >
            edit
          </Link>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {coordinatorReview.id}</p>
      <p>createdAt: {new Date(coordinatorReview.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(coordinatorReview.updatedAt).toLocaleString()}</p>
      <p>
        departmentReviewId:{" "}
        <Link href={`/crud/department_review`} className='underline'>
          {coordinatorReview.departmentReviewId}
        </Link>
      </p>

      <p className='font-bold'>{ReviewSections.s1}</p>
      <p>
        <span className='font-bold'>{coordinatorReview.q1_1}</span> -{" "}
        {ReviewQuestions.q1_1}
      </p>
      <p>
        <span className='font-bold'>{coordinatorReview.q1_2}</span> -{" "}
        {ReviewQuestions.q1_2}
      </p>

      <p className='font-bold'>{ReviewSections.s2}</p>
      <p>
        <span className='font-bold'>{coordinatorReview.q2_1}</span> -{" "}
        {ReviewQuestions.q2_1}
      </p>
      <p>
        <span className='font-bold'>{coordinatorReview.q2_2}</span> -{" "}
        {ReviewQuestions.q2_2}
      </p>
      <p>
        <span className='font-bold'>{coordinatorReview.q2_3}</span> -{" "}
        {ReviewQuestions.q2_3}
      </p>
      <p>
        <span className='font-bold'>{coordinatorReview.q2_4}</span> -{" "}
        {ReviewQuestions.q2_4}
      </p>

      <p className='font-bold'>{ReviewSections.s3}</p>
      <p>
        <span className='font-bold'>{coordinatorReview.q3_1}</span> -{" "}
        {ReviewQuestions.q3_1}
      </p>

      <p className='font-bold'>{ReviewSections.s4}</p>
      <p>
        <span className='font-bold'>{coordinatorReview.q4_1}</span> -{" "}
        {ReviewQuestions.q4_1}
      </p>
      <p>
        <span className='font-bold'>{coordinatorReview.q4_2}</span> -{" "}
        {ReviewQuestions.q4_2}
      </p>
      <p>
        <span className='font-bold'>{coordinatorReview.q4_3}</span> -{" "}
        {ReviewQuestions.q4_3}
      </p>

      <p className='font-bold'>{ReviewSections.s5}</p>
      <p>
        <span className='font-bold'>{coordinatorReview.q5_1}</span> -{" "}
        {ReviewQuestions.q5_1}
      </p>
      <p>
        <span className='font-bold'>{coordinatorReview.q5_2}</span> -{" "}
        {ReviewQuestions.q5_2}
      </p>
      <p>
        <span className='font-bold'>{coordinatorReview.q5_3}</span> -{" "}
        {ReviewQuestions.q5_3}
      </p>

      <p className='font-bold'>{ReviewSections.s6}</p>
      <p>
        <span className='font-bold'>{coordinatorReview.q6_1}</span> -{" "}
        {ReviewQuestions.q6_1}
      </p>
      <p>
        <span className='font-bold'>{coordinatorReview.q6_2}</span> -{" "}
        {ReviewQuestions.q6_2}
      </p>
      <p>
        <span className='font-bold'>{coordinatorReview.q6_3}</span> -{" "}
        {ReviewQuestions.q6_3}
      </p>
      <p>
        <span className='font-bold'>{coordinatorReview.q6_4}</span> -{" "}
        {ReviewQuestions.q6_4}
      </p>
      <p>
        <span className='font-bold'>{coordinatorReview.q6_5}</span> -{" "}
        {ReviewQuestions.q6_5}
      </p>

      <p className='font-bold'>{ReviewSections.s7}</p>
      <p>
        <span className='font-bold'>{coordinatorReview.q7_1}</span> -{" "}
        {ReviewQuestions.q7_1}
      </p>
      <p>
        <span className='font-bold'>{coordinatorReview.q7_2}</span> -{" "}
        {ReviewQuestions.q7_3}
      </p>
      <p>
        <span className='font-bold'>{coordinatorReview.q7_3}</span> -{" "}
        {ReviewQuestions.q7_3}
      </p>
      <p>
        <span className='font-bold'>{coordinatorReview.q7_4}</span> -{" "}
        {ReviewQuestions.q7_4}
      </p>
      <p>
        <span className='font-bold'>{coordinatorReview.q7_5}</span> -{" "}
        {ReviewQuestions.q7_5}
      </p>

      <p className='font-bold'>{ReviewSections.s8}</p>
      <p>
        <span className='font-bold'>{coordinatorReview.q8_1}</span> -{" "}
        {ReviewQuestions.q8_1}
      </p>
      <p>
        <span className='font-bold'>{coordinatorReview.q8_2}</span> -{" "}
        {ReviewQuestions.q8_2}
      </p>
      <p>
        <span className='font-bold'>{coordinatorReview.q8_3}</span> -{" "}
        {ReviewQuestions.q8_3}
      </p>
    </CrudLayout>
  );
}
