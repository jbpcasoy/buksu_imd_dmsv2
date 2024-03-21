import CrudLayout from "@/components/CrudLayout";
import useIDDSpecialistReview from "@/hooks/useIDDSpecialistReview";
import ReviewQuestions from "@/services/ReviewQuestions";
import ReviewSections from "@/services/ReviewSections";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function IDDSpecialistReviewPage() {
  const router = useRouter();
  const iDDSpecialistReviewId = router.query.id;
  const iDDSpecialistReview = useIDDSpecialistReview({
    id: iDDSpecialistReviewId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/idd_specialist_review/${iDDSpecialistReviewId}`)
      .then(() => {
        alert("IDDSpecialistReview has been deleted successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!iDDSpecialistReview) return null;

  return (
    <CrudLayout>
      <div className="flex">
        <h2 className="flex-1">IDDSpecialistReview</h2>
        <div className="space-x-1">
          <Link
            className="border rounded"
            href={`/crud/idd_specialist_review/${iDDSpecialistReviewId}/edit`}
          >
            edit
          </Link>
          <button className="border rounded" onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {iDDSpecialistReview.id}</p>
      <p>
        createdAt: {new Date(iDDSpecialistReview.createdAt).toLocaleString()}
      </p>
      <p>
        updatedAt: {new Date(iDDSpecialistReview.updatedAt).toLocaleString()}
      </p>
      <p>
        qAMISDepartmentEndorsementId:{" "}
        <Link
          href={`/crud/qamis_department_endorsement/${iDDSpecialistReview.qAMISDepartmentEndorsementId}`}
          className="underline"
        >
          {iDDSpecialistReview.qAMISDepartmentEndorsementId}
        </Link>
      </p>
      <p>
        iDDCoordinatorId:{" "}
        <Link
          href={`/crud/idd_coordinator/${iDDSpecialistReview.iDDCoordinatorId}`}
          className="underline"
        >
          {iDDSpecialistReview.iDDCoordinatorId}
        </Link>
      </p>

      <p className="font-bold">{ReviewSections.s1}</p>
      <p>
        <span className="font-bold">{iDDSpecialistReview.q1_1}</span> -{" "}
        {ReviewQuestions.q1_1}
      </p>
      <p>
        <span className="font-bold">{iDDSpecialistReview.q1_2}</span> -{" "}
        {ReviewQuestions.q1_2}
      </p>

      <p className="font-bold">{ReviewSections.s2}</p>
      <p>
        <span className="font-bold">{iDDSpecialistReview.q2_1}</span> -{" "}
        {ReviewQuestions.q2_1}
      </p>
      <p>
        <span className="font-bold">{iDDSpecialistReview.q2_2}</span> -{" "}
        {ReviewQuestions.q2_2}
      </p>
      <p>
        <span className="font-bold">{iDDSpecialistReview.q2_3}</span> -{" "}
        {ReviewQuestions.q2_3}
      </p>
      <p>
        <span className="font-bold">{iDDSpecialistReview.q2_4}</span> -{" "}
        {ReviewQuestions.q2_4}
      </p>

      <p className="font-bold">{ReviewSections.s3}</p>
      <p>
        <span className="font-bold">{iDDSpecialistReview.q3_1}</span> -{" "}
        {ReviewQuestions.q3_1}
      </p>

      <p className="font-bold">{ReviewSections.s4}</p>
      <p>
        <span className="font-bold">{iDDSpecialistReview.q4_1}</span> -{" "}
        {ReviewQuestions.q4_1}
      </p>
      <p>
        <span className="font-bold">{iDDSpecialistReview.q4_2}</span> -{" "}
        {ReviewQuestions.q4_2}
      </p>
      <p>
        <span className="font-bold">{iDDSpecialistReview.q4_3}</span> -{" "}
        {ReviewQuestions.q4_3}
      </p>

      <p className="font-bold">{ReviewSections.s5}</p>
      <p>
        <span className="font-bold">{iDDSpecialistReview.q5_1}</span> -{" "}
        {ReviewQuestions.q5_1}
      </p>
      <p>
        <span className="font-bold">{iDDSpecialistReview.q5_2}</span> -{" "}
        {ReviewQuestions.q5_2}
      </p>
      <p>
        <span className="font-bold">{iDDSpecialistReview.q5_3}</span> -{" "}
        {ReviewQuestions.q5_3}
      </p>
      <p>
        <span className="font-bold">{iDDSpecialistReview.q5_4}</span> -{" "}
        {ReviewQuestions.q5_4}
      </p>

      <p className="font-bold">{ReviewSections.s6}</p>
      <p>
        <span className="font-bold">{iDDSpecialistReview.q6_1}</span> -{" "}
        {ReviewQuestions.q6_1}
      </p>
      <p>
        <span className="font-bold">{iDDSpecialistReview.q6_2}</span> -{" "}
        {ReviewQuestions.q6_2}
      </p>
      <p>
        <span className="font-bold">{iDDSpecialistReview.q6_3}</span> -{" "}
        {ReviewQuestions.q6_3}
      </p>
      <p>
        <span className="font-bold">{iDDSpecialistReview.q6_4}</span> -{" "}
        {ReviewQuestions.q6_4}
      </p>
      <p>
        <span className="font-bold">{iDDSpecialistReview.q6_5}</span> -{" "}
        {ReviewQuestions.q6_5}
      </p>

      <p className="font-bold">{ReviewSections.s7}</p>
      <p>
        <span className="font-bold">{iDDSpecialistReview.q7_1}</span> -{" "}
        {ReviewQuestions.q7_1}
      </p>
      <p>
        <span className="font-bold">{iDDSpecialistReview.q7_2}</span> -{" "}
        {ReviewQuestions.q7_3}
      </p>
      <p>
        <span className="font-bold">{iDDSpecialistReview.q7_3}</span> -{" "}
        {ReviewQuestions.q7_3}
      </p>
      <p>
        <span className="font-bold">{iDDSpecialistReview.q7_4}</span> -{" "}
        {ReviewQuestions.q7_4}
      </p>
      <p>
        <span className="font-bold">{iDDSpecialistReview.q7_5}</span> -{" "}
        {ReviewQuestions.q7_5}
      </p>

      <p className="font-bold">{ReviewSections.s8}</p>
      <p>
        <span className="font-bold">{iDDSpecialistReview.q8_1}</span> -{" "}
        {ReviewQuestions.q8_1}
      </p>
      <p>
        <span className="font-bold">{iDDSpecialistReview.q8_2}</span> -{" "}
        {ReviewQuestions.q8_2}
      </p>
      <p>
        <span className="font-bold">{iDDSpecialistReview.q8_3}</span> -{" "}
        {ReviewQuestions.q8_3}
      </p>
    </CrudLayout>
  );
}
