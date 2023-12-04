import CrudLayout from "@/components/CrudLayout";
import useQAMISSuggestionItem from "@/hooks/useQAMISSuggestionItem";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function QAMISSuggestionItemPage() {
  const router = useRouter();
  const qAMISSuggestionItemId = router.query.id;
  const qAMISSuggestionItem = useQAMISSuggestionItem({
    id: qAMISSuggestionItemId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/qamis_suggestion_item/${qAMISSuggestionItemId}`)
      .then(() => {
        alert("QAMISSuggestionItem deleted successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!qAMISSuggestionItem) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>QAMISSuggestionItem</h2>
        <div className='space-x-1'>
          <Link
            className='border rounded'
            href={`/crud/qamis_suggestion_item/${qAMISSuggestionItemId}/edit`}
          >
            edit
          </Link>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {qAMISSuggestionItem.id}</p>
      <p>
        createdAt: {new Date(qAMISSuggestionItem.createdAt).toLocaleString()}
      </p>
      <p>
        updatedAt: {new Date(qAMISSuggestionItem.updatedAt).toLocaleString()}
      </p>
      <p>
        qAMISSuggestionId:{" "}
        <Link
          href={`/crud/qamis_suggestion/${qAMISSuggestionItem.qAMISSuggestionId}`}
          className='underline'
        >
          {qAMISSuggestionItem.qAMISSuggestionId}
        </Link>
      </p>
      <p>suggestion: {qAMISSuggestionItem.suggestion}</p>
      <p>pageNumber: {qAMISSuggestionItem.pageNumber}</p>
      <p>actionTaken: {qAMISSuggestionItem.actionTaken}</p>
      <p>remarks: {qAMISSuggestionItem.remarks}</p>
    </CrudLayout>
  );
}
