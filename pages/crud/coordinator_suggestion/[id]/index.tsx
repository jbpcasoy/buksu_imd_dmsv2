import CrudLayout from "@/components/CrudLayout";
import useCoordinatorSuggestion from "@/hooks/useCoordinatorSuggestion";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function CoordinatorSuggestionPage() {
  const router = useRouter();
  const coordinatorSuggestionId = router.query.id;
  const coordinatorSuggestion = useCoordinatorSuggestion({
    id: coordinatorSuggestionId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/coordinator_suggestion/${coordinatorSuggestionId}`)
      .then(() => {
        alert("CoordinatorSuggestion has been deleted successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!coordinatorSuggestion) return null;

  return (
    <CrudLayout>
      <div className="flex">
        <h2 className="flex-1">CoordinatorSuggestion</h2>
        <div className="space-x-1">
          <button className="border rounded" onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {coordinatorSuggestion.id}</p>
      <p>
        createdAt: {new Date(coordinatorSuggestion.createdAt).toLocaleString()}
      </p>
      <p>
        updatedAt: {new Date(coordinatorSuggestion.updatedAt).toLocaleString()}
      </p>
      <p>
        coordinatorReviewId:{" "}
        <Link
          href={`/crud/coordinator_review/${coordinatorSuggestion.coordinatorReviewId}`}
          className="underline"
        >
          {coordinatorSuggestion.coordinatorReviewId}{" "}
        </Link>
      </p>
    </CrudLayout>
  );
}
