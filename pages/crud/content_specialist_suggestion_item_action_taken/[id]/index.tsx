import CrudLayout from "@/components/CrudLayout";
import useContentSpecialistSuggestionItemActionTaken from "@/hooks/useContentSpecialistSuggestionItemActionTaken";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ContentSpecialistSuggestionItemActionTakenPage() {
  const router = useRouter();
  const contentSpecialistSuggestionItemActionTakenId = router.query.id;
  const contentSpecialistSuggestionItemActionTaken =
    useContentSpecialistSuggestionItemActionTaken({
      id: contentSpecialistSuggestionItemActionTakenId as string,
    });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(
        `/api/content_specialist_suggestion_item_action_taken/${contentSpecialistSuggestionItemActionTakenId}`
      )
      .then(() => {
        alert("ContentSpecialistSuggestionItemActionTaken deleted successfully.");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  if (!contentSpecialistSuggestionItemActionTaken) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>ContentSpecialistSuggestionItemActionTaken</h2>
        <div className='space-x-1'>
          <Link
            className='border rounded'
            href={`/crud/content_specialist_suggestion_item_action_taken/${contentSpecialistSuggestionItemActionTakenId}/edit`}
          >
            edit
          </Link>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {contentSpecialistSuggestionItemActionTaken.id}</p>
      <p>
        createdAt:{" "}
        {new Date(
          contentSpecialistSuggestionItemActionTaken.createdAt
        ).toLocaleString()}
      </p>
      <p>
        updatedAt:{" "}
        {new Date(
          contentSpecialistSuggestionItemActionTaken.updatedAt
        ).toLocaleString()}
      </p>
      <p>
        contentSpecialistSuggestionItemId:
        <Link
          href={`/crud/content_specialist_suggestion_item/${contentSpecialistSuggestionItemActionTaken.contentSpecialistSuggestionItemId}`}
          className='underline'
        >
          {contentSpecialistSuggestionItemActionTaken.contentSpecialistSuggestionItemId}
        </Link>
      </p>
      <p>value: {contentSpecialistSuggestionItemActionTaken.value}</p>
    </CrudLayout>
  );
}
