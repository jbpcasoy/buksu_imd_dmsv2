import CrudLayout from "@/components/CrudLayout";
import useSubmittedContentSpecialistSuggestion from "@/hooks/useSubmittedContentSpecialistSuggestion";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function SubmittedContentSpecialistSuggestionPage() {
  const router = useRouter();
  const submittedContentSpecialistSuggestionId = router.query.id;
  const submittedContentSpecialistSuggestion =
    useSubmittedContentSpecialistSuggestion({
      id: submittedContentSpecialistSuggestionId as string,
    });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(
        `/api/submitted_content_specialist_suggestion/${submittedContentSpecialistSuggestionId}`
      )
      .then(() => {
        alert(
          "SubmittedContentSpecialistSuggestion has been deleted successfully"
        );
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!submittedContentSpecialistSuggestion) return null;

  return (
    <CrudLayout>
      <div className="flex">
        <h2 className="flex-1">SubmittedContentSpecialistSuggestion</h2>
        <div className="space-x-1">
          <button className="border rounded" onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {submittedContentSpecialistSuggestion.id}</p>
      <p>
        createdAt:{" "}
        {new Date(
          submittedContentSpecialistSuggestion.createdAt
        ).toLocaleString()}
      </p>
      <p>
        updatedAt:{" "}
        {new Date(
          submittedContentSpecialistSuggestion.updatedAt
        ).toLocaleString()}
      </p>
      <p>
        contentSpecialistSuggestionId:{" "}
        <Link
          href={`/crud/content_specialist_suggestion/${submittedContentSpecialistSuggestion.contentSpecialistSuggestionId}`}
          className="underline"
        >
          {submittedContentSpecialistSuggestion.contentSpecialistSuggestionId}
        </Link>
      </p>
    </CrudLayout>
  );
}
