import CrudLayout from "@/components/CrudLayout";
import useSubmittedCoordinatorSuggestion from "@/hooks/useSubmittedCoordinatorSuggestion";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function SubmittedCoordinatorSuggestionPage() {
  const router = useRouter();
  const submittedCoordinatorSuggestionId = router.query.id;
  const submittedCoordinatorSuggestion = useSubmittedCoordinatorSuggestion({
    id: submittedCoordinatorSuggestionId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(
        `/api/submitted_coordinator_suggestion/${submittedCoordinatorSuggestionId}`
      )
      .then(() => {
        alert("SubmittedCoordinatorSuggestion has been deleted successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!submittedCoordinatorSuggestion) return null;

  return (
    <CrudLayout>
      <div className="flex">
        <h2 className="flex-1">SubmittedCoordinatorSuggestion</h2>
        <div className="space-x-1">
          <button className="border rounded" onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {submittedCoordinatorSuggestion.id}</p>
      <p>
        createdAt:{" "}
        {new Date(submittedCoordinatorSuggestion.createdAt).toLocaleString()}
      </p>
      <p>
        updatedAt:{" "}
        {new Date(submittedCoordinatorSuggestion.updatedAt).toLocaleString()}
      </p>
      <p>
        coordinatorSuggestionId:{" "}
        <Link
          href={`/crud/coordinator_suggestion/${submittedCoordinatorSuggestion.coordinatorSuggestionId}`}
          className="underline"
        >
          {submittedCoordinatorSuggestion.coordinatorSuggestionId}
        </Link>
      </p>
    </CrudLayout>
  );
}
