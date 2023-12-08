import CrudLayout from "@/components/CrudLayout";
import useIDDSpecialistSuggestionItemActionTaken from "@/hooks/useIDDSpecialistSuggestionItemActionTaken";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function IDDSpecialistSuggestionItemActionTakenPage() {
  const router = useRouter();
  const iDDSpecialistSuggestionItemActionTakenId = router.query.id;
  const iDDSpecialistSuggestionItemActionTaken =
    useIDDSpecialistSuggestionItemActionTaken({
      id: iDDSpecialistSuggestionItemActionTakenId as string,
    });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(
        `/api/idd_specialist_suggestion_item_action_taken/${iDDSpecialistSuggestionItemActionTakenId}`
      )
      .then(() => {
        alert("IDDSpecialistSuggestionItemActionTaken has been deleted successfully");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  if (!iDDSpecialistSuggestionItemActionTaken) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>IDDSpecialistSuggestionItemActionTaken</h2>
        <div className='space-x-1'>
          <Link
            className='border rounded'
            href={`/crud/idd_specialist_suggestion_item_action_taken/${iDDSpecialistSuggestionItemActionTakenId}/edit`}
          >
            edit
          </Link>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {iDDSpecialistSuggestionItemActionTaken.id}</p>
      <p>
        createdAt:{" "}
        {new Date(
          iDDSpecialistSuggestionItemActionTaken.createdAt
        ).toLocaleString()}
      </p>
      <p>
        updatedAt:{" "}
        {new Date(
          iDDSpecialistSuggestionItemActionTaken.updatedAt
        ).toLocaleString()}
      </p>
      <p>
        iDDSpecialistSuggestionItemId:
        <Link
          href={`/crud/idd_specialist_suggestion_item/${iDDSpecialistSuggestionItemActionTaken.iDDSpecialistSuggestionItemId}`}
          className='underline'
        >
          {iDDSpecialistSuggestionItemActionTaken.iDDSpecialistSuggestionItemId}
        </Link>
      </p>
      <p>value: {iDDSpecialistSuggestionItemActionTaken.value}</p>
    </CrudLayout>
  );
}
