import CrudLayout from "@/components/CrudLayout";
import useReturnedDepartmentRevisionSuggestionItem from "@/hooks/useReturnedDepartmentRevisionSuggestionItem";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ReturnedDepartmentRevisionSuggestionItemPage() {
  const router = useRouter();
  const returnedDepartmentRevisionSuggestionItemId = router.query.id;
  const returnedDepartmentRevisionSuggestionItem =
    useReturnedDepartmentRevisionSuggestionItem({
      id: returnedDepartmentRevisionSuggestionItemId as string,
    });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(
        `/api/returned_department_revision_suggestion_item/${returnedDepartmentRevisionSuggestionItemId}`
      )
      .then(() => {
        alert(
          "ReturnedDepartmentRevisionSuggestionItem has been deleted successfully"
        );
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!returnedDepartmentRevisionSuggestionItem) return null;

  return (
    <CrudLayout>
      <div className="flex">
        <h2 className="flex-1">ReturnedDepartmentRevisionSuggestionItem</h2>
        <div className="space-x-1">
          <Link
            className="border rounded"
            href={`/crud/returned_department_revision_suggestion_item/${returnedDepartmentRevisionSuggestionItemId}/edit`}
          >
            edit
          </Link>
          <button className="border rounded" onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {returnedDepartmentRevisionSuggestionItem.id}</p>
      <p>
        createdAt:{" "}
        {new Date(
          returnedDepartmentRevisionSuggestionItem.createdAt
        ).toLocaleString()}
      </p>
      <p>
        updatedAt:{" "}
        {new Date(
          returnedDepartmentRevisionSuggestionItem.updatedAt
        ).toLocaleString()}
      </p>
      <p>
        returnedDepartmentRevisionId:{" "}
        <Link
          href={`/crud/returned_department_revision/${returnedDepartmentRevisionSuggestionItem.returnedDepartmentRevisionId}`}
          className="underline"
        >
          {
            returnedDepartmentRevisionSuggestionItem.returnedDepartmentRevisionId
          }
        </Link>
      </p>
      <p>suggestion: {returnedDepartmentRevisionSuggestionItem.suggestion}</p>
      <p>pageNumber: {returnedDepartmentRevisionSuggestionItem.pageNumber}</p>
      <p>remarks: {returnedDepartmentRevisionSuggestionItem.remarks}</p>
    </CrudLayout>
  );
}
