import { ReturnedDepartmentRevisionSuggestionItem } from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export interface ReturnedDepartmentRevisionSuggestionItemProps {
  returnedDepartmentRevisionSuggestionItem: ReturnedDepartmentRevisionSuggestionItem;
}
export default function ReturnedDepartmentRevisionSuggestionItem({
  returnedDepartmentRevisionSuggestionItem,
}: ReturnedDepartmentRevisionSuggestionItemProps) {
  const router = useRouter();
  const handleDelete = () => {
    if (confirm("Are you sure? This action cannot be undone.")) {
      axios
        .delete(
          `/api/returned_department_revision_suggestion_item/${returnedDepartmentRevisionSuggestionItem.id}`
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
      <td>{returnedDepartmentRevisionSuggestionItem.id}</td>
      <td>{new Date(returnedDepartmentRevisionSuggestionItem.createdAt).toLocaleString()}</td>
      <td>{new Date(returnedDepartmentRevisionSuggestionItem.updatedAt).toLocaleString()}</td>
      <td>{returnedDepartmentRevisionSuggestionItem.suggestion}</td>
      <td>{returnedDepartmentRevisionSuggestionItem.pageNumber}</td>
      <td>{returnedDepartmentRevisionSuggestionItem.actionTaken}</td>
      <td>{returnedDepartmentRevisionSuggestionItem.remarks}</td>
      <td>{returnedDepartmentRevisionSuggestionItem.returnedDepartmentRevisionId}</td>
      <td className=''>
        <Link
          className='border rounded'
          href={`/returned_department_revision_suggestion_item/${returnedDepartmentRevisionSuggestionItem.id}/edit`}
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
