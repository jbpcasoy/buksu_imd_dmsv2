import CrudLayout from "@/components/CrudLayout";
import useReturnedCITLRevisionSuggestionItem from "@/hooks/useReturnedCITLRevisionSuggestionItem";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ReturnedCITLRevisionSuggestionItemPage() {
  const router = useRouter();
  const returnedCITLRevisionSuggestionItemId = router.query.id;
  const returnedCITLRevisionSuggestionItem =
    useReturnedCITLRevisionSuggestionItem({
      id: returnedCITLRevisionSuggestionItemId as string,
    });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(
        `/api/returned_citl_revision_suggestion_item/${returnedCITLRevisionSuggestionItemId}`
      )
      .then(() => {
        alert(
          "ReturnedCITLRevisionSuggestionItem has been deleted successfully"
        );
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!returnedCITLRevisionSuggestionItem) return null;

  return (
    <CrudLayout>
      <div className="flex">
        <h2 className="flex-1">ReturnedCITLRevisionSuggestionItem</h2>
        <div className="space-x-1">
          <Link
            className="border rounded"
            href={`/crud/returned_citl_revision_suggestion_item/${returnedCITLRevisionSuggestionItemId}/edit`}
          >
            edit
          </Link>
          <button className="border rounded" onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {returnedCITLRevisionSuggestionItem.id}</p>
      <p>
        createdAt:{" "}
        {new Date(
          returnedCITLRevisionSuggestionItem.createdAt
        ).toLocaleString()}
      </p>
      <p>
        updatedAt:{" "}
        {new Date(
          returnedCITLRevisionSuggestionItem.updatedAt
        ).toLocaleString()}
      </p>
      <p>
        returnedCITLRevisionId:{" "}
        <Link
          href={`/crud/returned_citl_revision/${returnedCITLRevisionSuggestionItem.returnedCITLRevisionId}`}
          className="underline"
        >
          {returnedCITLRevisionSuggestionItem.returnedCITLRevisionId}
        </Link>
      </p>
      <p>suggestion: {returnedCITLRevisionSuggestionItem.suggestion}</p>
      <p>pageNumber: {returnedCITLRevisionSuggestionItem.pageNumber}</p>
      <p>remarks: {returnedCITLRevisionSuggestionItem.remarks}</p>
    </CrudLayout>
  );
}
