import CrudLayout from "@/components/CrudLayout";
import useChairpersonReview from "@/hooks/useChairpersonReview";
import ReviewQuestions from "@/services/ReviewQuestions";
import ReviewSections from "@/services/ReviewSections";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ChairpersonReviewPage() {
  const router = useRouter();
  const chairpersonReviewId = router.query.id;
  const chairpersonReview = useChairpersonReview({
    id: chairpersonReviewId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/chairperson_review/${chairpersonReviewId}`)
      .then(() => {
        alert("ChairpersonReview deleted successfully.");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!chairpersonReview) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>ChairpersonReview</h2>
        <div className='space-x-1'>
          <Link
            className='border rounded'
            href={`/crud/chairperson_review/${chairpersonReviewId}/edit`}
          >
            edit
          </Link>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {chairpersonReview.id}</p>
      <p>createdAt: {new Date(chairpersonReview.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(chairpersonReview.updatedAt).toLocaleString()}</p>
      <p>
        departmentReviewId:{" "}
        <Link href={`/crud/department_review`} className='underline'>
          {chairpersonReview.departmentReviewId}
        </Link>
      </p>

      <p className='font-bold'>{ReviewSections.s1}</p>
      <p>
        <span className='font-bold'>{chairpersonReview.q1_1}</span> -{" "}
        {ReviewQuestions.q1_1}
      </p>
      <p>
        <span className='font-bold'>{chairpersonReview.q1_2}</span> -{" "}
        {ReviewQuestions.q1_2}
      </p>

      <p className='font-bold'>{ReviewSections.s2}</p>
      <p>
        <span className='font-bold'>{chairpersonReview.q2_1}</span> -{" "}
        {ReviewQuestions.q2_1}
      </p>
      <p>
        <span className='font-bold'>{chairpersonReview.q2_2}</span> -{" "}
        {ReviewQuestions.q2_2}
      </p>
      <p>
        <span className='font-bold'>{chairpersonReview.q2_3}</span> -{" "}
        {ReviewQuestions.q2_3}
      </p>
      <p>
        <span className='font-bold'>{chairpersonReview.q2_4}</span> -{" "}
        {ReviewQuestions.q2_4}
      </p>

      <p className='font-bold'>{ReviewSections.s3}</p>
      <p>
        <span className='font-bold'>{chairpersonReview.q3_1}</span> -{" "}
        {ReviewQuestions.q3_1}
      </p>

      <p className='font-bold'>{ReviewSections.s4}</p>
      <p>
        <span className='font-bold'>{chairpersonReview.q4_1}</span> -{" "}
        {ReviewQuestions.q4_1}
      </p>
      <p>
        <span className='font-bold'>{chairpersonReview.q4_2}</span> -{" "}
        {ReviewQuestions.q4_2}
      </p>
      <p>
        <span className='font-bold'>{chairpersonReview.q4_3}</span> -{" "}
        {ReviewQuestions.q4_3}
      </p>

      <p className='font-bold'>{ReviewSections.s5}</p>
      <p>
        <span className='font-bold'>{chairpersonReview.q5_1}</span> -{" "}
        {ReviewQuestions.q5_1}
      </p>
      <p>
        <span className='font-bold'>{chairpersonReview.q5_2}</span> -{" "}
        {ReviewQuestions.q5_2}
      </p>
      <p>
        <span className='font-bold'>{chairpersonReview.q5_3}</span> -{" "}
        {ReviewQuestions.q5_3}
      </p>

      <p className='font-bold'>{ReviewSections.s6}</p>
      <p>
        <span className='font-bold'>{chairpersonReview.q6_1}</span> -{" "}
        {ReviewQuestions.q6_1}
      </p>
      <p>
        <span className='font-bold'>{chairpersonReview.q6_2}</span> -{" "}
        {ReviewQuestions.q6_2}
      </p>
      <p>
        <span className='font-bold'>{chairpersonReview.q6_3}</span> -{" "}
        {ReviewQuestions.q6_3}
      </p>
      <p>
        <span className='font-bold'>{chairpersonReview.q6_4}</span> -{" "}
        {ReviewQuestions.q6_4}
      </p>
      <p>
        <span className='font-bold'>{chairpersonReview.q6_5}</span> -{" "}
        {ReviewQuestions.q6_5}
      </p>

      <p className='font-bold'>{ReviewSections.s7}</p>
      <p>
        <span className='font-bold'>{chairpersonReview.q7_1}</span> -{" "}
        {ReviewQuestions.q7_1}
      </p>
      <p>
        <span className='font-bold'>{chairpersonReview.q7_2}</span> -{" "}
        {ReviewQuestions.q7_3}
      </p>
      <p>
        <span className='font-bold'>{chairpersonReview.q7_3}</span> -{" "}
        {ReviewQuestions.q7_3}
      </p>
      <p>
        <span className='font-bold'>{chairpersonReview.q7_4}</span> -{" "}
        {ReviewQuestions.q7_4}
      </p>
      <p>
        <span className='font-bold'>{chairpersonReview.q7_5}</span> -{" "}
        {ReviewQuestions.q7_5}
      </p>

      <p className='font-bold'>{ReviewSections.s8}</p>
      <p>
        <span className='font-bold'>{chairpersonReview.q8_1}</span> -{" "}
        {ReviewQuestions.q8_1}
      </p>
      <p>
        <span className='font-bold'>{chairpersonReview.q8_2}</span> -{" "}
        {ReviewQuestions.q8_2}
      </p>
      <p>
        <span className='font-bold'>{chairpersonReview.q8_3}</span> -{" "}
        {ReviewQuestions.q8_3}
      </p>
    </CrudLayout>
  );
}
