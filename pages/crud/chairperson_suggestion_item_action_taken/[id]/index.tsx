import CrudLayout from "@/components/CrudLayout";
import useChairpersonSuggestionItemActionTaken from "@/hooks/useChairpersonSuggestionItemActionTaken";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ChairpersonSuggestionItemActionTakenPage() {
  const router = useRouter();
  const chairpersonSuggestionItemActionTakenId = router.query.id;
  const chairpersonSuggestionItemActionTaken =
    useChairpersonSuggestionItemActionTaken({
      id: chairpersonSuggestionItemActionTakenId as string,
    });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(
        `/api/chairperson_suggestion_item_action_taken/${chairpersonSuggestionItemActionTakenId}`
      )
      .then(() => {
        alert(
          "ChairpersonSuggestionItemActionTaken has been deleted successfully"
        );
      })
      .catch((error) => {
        alert(error.response?.data?.error?.message);
      });
  };

  if (!chairpersonSuggestionItemActionTaken) return null;

  return (
    <CrudLayout>
      <div className="flex">
        <h2 className="flex-1">ChairpersonSuggestionItemActionTaken</h2>
        <div className="space-x-1">
          <Link
            className="border rounded"
            href={`/crud/chairperson_suggestion_item_action_taken/${chairpersonSuggestionItemActionTakenId}/edit`}
          >
            edit
          </Link>
          <button className="border rounded" onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {chairpersonSuggestionItemActionTaken.id}</p>
      <p>
        createdAt:{" "}
        {new Date(
          chairpersonSuggestionItemActionTaken.createdAt
        ).toLocaleString()}
      </p>
      <p>
        updatedAt:{" "}
        {new Date(
          chairpersonSuggestionItemActionTaken.updatedAt
        ).toLocaleString()}
      </p>
      <p>
        chairpersonSuggestionItemId:
        <Link
          href={`/crud/chairperson_suggestion_item/${chairpersonSuggestionItemActionTaken.chairpersonSuggestionItemId}`}
          className="underline"
        >
          {chairpersonSuggestionItemActionTaken.chairpersonSuggestionItemId}
        </Link>
      </p>
      <p>value: {chairpersonSuggestionItemActionTaken.value}</p>
    </CrudLayout>
  );
}
