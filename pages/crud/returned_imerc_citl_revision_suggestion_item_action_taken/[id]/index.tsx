import CrudLayout from "@/components/CrudLayout";
import useReturnedIMERCCITLRevisionSuggestionItemActionTaken from "@/hooks/useReturnedIMERCCITLRevisionSuggestionItemActionTaken";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ReturnedIMERCCITLRevisionSuggestionItemActionTakenPage() {
  const router = useRouter();
  const returnedIMERCCITLRevisionSuggestionItemActionTakenId = router.query.id;
  const returnedIMERCCITLRevisionSuggestionItemActionTaken =
    useReturnedIMERCCITLRevisionSuggestionItemActionTaken({
      id: returnedIMERCCITLRevisionSuggestionItemActionTakenId as string,
    });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(
        `/api/returned_imerc_citl_revision_suggestion_item_action_taken/${returnedIMERCCITLRevisionSuggestionItemActionTakenId}`
      )
      .then(() => {
        alert(
          "ReturnedIMERCCITLRevisionSuggestionItemActionTaken has been deleted successfully"
        );
      })
      .catch((error) => {
        alert(error.response?.data?.error?.message);
      });
  };

  if (!returnedIMERCCITLRevisionSuggestionItemActionTaken) return null;

  return (
    <CrudLayout>
      <div className="flex">
        <h2 className="flex-1">
          ReturnedIMERCCITLRevisionSuggestionItemActionTaken
        </h2>
        <div className="space-x-1">
          <Link
            className="border rounded"
            href={`/crud/returned_imerc_citl_revision_suggestion_item_action_taken/${returnedIMERCCITLRevisionSuggestionItemActionTakenId}/edit`}
          >
            edit
          </Link>
          <button className="border rounded" onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {returnedIMERCCITLRevisionSuggestionItemActionTaken.id}</p>
      <p>
        createdAt:{" "}
        {new Date(
          returnedIMERCCITLRevisionSuggestionItemActionTaken.createdAt
        ).toLocaleString()}
      </p>
      <p>
        updatedAt:{" "}
        {new Date(
          returnedIMERCCITLRevisionSuggestionItemActionTaken.updatedAt
        ).toLocaleString()}
      </p>
      <p>
        returnedIMERCCITLRevisionSuggestionItemId:
        <Link
          href={`/crud/returned_imerc_citl_revision_suggestion_item/${returnedIMERCCITLRevisionSuggestionItemActionTaken.returnedIMERCCITLRevisionSuggestionItemId}`}
          className="underline"
        >
          {
            returnedIMERCCITLRevisionSuggestionItemActionTaken.returnedIMERCCITLRevisionSuggestionItemId
          }
        </Link>
      </p>
      <p>value: {returnedIMERCCITLRevisionSuggestionItemActionTaken.value}</p>
    </CrudLayout>
  );
}
