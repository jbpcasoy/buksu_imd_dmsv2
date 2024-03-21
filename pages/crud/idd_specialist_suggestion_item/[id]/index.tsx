import CrudLayout from "@/components/CrudLayout";
import useIDDSpecialistSuggestionItem from "@/hooks/useIDDSpecialistSuggestionItem";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function IDDSpecialistSuggestionItemPage() {
  const router = useRouter();
  const iDDSpecialistSuggestionItemId = router.query.id;
  const iDDSpecialistSuggestionItem = useIDDSpecialistSuggestionItem({
    id: iDDSpecialistSuggestionItemId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(
        `/api/idd_specialist_suggestion_item/${iDDSpecialistSuggestionItemId}`
      )
      .then(() => {
        alert("IDDSpecialistSuggestionItem has been deleted successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!iDDSpecialistSuggestionItem) return null;

  return (
    <CrudLayout>
      <div className="flex">
        <h2 className="flex-1">IDDSpecialistSuggestionItem</h2>
        <div className="space-x-1">
          <Link
            className="border rounded"
            href={`/crud/idd_specialist_suggestion_item/${iDDSpecialistSuggestionItemId}/edit`}
          >
            edit
          </Link>
          <button className="border rounded" onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {iDDSpecialistSuggestionItem.id}</p>
      <p>
        createdAt:{" "}
        {new Date(iDDSpecialistSuggestionItem.createdAt).toLocaleString()}
      </p>
      <p>
        updatedAt:{" "}
        {new Date(iDDSpecialistSuggestionItem.updatedAt).toLocaleString()}
      </p>
      <p>
        iDDSpecialistSuggestionId:{" "}
        <Link
          href={`/crud/idd_specialist_suggestion/${iDDSpecialistSuggestionItem.iDDSpecialistSuggestionId}`}
          className="underline"
        >
          {iDDSpecialistSuggestionItem.iDDSpecialistSuggestionId}
        </Link>
      </p>
      <p>suggestion: {iDDSpecialistSuggestionItem.suggestion}</p>
      <p>pageNumber: {iDDSpecialistSuggestionItem.pageNumber}</p>
      <p>remarks: {iDDSpecialistSuggestionItem.remarks}</p>
    </CrudLayout>
  );
}
