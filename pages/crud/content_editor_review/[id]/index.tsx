import CrudLayout from "@/components/CrudLayout";
import useContentEditorReview from "@/hooks/useContentEditorReview";
import ReviewQuestions from "@/services/ReviewQuestions";
import ReviewSections from "@/services/ReviewSections";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function ContentEditorReviewPage() {
  const router = useRouter();
  const contentEditorReviewId = router.query.id;
  const contentEditorReview = useContentEditorReview({
    id: contentEditorReviewId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/content_editor_review/${contentEditorReviewId}`)
      .then(() => {
        alert("ContentEditorReview deleted successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!contentEditorReview) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>ContentEditorReview</h2>
        <div className='space-x-1'>
          <Link
            className='border rounded'
            href={`/crud/content_editor_review/${contentEditorReviewId}/edit`}
          >
            edit
          </Link>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {contentEditorReview.id}</p>
      <p>
        createdAt: {new Date(contentEditorReview.createdAt).toLocaleString()}
      </p>
      <p>
        updatedAt: {new Date(contentEditorReview.updatedAt).toLocaleString()}
      </p>
      <p>
        qAMISDepartmentEndorsementId:{" "}
        <Link
          href={`/crud/qamis_department_endorsement/${contentEditorReview.qAMISDepartmentEndorsementId}`}
          className='underline'
        >
          {contentEditorReview.qAMISDepartmentEndorsementId}
        </Link>
      </p>
      <p>
        cITLDirectorId:{" "}
        <Link
          href={`/crud/citl_director/${contentEditorReview.cITLDirectorId}`}
          className='underline'
        >
          {contentEditorReview.cITLDirectorId}
        </Link>
      </p>

      <p className='font-bold'>{ReviewSections.s1}</p>
      <p>
        <span className='font-bold'>{contentEditorReview.q1_1}</span> -{" "}
        {ReviewQuestions.q1_1}
      </p>
      <p>
        <span className='font-bold'>{contentEditorReview.q1_2}</span> -{" "}
        {ReviewQuestions.q1_2}
      </p>

      <p className='font-bold'>{ReviewSections.s2}</p>
      <p>
        <span className='font-bold'>{contentEditorReview.q2_1}</span> -{" "}
        {ReviewQuestions.q2_1}
      </p>
      <p>
        <span className='font-bold'>{contentEditorReview.q2_2}</span> -{" "}
        {ReviewQuestions.q2_2}
      </p>
      <p>
        <span className='font-bold'>{contentEditorReview.q2_3}</span> -{" "}
        {ReviewQuestions.q2_3}
      </p>
      <p>
        <span className='font-bold'>{contentEditorReview.q2_4}</span> -{" "}
        {ReviewQuestions.q2_4}
      </p>

      <p className='font-bold'>{ReviewSections.s3}</p>
      <p>
        <span className='font-bold'>{contentEditorReview.q3_1}</span> -{" "}
        {ReviewQuestions.q3_1}
      </p>

      <p className='font-bold'>{ReviewSections.s4}</p>
      <p>
        <span className='font-bold'>{contentEditorReview.q4_1}</span> -{" "}
        {ReviewQuestions.q4_1}
      </p>
      <p>
        <span className='font-bold'>{contentEditorReview.q4_2}</span> -{" "}
        {ReviewQuestions.q4_2}
      </p>
      <p>
        <span className='font-bold'>{contentEditorReview.q4_3}</span> -{" "}
        {ReviewQuestions.q4_3}
      </p>

      <p className='font-bold'>{ReviewSections.s5}</p>
      <p>
        <span className='font-bold'>{contentEditorReview.q5_1}</span> -{" "}
        {ReviewQuestions.q5_1}
      </p>
      <p>
        <span className='font-bold'>{contentEditorReview.q5_2}</span> -{" "}
        {ReviewQuestions.q5_2}
      </p>
      <p>
        <span className='font-bold'>{contentEditorReview.q5_3}</span> -{" "}
        {ReviewQuestions.q5_3}
      </p>
      <p>
        <span className='font-bold'>{contentEditorReview.q5_4}</span> -{" "}
        {ReviewQuestions.q5_4}
      </p>

      <p className='font-bold'>{ReviewSections.s6}</p>
      <p>
        <span className='font-bold'>{contentEditorReview.q6_1}</span> -{" "}
        {ReviewQuestions.q6_1}
      </p>
      <p>
        <span className='font-bold'>{contentEditorReview.q6_2}</span> -{" "}
        {ReviewQuestions.q6_2}
      </p>
      <p>
        <span className='font-bold'>{contentEditorReview.q6_3}</span> -{" "}
        {ReviewQuestions.q6_3}
      </p>
      <p>
        <span className='font-bold'>{contentEditorReview.q6_4}</span> -{" "}
        {ReviewQuestions.q6_4}
      </p>
      <p>
        <span className='font-bold'>{contentEditorReview.q6_5}</span> -{" "}
        {ReviewQuestions.q6_5}
      </p>

      <p className='font-bold'>{ReviewSections.s7}</p>
      <p>
        <span className='font-bold'>{contentEditorReview.q7_1}</span> -{" "}
        {ReviewQuestions.q7_1}
      </p>
      <p>
        <span className='font-bold'>{contentEditorReview.q7_2}</span> -{" "}
        {ReviewQuestions.q7_3}
      </p>
      <p>
        <span className='font-bold'>{contentEditorReview.q7_3}</span> -{" "}
        {ReviewQuestions.q7_3}
      </p>
      <p>
        <span className='font-bold'>{contentEditorReview.q7_4}</span> -{" "}
        {ReviewQuestions.q7_4}
      </p>
      <p>
        <span className='font-bold'>{contentEditorReview.q7_5}</span> -{" "}
        {ReviewQuestions.q7_5}
      </p>

      <p className='font-bold'>{ReviewSections.s8}</p>
      <p>
        <span className='font-bold'>{contentEditorReview.q8_1}</span> -{" "}
        {ReviewQuestions.q8_1}
      </p>
      <p>
        <span className='font-bold'>{contentEditorReview.q8_2}</span> -{" "}
        {ReviewQuestions.q8_2}
      </p>
      <p>
        <span className='font-bold'>{contentEditorReview.q8_3}</span> -{" "}
        {ReviewQuestions.q8_3}
      </p>
    </CrudLayout>
  );
}
