import { QAMISSuggestionItem } from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export interface QAMISSuggestionItemProps {
  qAMISSuggestionItem: QAMISSuggestionItem;
}
export default function QAMISSuggestionItem({
  qAMISSuggestionItem,
}: QAMISSuggestionItemProps) {
  const router = useRouter();
  const handleDelete = () => {
    if (confirm("Are you sure? This action cannot be undone.")) {
      axios
        .delete(`/api/qamis_suggestion_item/${qAMISSuggestionItem.id}`)
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
      <p>suggestion: {qAMISSuggestionItem.suggestion}</p>
      <p>pageNumber: {qAMISSuggestionItem.pageNumber}</p>
      <p>remarks: {qAMISSuggestionItem.remarks}</p>
      <div className='space-x-1'>
        <Link
          className='border rounded'
          href={`/qamis_suggestion_item/${qAMISSuggestionItem.id}/edit`}
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
