import CrudLayout from "@/components/CrudLayout";
import useReturnedCITLRevisionSuggestionItemActionTaken from "@/hooks/useReturnedCITLRevisionSuggestionItemActionTaken";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ReturnedCITLRevisionSuggestionItemActionTakenPage() {
  const router = useRouter();
  const returnedCITLRevisionSuggestionItemActionTakenId = router.query.id;
  const returnedCITLRevisionSuggestionItemActionTaken = useReturnedCITLRevisionSuggestionItemActionTaken({
    id: returnedCITLRevisionSuggestionItemActionTakenId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(
        `/api/returned_citl_revision_suggestion_item_action_taken/${returnedCITLRevisionSuggestionItemActionTakenId}`
      )
      .then(() => {
        alert("ReturnedCITLRevisionSuggestionItemActionTaken has been deleted successfully");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  if (!returnedCITLRevisionSuggestionItemActionTaken) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>ReturnedCITLRevisionSuggestionItemActionTaken</h2>
        <div className='space-x-1'>
          <Link
            className='border rounded'
            href={`/crud/returned_citl_revision_suggestion_item_action_taken/${returnedCITLRevisionSuggestionItemActionTakenId}/edit`}
          >
            edit
          </Link>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {returnedCITLRevisionSuggestionItemActionTaken.id}</p>
      <p>
        createdAt:{" "}
        {new Date(returnedCITLRevisionSuggestionItemActionTaken.createdAt).toLocaleString()}
      </p>
      <p>
        updatedAt:{" "}
        {new Date(returnedCITLRevisionSuggestionItemActionTaken.updatedAt).toLocaleString()}
      </p>
      <p>
        returnedCITLRevisionSuggestionItemId:
        <Link
          href={`/crud/returned_citl_revision_suggestion_item/${returnedCITLRevisionSuggestionItemActionTaken.returnedCITLRevisionSuggestionItemId}`}
          className='underline'
        >
          {returnedCITLRevisionSuggestionItemActionTaken.returnedCITLRevisionSuggestionItemId}
        </Link>
      </p>
      <p>value: {returnedCITLRevisionSuggestionItemActionTaken.value}</p>
    </CrudLayout>
  );
}
