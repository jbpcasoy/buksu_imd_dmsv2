import CrudLayout from "@/components/CrudLayout";
import useChairpersonSuggestion from "@/hooks/useChairpersonSuggestion";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ChairpersonSuggestionPage() {
  const router = useRouter();
  const chairpersonSuggestionId = router.query.id;
  const chairpersonSuggestion = useChairpersonSuggestion({ id: chairpersonSuggestionId as string });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/chairperson_suggestion/${chairpersonSuggestionId}`)
      .then(() => {
        alert("ChairpersonSuggestion has been deleted successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!chairpersonSuggestion) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>ChairpersonSuggestion</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {chairpersonSuggestion.id}</p>
      <p>createdAt: {new Date(chairpersonSuggestion.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(chairpersonSuggestion.updatedAt).toLocaleString()}</p>
      <p>
        chairpersonReviewId:{" "}
        <Link
          href={`/crud/chairperson_review/${chairpersonSuggestion.chairpersonReviewId}`}
          className='underline'
        >
          {chairpersonSuggestion.chairpersonReviewId}{" "}
        </Link>
      </p>
    </CrudLayout>
  );
}
