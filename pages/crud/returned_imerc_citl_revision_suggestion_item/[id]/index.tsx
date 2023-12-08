import CrudLayout from "@/components/CrudLayout";
import useReturnedIMERCCITLRevisionSuggestionItem from "@/hooks/useReturnedIMERCCITLRevisionSuggestionItem";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ReturnedIMERCCITLRevisionSuggestionItemPage() {
  const router = useRouter();
  const returnedIMERCCITLRevisionSuggestionItemId = router.query.id;
  const returnedIMERCCITLRevisionSuggestionItem =
    useReturnedIMERCCITLRevisionSuggestionItem({
      id: returnedIMERCCITLRevisionSuggestionItemId as string,
    });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(
        `/api/returned_imerc_citl_revision_suggestion_item/${returnedIMERCCITLRevisionSuggestionItemId}`
      )
      .then(() => {
        alert("ReturnedIMERCCITLRevisionSuggestionItem has been deleted successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!returnedIMERCCITLRevisionSuggestionItem) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>ReturnedIMERCCITLRevisionSuggestionItem</h2>
        <div className='space-x-1'>
          <Link
            className='border rounded'
            href={`/crud/returned_imerc_citl_revision_suggestion_item/${returnedIMERCCITLRevisionSuggestionItemId}/edit`}
          >
            edit
          </Link>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {returnedIMERCCITLRevisionSuggestionItem.id}</p>
      <p>
        createdAt:{" "}
        {new Date(
          returnedIMERCCITLRevisionSuggestionItem.createdAt
        ).toLocaleString()}
      </p>
      <p>
        updatedAt:{" "}
        {new Date(
          returnedIMERCCITLRevisionSuggestionItem.updatedAt
        ).toLocaleString()}
      </p>
      <p>
        returnedIMERCCITLRevisionId:{" "}
        <Link
          href={`/crud/returned_imerc_citl_revision/${returnedIMERCCITLRevisionSuggestionItem.returnedIMERCCITLRevisionId}`}
          className='underline'
        >
          {
            returnedIMERCCITLRevisionSuggestionItem.returnedIMERCCITLRevisionId
          }
        </Link>
      </p>
      <p>suggestion: {returnedIMERCCITLRevisionSuggestionItem.suggestion}</p>
      <p>pageNumber: {returnedIMERCCITLRevisionSuggestionItem.pageNumber}</p>
      <p>actionTaken: {returnedIMERCCITLRevisionSuggestionItem.actionTaken}</p>
      <p>remarks: {returnedIMERCCITLRevisionSuggestionItem.remarks}</p>
    </CrudLayout>
  );
}
