import CrudLayout from "@/components/CrudLayout";
import useSubmittedQAMISSuggestion from "@/hooks/useSubmittedQAMISSuggestion";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function SubmittedQAMISSuggestionPage() {
  const router = useRouter();
  const submittedQAMISSuggestionId = router.query.id;
  const submittedQAMISSuggestion = useSubmittedQAMISSuggestion({
    id: submittedQAMISSuggestionId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(
        `/api/submitted_qamis_suggestion/${submittedQAMISSuggestionId}`
      )
      .then(() => {
        alert("SubmittedQAMISSuggestion has been deleted successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!submittedQAMISSuggestion) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>SubmittedQAMISSuggestion</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {submittedQAMISSuggestion.id}</p>
      <p>
        createdAt:{" "}
        {new Date(submittedQAMISSuggestion.createdAt).toLocaleString()}
      </p>
      <p>
        updatedAt:{" "}
        {new Date(submittedQAMISSuggestion.updatedAt).toLocaleString()}
      </p>
      <p>
        qAMISSuggestionId:{" "}
        <Link
          href={`/crud/qamis_suggestion/${submittedQAMISSuggestion.qAMISSuggestionId}`}
          className='underline'
        >
          {submittedQAMISSuggestion.qAMISSuggestionId}
        </Link>
      </p>
    </CrudLayout>
  );
}
