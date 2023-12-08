import CrudLayout from "@/components/CrudLayout";
import useChairpersonSuggestionItem from "@/hooks/useChairpersonSuggestionItem";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ChairpersonSuggestionItemPage() {
  const router = useRouter();
  const chairpersonSuggestionItemId = router.query.id;
  const chairpersonSuggestionItem = useChairpersonSuggestionItem({
    id: chairpersonSuggestionItemId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/chairperson_suggestion_item/${chairpersonSuggestionItemId}`)
      .then(() => {
        alert("ChairpersonSuggestionItem has been deleted successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!chairpersonSuggestionItem) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>ChairpersonSuggestionItem</h2>
        <div className='space-x-1'>
          <Link
            className='border rounded'
            href={`/crud/chairperson_suggestion_item/${chairpersonSuggestionItemId}/edit`}
          >
            edit
          </Link>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {chairpersonSuggestionItem.id}</p>
      <p>
        createdAt: {new Date(chairpersonSuggestionItem.createdAt).toLocaleString()}
      </p>
      <p>
        updatedAt: {new Date(chairpersonSuggestionItem.updatedAt).toLocaleString()}
      </p>
      <p>
        chairpersonSuggestionId:{" "}
        <Link
          href={`/crud/chairperson_suggestion/${chairpersonSuggestionItem.chairpersonSuggestionId}`}
          className='underline'
        >
          {chairpersonSuggestionItem.chairpersonSuggestionId}
        </Link>
      </p>
      <p>suggestion: {chairpersonSuggestionItem.suggestion}</p>
      <p>pageNumber: {chairpersonSuggestionItem.pageNumber}</p>
      <p>actionTaken: {chairpersonSuggestionItem.actionTaken}</p>
      <p>remarks: {chairpersonSuggestionItem.remarks}</p>
    </CrudLayout>
  );
}
