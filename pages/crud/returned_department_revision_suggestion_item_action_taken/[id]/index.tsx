import CrudLayout from "@/components/CrudLayout";
import useReturnedDepartmentRevisionSuggestionItemActionTaken from "@/hooks/useReturnedDepartmentRevisionSuggestionItemActionTaken";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ReturnedDepartmentRevisionSuggestionItemActionTakenPage() {
  const router = useRouter();
  const returnedDepartmentRevisionSuggestionItemActionTakenId = router.query.id;
  const returnedDepartmentRevisionSuggestionItemActionTaken = useReturnedDepartmentRevisionSuggestionItemActionTaken({
    id: returnedDepartmentRevisionSuggestionItemActionTakenId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(
        `/api/returned_department_revision_suggestion_item_action_taken/${returnedDepartmentRevisionSuggestionItemActionTakenId}`
      )
      .then(() => {
        alert("ReturnedDepartmentRevisionSuggestionItemActionTaken deleted successfully");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  if (!returnedDepartmentRevisionSuggestionItemActionTaken) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>ReturnedDepartmentRevisionSuggestionItemActionTaken</h2>
        <div className='space-x-1'>
          <Link
            className='border rounded'
            href={`/crud/returned_department_revision_suggestion_item_action_taken/${returnedDepartmentRevisionSuggestionItemActionTakenId}/edit`}
          >
            edit
          </Link>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {returnedDepartmentRevisionSuggestionItemActionTaken.id}</p>
      <p>
        createdAt:{" "}
        {new Date(returnedDepartmentRevisionSuggestionItemActionTaken.createdAt).toLocaleString()}
      </p>
      <p>
        updatedAt:{" "}
        {new Date(returnedDepartmentRevisionSuggestionItemActionTaken.updatedAt).toLocaleString()}
      </p>
      <p>
        returnedDepartmentRevisionSuggestionItemId:
        <Link
          href={`/crud/returned_department_revision_suggestion_item/${returnedDepartmentRevisionSuggestionItemActionTaken.returnedDepartmentRevisionSuggestionItemId}`}
          className='underline'
        >
          {returnedDepartmentRevisionSuggestionItemActionTaken.returnedDepartmentRevisionSuggestionItemId}
        </Link>
      </p>
      <p>value: {returnedDepartmentRevisionSuggestionItemActionTaken.value}</p>
    </CrudLayout>
  );
}
