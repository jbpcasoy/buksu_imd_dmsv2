import CrudLayout from "@/components/CrudLayout";
import useContentSpecialistSuggestionItem from "@/hooks/useContentSpecialistSuggestionItem";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ContentSpecialistSuggestionItemPage() {
  const router = useRouter();
  const contentSpecialistSuggestionItemId = router.query.id;
  const contentSpecialistSuggestionItem = useContentSpecialistSuggestionItem({
    id: contentSpecialistSuggestionItemId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/content_specialist_suggestion_item/${contentSpecialistSuggestionItemId}`)
      .then(() => {
        alert("ContentSpecialistSuggestionItem deleted successfully.");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!contentSpecialistSuggestionItem) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>ContentSpecialistSuggestionItem</h2>
        <div className='space-x-1'>
          <Link
            className='border rounded'
            href={`/crud/content_specialist_suggestion_item/${contentSpecialistSuggestionItemId}/edit`}
          >
            edit
          </Link>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {contentSpecialistSuggestionItem.id}</p>
      <p>
        createdAt: {new Date(contentSpecialistSuggestionItem.createdAt).toLocaleString()}
      </p>
      <p>
        updatedAt: {new Date(contentSpecialistSuggestionItem.updatedAt).toLocaleString()}
      </p>
      <p>
        contentSpecialistSuggestionId:{" "}
        <Link
          href={`/crud/content_specialist_suggestion/${contentSpecialistSuggestionItem.contentSpecialistSuggestionId}`}
          className='underline'
        >
          {contentSpecialistSuggestionItem.contentSpecialistSuggestionId}
        </Link>
      </p>
      <p>suggestion: {contentSpecialistSuggestionItem.suggestion}</p>
      <p>pageNumber: {contentSpecialistSuggestionItem.pageNumber}</p>
      <p>actionTaken: {contentSpecialistSuggestionItem.actionTaken}</p>
      <p>remarks: {contentSpecialistSuggestionItem.remarks}</p>
    </CrudLayout>
  );
}
