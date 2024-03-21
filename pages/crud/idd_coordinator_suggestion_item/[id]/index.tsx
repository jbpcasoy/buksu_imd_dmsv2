import CrudLayout from "@/components/CrudLayout";
import useIDDCoordinatorSuggestionItem from "@/hooks/useIDDCoordinatorSuggestionItem";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function IDDCoordinatorSuggestionItemPage() {
  const router = useRouter();
  const iDDCoordinatorSuggestionItemId = router.query.id;
  const iDDCoordinatorSuggestionItem = useIDDCoordinatorSuggestionItem({
    id: iDDCoordinatorSuggestionItemId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(
        `/api/idd_coordinator_suggestion_item/${iDDCoordinatorSuggestionItemId}`
      )
      .then(() => {
        alert("IDDCoordinatorSuggestionItem has been deleted successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!iDDCoordinatorSuggestionItem) return null;

  return (
    <CrudLayout>
      <div className="flex">
        <h2 className="flex-1">IDDCoordinatorSuggestionItem</h2>
        <div className="space-x-1">
          <Link
            className="border rounded"
            href={`/crud/idd_coordinator_suggestion_item/${iDDCoordinatorSuggestionItemId}/edit`}
          >
            edit
          </Link>
          <button className="border rounded" onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {iDDCoordinatorSuggestionItem.id}</p>
      <p>
        createdAt:{" "}
        {new Date(iDDCoordinatorSuggestionItem.createdAt).toLocaleString()}
      </p>
      <p>
        updatedAt:{" "}
        {new Date(iDDCoordinatorSuggestionItem.updatedAt).toLocaleString()}
      </p>
      <p>
        iDDCoordinatorSuggestionId:{" "}
        <Link
          href={`/crud/idd_coordinator_suggestion/${iDDCoordinatorSuggestionItem.iDDCoordinatorSuggestionId}`}
          className="underline"
        >
          {iDDCoordinatorSuggestionItem.iDDCoordinatorSuggestionId}
        </Link>
      </p>
      <p>suggestion: {iDDCoordinatorSuggestionItem.suggestion}</p>
      <p>pageNumber: {iDDCoordinatorSuggestionItem.pageNumber}</p>
      <p>remarks: {iDDCoordinatorSuggestionItem.remarks}</p>
    </CrudLayout>
  );
}
