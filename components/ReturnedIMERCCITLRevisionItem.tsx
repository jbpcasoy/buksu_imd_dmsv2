import { ReturnedIMERCCITLRevisionSuggestionItem } from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export interface ReturnedIMERCCITLRevisionSuggestionItemProps {
  returnedIMERCCITLRevisionSuggestionItem: ReturnedIMERCCITLRevisionSuggestionItem;
}
export default function ReturnedIMERCCITLRevisionSuggestionItem({
  returnedIMERCCITLRevisionSuggestionItem,
}: ReturnedIMERCCITLRevisionSuggestionItemProps) {
  const router = useRouter();
  const handleDelete = () => {
    if (confirm("Are you sure? This action cannot be undone.")) {
      axios
        .delete(
          `/api/returned_imerc_citl_revision_suggestion_item/${returnedIMERCCITLRevisionSuggestionItem.id}`
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
      <td>{returnedIMERCCITLRevisionSuggestionItem.id}</td>
      <td>{new Date(returnedIMERCCITLRevisionSuggestionItem.createdAt).toLocaleString()}</td>
      <td>{new Date(returnedIMERCCITLRevisionSuggestionItem.updatedAt).toLocaleString()}</td>
      <td>{returnedIMERCCITLRevisionSuggestionItem.suggestion}</td>
      <td>{returnedIMERCCITLRevisionSuggestionItem.pageNumber}</td>
      <td>{returnedIMERCCITLRevisionSuggestionItem.actionTaken}</td>
      <td>{returnedIMERCCITLRevisionSuggestionItem.remarks}</td>
      <td>{returnedIMERCCITLRevisionSuggestionItem.returnedIMERCCITLRevisionId}</td>
      <td className=''>
        <Link
          className='border rounded'
          href={`/returned_imerc_citl_revision_suggestion_item/${returnedIMERCCITLRevisionSuggestionItem.id}/edit`}
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
