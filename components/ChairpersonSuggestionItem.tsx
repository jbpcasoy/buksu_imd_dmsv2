import { ChairpersonSuggestionItem } from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export interface ChairpersonSuggestionItemProps {
  chairpersonSuggestionItem: ChairpersonSuggestionItem;
}
export default function ChairpersonSuggestionItem({
  chairpersonSuggestionItem,
}: ChairpersonSuggestionItemProps) {
  const router = useRouter();
  const handleDelete = () => {
    if (confirm("Are you sure? This action cannot be undone.")) {
      axios
        .delete(`/api/chairperson_suggestion_item/${chairpersonSuggestionItem.id}`)
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
      <p>suggestion: {chairpersonSuggestionItem.suggestion}</p>
      <p>pageNumber: {chairpersonSuggestionItem.pageNumber}</p>
      <p>remarks: {chairpersonSuggestionItem.remarks}</p>
      <div className='space-x-1'>
        <Link
          className='border rounded'
          href={`/chairperson_suggestion_item/${chairpersonSuggestionItem.id}/edit`}
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
