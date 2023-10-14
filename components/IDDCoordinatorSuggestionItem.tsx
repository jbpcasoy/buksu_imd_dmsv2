import { IDDCoordinatorSuggestionItem } from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export interface IDDCoordinatorSuggestionItemProps {
  iDDCoordinatorSuggestionItem: IDDCoordinatorSuggestionItem;
}
export default function IDDCoordinatorSuggestionItem({
  iDDCoordinatorSuggestionItem,
}: IDDCoordinatorSuggestionItemProps) {
  const router = useRouter();
  const handleDelete = () => {
    if (confirm("Are you sure? This action cannot be undone.")) {
      axios
        .delete(`/api/idd_coordinator_suggestion_item/${iDDCoordinatorSuggestionItem.id}`)
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
      <p>suggestion: {iDDCoordinatorSuggestionItem.suggestion}</p>
      <p>pageNumber: {iDDCoordinatorSuggestionItem.pageNumber}</p>
      <p>remarks: {iDDCoordinatorSuggestionItem.remarks}</p>
      <div className='space-x-1'>
        <Link
          className='border rounded'
          href={`/idd_coordinator_suggestion_item/${iDDCoordinatorSuggestionItem.id}/edit`}
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
