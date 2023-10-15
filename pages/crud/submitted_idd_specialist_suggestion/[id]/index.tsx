import CrudLayout from "@/components/CrudLayout";
import useSubmittedIDDSpecialistSuggestion from "@/hooks/useSubmittedIDDSpecialistSuggestion";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function SubmittedIDDSpecialistSuggestionPage() {
  const router = useRouter();
  const submittedIDDSpecialistSuggestionId = router.query.id;
  const submittedIDDSpecialistSuggestion = useSubmittedIDDSpecialistSuggestion({
    id: submittedIDDSpecialistSuggestionId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/submitted_idd_specialist_suggestion/${submittedIDDSpecialistSuggestionId}`)
      .then(() => {
        alert("SubmittedIDDSpecialistSuggestion deleted successfully.");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!submittedIDDSpecialistSuggestion) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>SubmittedIDDSpecialistSuggestion</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {submittedIDDSpecialistSuggestion.id}</p>
      <p>
        createdAt:{" "}
        {new Date(submittedIDDSpecialistSuggestion.createdAt).toLocaleString()}
      </p>
      <p>
        updatedAt:{" "}
        {new Date(submittedIDDSpecialistSuggestion.updatedAt).toLocaleString()}
      </p>
      <p>
        iDDSpecialistSuggestionId:{" "}
        <Link
          href={`/crud/idd_specialist_suggestion/${submittedIDDSpecialistSuggestion.iDDSpecialistSuggestionId}`}
          className='underline'
        >
          {submittedIDDSpecialistSuggestion.iDDSpecialistSuggestionId}
        </Link>
      </p>
    </CrudLayout>
  );
}
