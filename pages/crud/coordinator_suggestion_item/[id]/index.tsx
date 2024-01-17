import CrudLayout from "@/components/CrudLayout";
import useCoordinatorSuggestionItem from "@/hooks/useCoordinatorSuggestionItem";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function CoordinatorSuggestionItemPage() {
  const router = useRouter();
  const coordinatorSuggestionItemId = router.query.id;
  const coordinatorSuggestionItem = useCoordinatorSuggestionItem({
    id: coordinatorSuggestionItemId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/coordinator_suggestion_item/${coordinatorSuggestionItemId}`)
      .then(() => {
        alert("CoordinatorSuggestionItem has been deleted successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!coordinatorSuggestionItem) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>CoordinatorSuggestionItem</h2>
        <div className='space-x-1'>
          <Link
            className='border rounded'
            href={`/crud/coordinator_suggestion_item/${coordinatorSuggestionItemId}/edit`}
          >
            edit
          </Link>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {coordinatorSuggestionItem.id}</p>
      <p>
        createdAt: {new Date(coordinatorSuggestionItem.createdAt).toLocaleString()}
      </p>
      <p>
        updatedAt: {new Date(coordinatorSuggestionItem.updatedAt).toLocaleString()}
      </p>
      <p>
        coordinatorSuggestionId:{" "}
        <Link
          href={`/crud/coordinator_suggestion/${coordinatorSuggestionItem.coordinatorSuggestionId}`}
          className='underline'
        >
          {coordinatorSuggestionItem.coordinatorSuggestionId}
        </Link>
      </p>
      <p>suggestion: {coordinatorSuggestionItem.suggestion}</p>
      <p>pageNumber: {coordinatorSuggestionItem.pageNumber}</p>
      <p>remarks: {coordinatorSuggestionItem.remarks}</p>
    </CrudLayout>
  );
}
