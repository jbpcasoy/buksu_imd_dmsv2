import { CoordinatorSuggestionItem } from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export interface CoordinatorSuggestionItemProps {
  coordinatorSuggestionItem: CoordinatorSuggestionItem;
}
export default function CoordinatorSuggestionItem({
  coordinatorSuggestionItem,
}: CoordinatorSuggestionItemProps) {
  const router = useRouter();
  const handleDelete = () => {
    if (confirm("Are you sure? This action cannot be undone.")) {
      axios
        .delete(`/api/coordinator_suggestion_item/${coordinatorSuggestionItem.id}`)
        .then(() => {
          alert("Suggestion deleted successfully");
          router.reload();
        })
        .catch((error) => {
          console.error(error);
          alert("Failed to delete suggestion");
        });
    }
  };
  return (
    <div className='border rounded'>
      <p>suggestion: {coordinatorSuggestionItem.suggestion}</p>
      <p>pageNumber: {coordinatorSuggestionItem.pageNumber}</p>
      <p>remarks: {coordinatorSuggestionItem.remarks}</p>
      <div className='space-x-1'>
        <Link
          className='border rounded'
          href={`/coordinator_suggestion_item/${coordinatorSuggestionItem.id}/edit`}
        >
          edit
        </Link>
        <button className='border rounded' onClick={handleDelete}>
          delete
        </button>
      </div>
    </div>
  );
}
