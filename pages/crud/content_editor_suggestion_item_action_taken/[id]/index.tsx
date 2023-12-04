import CrudLayout from "@/components/CrudLayout";
import useContentEditorSuggestionItemActionTaken from "@/hooks/useContentEditorSuggestionItemActionTaken";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ContentEditorSuggestionItemActionTakenPage() {
  const router = useRouter();
  const contentEditorSuggestionItemActionTakenId = router.query.id;
  const contentEditorSuggestionItemActionTaken =
    useContentEditorSuggestionItemActionTaken({
      id: contentEditorSuggestionItemActionTakenId as string,
    });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(
        `/api/content_editor_suggestion_item_action_taken/${contentEditorSuggestionItemActionTakenId}`
      )
      .then(() => {
        alert("ContentEditorSuggestionItemActionTaken deleted successfully");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  if (!contentEditorSuggestionItemActionTaken) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>ContentEditorSuggestionItemActionTaken</h2>
        <div className='space-x-1'>
          <Link
            className='border rounded'
            href={`/crud/content_editor_suggestion_item_action_taken/${contentEditorSuggestionItemActionTakenId}/edit`}
          >
            edit
          </Link>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {contentEditorSuggestionItemActionTaken.id}</p>
      <p>
        createdAt:{" "}
        {new Date(
          contentEditorSuggestionItemActionTaken.createdAt
        ).toLocaleString()}
      </p>
      <p>
        updatedAt:{" "}
        {new Date(
          contentEditorSuggestionItemActionTaken.updatedAt
        ).toLocaleString()}
      </p>
      <p>
        contentEditorSuggestionItemId:
        <Link
          href={`/crud/content_editor_suggestion_item/${contentEditorSuggestionItemActionTaken.contentEditorSuggestionItemId}`}
          className='underline'
        >
          {contentEditorSuggestionItemActionTaken.contentEditorSuggestionItemId}
        </Link>
      </p>
      <p>value: {contentEditorSuggestionItemActionTaken.value}</p>
    </CrudLayout>
  );
}
