import { IDDSpecialistSuggestionItem } from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export interface IDDSpecialistSuggestionItemProps {
  iDDSpecialistSuggestionItem: IDDSpecialistSuggestionItem;
}
export default function IDDSpecialistSuggestionItem({
  iDDSpecialistSuggestionItem,
}: IDDSpecialistSuggestionItemProps) {
  const router = useRouter();
  const handleDelete = () => {
    if (confirm("Are you sure? This action cannot be undone.")) {
      axios
        .delete(`/api/idd_specialist_suggestion_item/${iDDSpecialistSuggestionItem.id}`)
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
      <p>suggestion: {iDDSpecialistSuggestionItem.suggestion}</p>
      <p>pageNumber: {iDDSpecialistSuggestionItem.pageNumber}</p>
      <p>remarks: {iDDSpecialistSuggestionItem.remarks}</p>
      <div className='space-x-1'>
        <Link
          className='border rounded'
          href={`/idd_specialist_suggestion_item/${iDDSpecialistSuggestionItem.id}/edit`}
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
