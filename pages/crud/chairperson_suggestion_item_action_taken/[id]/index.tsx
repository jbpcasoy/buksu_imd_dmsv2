import CrudLayout from "@/components/CrudLayout";
import useChairpersonSuggestionItemActionTaken from "@/hooks/useChairpersonSuggestionItemActionTaken";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ChairpersonSuggestionItemActionTakenPage() {
  const router = useRouter();
  const ChairpersonSuggestionItemActionTakenId = router.query.id;
  const ChairpersonSuggestionItemActionTaken = useChairpersonSuggestionItemActionTaken({ id: ChairpersonSuggestionItemActionTakenId as string });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios.delete(`/api/chairperson_suggestion_item_action_taken/${ChairpersonSuggestionItemActionTakenId}`).then(() => {
      alert("ChairpersonSuggestionItemActionTaken deleted successfully.");
    }).catch(error => {
      alert(error.message)
    });
  };

  if (!ChairpersonSuggestionItemActionTaken) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>ChairpersonSuggestionItemActionTaken</h2>
        <div className='space-x-1'>
          <Link className='border rounded' href={`/crud/chairperson_suggestion_item_action_taken/${ChairpersonSuggestionItemActionTakenId}/edit`}>edit</Link>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {ChairpersonSuggestionItemActionTaken.id}</p>
      <p>createdAt: {new Date(ChairpersonSuggestionItemActionTaken.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(ChairpersonSuggestionItemActionTaken.updatedAt).toLocaleString()}</p>
      <p>chairpersonSuggestionItemId: {ChairpersonSuggestionItemActionTaken.chairpersonSuggestionItemId}</p>
      <p>value: {ChairpersonSuggestionItemActionTaken.value}</p>
    </CrudLayout>
  );
}
