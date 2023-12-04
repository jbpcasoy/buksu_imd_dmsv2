import CrudLayout from "@/components/CrudLayout";
import useIDDSpecialistSuggestion from "@/hooks/useIDDSpecialistSuggestion";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function IDDSpecialistSuggestionPage() {
  const router = useRouter();
  const iDDSpecialistSuggestionId = router.query.id;
  const iDDSpecialistSuggestion = useIDDSpecialistSuggestion({ id: iDDSpecialistSuggestionId as string });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/idd_specialist_suggestion/${iDDSpecialistSuggestionId}`)
      .then(() => {
        alert("IDDSpecialistSuggestion deleted successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!iDDSpecialistSuggestion) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>IDDSpecialistSuggestion</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {iDDSpecialistSuggestion.id}</p>
      <p>createdAt: {new Date(iDDSpecialistSuggestion.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(iDDSpecialistSuggestion.updatedAt).toLocaleString()}</p>
      <p>
      iDDSpecialistReviewId:{" "}
        <Link
          href={`/crud/idd_specialist_review/${iDDSpecialistSuggestion.iDDSpecialistReviewId}`}
          className='underline'
        >
          {iDDSpecialistSuggestion.iDDSpecialistReviewId}{" "}
        </Link>
      </p>
    </CrudLayout>
  );
}
