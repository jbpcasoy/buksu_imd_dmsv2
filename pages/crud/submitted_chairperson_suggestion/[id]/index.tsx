import CrudLayout from "@/components/CrudLayout";
import useSubmittedChairpersonSuggestion from "@/hooks/useSubmittedChairpersonSuggestion";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function SubmittedChairpersonSuggestionPage() {
  const router = useRouter();
  const submittedChairpersonSuggestionId = router.query.id;
  const submittedChairpersonSuggestion = useSubmittedChairpersonSuggestion({
    id: submittedChairpersonSuggestionId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(
        `/api/submitted_chairperson_suggestion/${submittedChairpersonSuggestionId}`
      )
      .then(() => {
        alert("SubmittedChairpersonSuggestion deleted successfully.");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!submittedChairpersonSuggestion) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>SubmittedChairpersonSuggestion</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {submittedChairpersonSuggestion.id}</p>
      <p>
        createdAt:{" "}
        {new Date(submittedChairpersonSuggestion.createdAt).toLocaleString()}
      </p>
      <p>
        updatedAt:{" "}
        {new Date(submittedChairpersonSuggestion.updatedAt).toLocaleString()}
      </p>
      <p>
        chairpersonSuggestionId:{" "}
        <Link
          href={`/crud/chairperson_suggestion/${submittedChairpersonSuggestion.chairpersonSuggestionId}`}
          className='underline'
        >
          {submittedChairpersonSuggestion.chairpersonSuggestionId}
        </Link>
      </p>
    </CrudLayout>
  );
}
