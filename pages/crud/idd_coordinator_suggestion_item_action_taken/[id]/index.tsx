import CrudLayout from "@/components/CrudLayout";
import useIDDCoordinatorSuggestionItemActionTaken from "@/hooks/useIDDCoordinatorSuggestionItemActionTaken";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function IDDCoordinatorSuggestionItemActionTakenPage() {
  const router = useRouter();
  const iDDCoordinatorSuggestionItemActionTakenId = router.query.id;
  const iDDCoordinatorSuggestionItemActionTaken =
    useIDDCoordinatorSuggestionItemActionTaken({
      id: iDDCoordinatorSuggestionItemActionTakenId as string,
    });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(
        `/api/idd_coordinator_suggestion_item_action_taken/${iDDCoordinatorSuggestionItemActionTakenId}`
      )
      .then(() => {
        alert("IDDCoordinatorSuggestionItemActionTaken has been deleted successfully");
      })
      .catch((error) => {
        alert(error.response?.data?.error?.message);
      });
  };

  if (!iDDCoordinatorSuggestionItemActionTaken) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>IDDCoordinatorSuggestionItemActionTaken</h2>
        <div className='space-x-1'>
          <Link
            className='border rounded'
            href={`/crud/idd_coordinator_suggestion_item_action_taken/${iDDCoordinatorSuggestionItemActionTakenId}/edit`}
          >
            edit
          </Link>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {iDDCoordinatorSuggestionItemActionTaken.id}</p>
      <p>
        createdAt:{" "}
        {new Date(
          iDDCoordinatorSuggestionItemActionTaken.createdAt
        ).toLocaleString()}
      </p>
      <p>
        updatedAt:{" "}
        {new Date(
          iDDCoordinatorSuggestionItemActionTaken.updatedAt
        ).toLocaleString()}
      </p>
      <p>
        iDDCoordinatorSuggestionItemId:
        <Link
          href={`/crud/idd_coordinator_suggestion_item/${iDDCoordinatorSuggestionItemActionTaken.iDDCoordinatorSuggestionItemId}`}
          className='underline'
        >
          {iDDCoordinatorSuggestionItemActionTaken.iDDCoordinatorSuggestionItemId}
        </Link>
      </p>
      <p>value: {iDDCoordinatorSuggestionItemActionTaken.value}</p>
    </CrudLayout>
  );
}
