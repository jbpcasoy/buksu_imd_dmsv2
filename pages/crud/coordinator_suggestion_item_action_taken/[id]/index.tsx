import CrudLayout from "@/components/CrudLayout";
import useCoordinatorSuggestionItemActionTaken from "@/hooks/useCoordinatorSuggestionItemActionTaken";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function CoordinatorSuggestionItemActionTakenPage() {
  const router = useRouter();
  const coordinatorSuggestionItemActionTakenId = router.query.id;
  const coordinatorSuggestionItemActionTaken =
    useCoordinatorSuggestionItemActionTaken({
      id: coordinatorSuggestionItemActionTakenId as string,
    });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(
        `/api/coordinator_suggestion_item_action_taken/${coordinatorSuggestionItemActionTakenId}`
      )
      .then(() => {
        alert("CoordinatorSuggestionItemActionTaken deleted successfully.");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  if (!coordinatorSuggestionItemActionTaken) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>CoordinatorSuggestionItemActionTaken</h2>
        <div className='space-x-1'>
          <Link
            className='border rounded'
            href={`/crud/coordinator_suggestion_item_action_taken/${coordinatorSuggestionItemActionTakenId}/edit`}
          >
            edit
          </Link>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {coordinatorSuggestionItemActionTaken.id}</p>
      <p>
        createdAt:{" "}
        {new Date(
          coordinatorSuggestionItemActionTaken.createdAt
        ).toLocaleString()}
      </p>
      <p>
        updatedAt:{" "}
        {new Date(
          coordinatorSuggestionItemActionTaken.updatedAt
        ).toLocaleString()}
      </p>
      <p>
        coordinatorSuggestionItemId:
        <Link
          href={`/crud/coordinator_suggestion_item/${coordinatorSuggestionItemActionTaken.coordinatorSuggestionItemId}`}
          className='underline'
        >
          {coordinatorSuggestionItemActionTaken.coordinatorSuggestionItemId}
        </Link>
      </p>
      <p>value: {coordinatorSuggestionItemActionTaken.value}</p>
    </CrudLayout>
  );
}
