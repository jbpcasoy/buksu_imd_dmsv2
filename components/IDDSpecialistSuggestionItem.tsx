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
        .delete(
          `/api/idd_specialist_suggestion_item/${iDDSpecialistSuggestionItem.id}`
        )
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
    <tr className=''>
      <td>{iDDSpecialistSuggestionItem.id}</td>
      <td>
        {new Date(iDDSpecialistSuggestionItem.createdAt).toLocaleString()}
      </td>
      <td>
        {new Date(iDDSpecialistSuggestionItem.updatedAt).toLocaleString()}
      </td>
      <td>{iDDSpecialistSuggestionItem.suggestion}</td>
      <td>{iDDSpecialistSuggestionItem.pageNumber}</td>
      <td>{iDDSpecialistSuggestionItem.actionTaken}</td>
      <td>{iDDSpecialistSuggestionItem.remarks}</td>
      <td>{iDDSpecialistSuggestionItem.iDDSpecialistSuggestionId}</td>
      <td className=''>
        <Link
          className='border rounded'
          href={`/idd_specialist_suggestion_item/${iDDSpecialistSuggestionItem.id}/edit`}
        >
          edit
        </Link>
        <button className='border rounded' onClick={handleDelete}>
          delete
        </button>
      </td>
    </tr>
  );
}
