import CrudLayout from "@/components/CrudLayout";
import useSubmittedIDDCoordinatorSuggestion from "@/hooks/useSubmittedIDDCoordinatorSuggestion";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function SubmittedIDDCoordinatorSuggestionPage() {
  const router = useRouter();
  const submittedIDDCoordinatorSuggestionId = router.query.id;
  const submittedIDDCoordinatorSuggestion = useSubmittedIDDCoordinatorSuggestion({
    id: submittedIDDCoordinatorSuggestionId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(
        `/api/submitted_idd_coordinator_suggestion/${submittedIDDCoordinatorSuggestionId}`
      )
      .then(() => {
        alert("SubmittedIDDCoordinatorSuggestion deleted successfully.");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!submittedIDDCoordinatorSuggestion) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>SubmittedIDDCoordinatorSuggestion</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {submittedIDDCoordinatorSuggestion.id}</p>
      <p>
        createdAt:{" "}
        {new Date(submittedIDDCoordinatorSuggestion.createdAt).toLocaleString()}
      </p>
      <p>
        updatedAt:{" "}
        {new Date(submittedIDDCoordinatorSuggestion.updatedAt).toLocaleString()}
      </p>
      <p>
        iDDCoordinatorSuggestionId:{" "}
        <Link
          href={`/crud/idd_coordinator_suggestion/${submittedIDDCoordinatorSuggestion.iDDCoordinatorSuggestionId}`}
          className='underline'
        >
          {submittedIDDCoordinatorSuggestion.iDDCoordinatorSuggestionId}
        </Link>
      </p>
    </CrudLayout>
  );
}
