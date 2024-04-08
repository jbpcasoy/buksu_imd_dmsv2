import CrudLayout from "@/components/CrudLayout";
import useSyllabusChairpersonReview from "@/hooks/useSyllabusChairpersonReview";
import ReviewSections from "@/services/ReviewSections";
import SyllabusReviewQuestions from "@/services/SyllabusReviewQuesstions";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function SyllabusChairpersonReviewPage() {
  const router = useRouter();
  const syllabusChairpersonReviewId = router.query.id;
  const syllabusChairpersonReview = useSyllabusChairpersonReview({
    id: syllabusChairpersonReviewId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/syllabus_chairperson_review/${syllabusChairpersonReviewId}`)
      .then(() => {
        alert("SyllabusChairpersonReview has been deleted successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!syllabusChairpersonReview) return null;

  return (
    <CrudLayout>
      <div className="flex">
        <h2 className="flex-1">SyllabusChairpersonReview</h2>
        <div className="space-x-1">
          <Link
            className="border rounded"
            href={`/crud/syllabus_chairperson_review/${syllabusChairpersonReviewId}/edit`}
          >
            edit
          </Link>
          <button className="border rounded" onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {syllabusChairpersonReview.id}</p>
      <p>
        createdAt:{" "}
        {new Date(syllabusChairpersonReview.createdAt).toLocaleString()}
      </p>
      <p>
        updatedAt:{" "}
        {new Date(syllabusChairpersonReview.updatedAt).toLocaleString()}
      </p>
      <p>
        syllabusDepartmentReviewId:{" "}
        <Link
          href={`/crud/syllabus_department_review/${syllabusChairpersonReview.syllabusDepartmentReviewId}`}
          className="underline"
        >
          {syllabusChairpersonReview.syllabusDepartmentReviewId}
        </Link>
      </p>

      <p className="font-bold">{ReviewSections.s1}</p>
      <p>
        <span className="font-bold">{syllabusChairpersonReview.q1_1}</span> -{" "}
        {SyllabusReviewQuestions.q1_1}
      </p>
      <p>
        <span className="font-bold">{syllabusChairpersonReview.q1_2}</span> -{" "}
        {SyllabusReviewQuestions.q1_2}
      </p>
      <p>
        <span className="font-bold">{syllabusChairpersonReview.q1_3}</span> -{" "}
        {SyllabusReviewQuestions.q1_3}
      </p>

      <p className="font-bold">{ReviewSections.s2}</p>
      <p>
        <span className="font-bold">{syllabusChairpersonReview.q2_1}</span> -{" "}
        {SyllabusReviewQuestions.q2_1}
      </p>
      <p>
        <span className="font-bold">{syllabusChairpersonReview.q2_2}</span> -{" "}
        {SyllabusReviewQuestions.q2_2}
      </p>
      <p>
        <span className="font-bold">{syllabusChairpersonReview.q2_3}</span> -{" "}
        {SyllabusReviewQuestions.q2_3}
      </p>
      <p>
        <span className="font-bold">{syllabusChairpersonReview.q2_4}</span> -{" "}
        {SyllabusReviewQuestions.q2_4}
      </p>

      <p className="font-bold">{ReviewSections.s3}</p>
      <p>
        <span className="font-bold">{syllabusChairpersonReview.q3_1}</span> -{" "}
        {SyllabusReviewQuestions.q3_1}
      </p>

      <p className="font-bold">{ReviewSections.s4}</p>
      <p>
        <span className="font-bold">{syllabusChairpersonReview.q4_1}</span> -{" "}
        {SyllabusReviewQuestions.q4_1}
      </p>
      <p>
        <span className="font-bold">{syllabusChairpersonReview.q4_2}</span> -{" "}
        {SyllabusReviewQuestions.q4_2}
      </p>
      <p>
        <span className="font-bold">{syllabusChairpersonReview.q4_3}</span> -{" "}
        {SyllabusReviewQuestions.q4_3}
      </p>

      <p className="font-bold">{ReviewSections.s5}</p>
      <p>
        <span className="font-bold">{syllabusChairpersonReview.q5_1}</span> -{" "}
        {SyllabusReviewQuestions.q5_1}
      </p>
      <p>
        <span className="font-bold">{syllabusChairpersonReview.q5_2}</span> -{" "}
        {SyllabusReviewQuestions.q5_2}
      </p>
      <p>
        <span className="font-bold">{syllabusChairpersonReview.q5_3}</span> -{" "}
        {SyllabusReviewQuestions.q5_3}
      </p>

      <p className="font-bold">{ReviewSections.s6}</p>
      <p>
        <span className="font-bold">{syllabusChairpersonReview.q6_1}</span> -{" "}
        {SyllabusReviewQuestions.q6_1}
      </p>
      <p>
        <span className="font-bold">{syllabusChairpersonReview.q6_2}</span> -{" "}
        {SyllabusReviewQuestions.q6_2}
      </p>
      <p>
        <span className="font-bold">{syllabusChairpersonReview.q6_3}</span> -{" "}
        {SyllabusReviewQuestions.q6_3}
      </p>
      <p>
        <span className="font-bold">{syllabusChairpersonReview.q6_4}</span> -{" "}
        {SyllabusReviewQuestions.q6_4}
      </p>
      <p>
        <span className="font-bold">{syllabusChairpersonReview.q6_5}</span> -{" "}
        {SyllabusReviewQuestions.q6_5}
      </p>

      <p className="font-bold">{ReviewSections.s7}</p>
      <p>
        <span className="font-bold">{syllabusChairpersonReview.q7_1}</span> -{" "}
        {SyllabusReviewQuestions.q7_1}
      </p>
      <p>
        <span className="font-bold">{syllabusChairpersonReview.q7_2}</span> -{" "}
        {SyllabusReviewQuestions.q7_3}
      </p>
      <p>
        <span className="font-bold">{syllabusChairpersonReview.q7_3}</span> -{" "}
        {SyllabusReviewQuestions.q7_3}
      </p>
      <p>
        <span className="font-bold">{syllabusChairpersonReview.q7_4}</span> -{" "}
        {SyllabusReviewQuestions.q7_4}
      </p>
      <p>
        <span className="font-bold">{syllabusChairpersonReview.q7_5}</span> -{" "}
        {SyllabusReviewQuestions.q7_5}
      </p>

      <p className="font-bold">{ReviewSections.s8}</p>
      <p>
        <span className="font-bold">{syllabusChairpersonReview.q8_1}</span> -{" "}
        {SyllabusReviewQuestions.q8_1}
      </p>
      <p>
        <span className="font-bold">{syllabusChairpersonReview.q8_2}</span> -{" "}
        {SyllabusReviewQuestions.q8_2}
      </p>
      <p>
        <span className="font-bold">{syllabusChairpersonReview.q8_3}</span> -{" "}
        {SyllabusReviewQuestions.q8_3}
      </p>
    </CrudLayout>
  );
}
