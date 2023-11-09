import { ReturnedCITLRevisionSuggestionItem } from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export interface ReturnedCITLRevisionSuggestionItemProps {
  returnedCITLRevisionSuggestionItem: ReturnedCITLRevisionSuggestionItem;
}
export default function ReturnedCITLRevisionSuggestionItem({
  returnedCITLRevisionSuggestionItem,
}: ReturnedCITLRevisionSuggestionItemProps) {
  const router = useRouter();
  const handleDelete = () => {
    if (confirm("Are you sure? This action cannot be undone.")) {
      axios
        .delete(
          `/api/returned_citl_revision_suggestion_item/${returnedCITLRevisionSuggestionItem.id}`
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
      <td>{returnedCITLRevisionSuggestionItem.id}</td>
      <td>{new Date(returnedCITLRevisionSuggestionItem.createdAt).toLocaleString()}</td>
      <td>{new Date(returnedCITLRevisionSuggestionItem.updatedAt).toLocaleString()}</td>
      <td>{returnedCITLRevisionSuggestionItem.suggestion}</td>
      <td>{returnedCITLRevisionSuggestionItem.pageNumber}</td>
      <td>{returnedCITLRevisionSuggestionItem.actionTaken}</td>
      <td>{returnedCITLRevisionSuggestionItem.remarks}</td>
      <td>{returnedCITLRevisionSuggestionItem.returnedCITLRevisionId}</td>
      <td className=''>
        <Link
          className='border rounded'
          href={`/returned_citl_revision_suggestion_item/${returnedCITLRevisionSuggestionItem.id}/edit`}
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
