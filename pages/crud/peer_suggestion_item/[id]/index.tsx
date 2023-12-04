import CrudLayout from "@/components/CrudLayout";
import usePeerSuggestionItem from "@/hooks/usePeerSuggestionItem";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function PeerSuggestionItemPage() {
  const router = useRouter();
  const peerSuggestionItemId = router.query.id;
  const peerSuggestionItem = usePeerSuggestionItem({
    id: peerSuggestionItemId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/peer_suggestion_item/${peerSuggestionItemId}`)
      .then(() => {
        alert("PeerSuggestionItem deleted successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!peerSuggestionItem) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>PeerSuggestionItem</h2>
        <div className='space-x-1'>
          <Link
            className='border rounded'
            href={`/crud/peer_suggestion_item/${peerSuggestionItemId}/edit`}
          >
            edit
          </Link>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {peerSuggestionItem.id}</p>
      <p>
        createdAt: {new Date(peerSuggestionItem.createdAt).toLocaleString()}
      </p>
      <p>
        updatedAt: {new Date(peerSuggestionItem.updatedAt).toLocaleString()}
      </p>
      <p>
        peerSuggestionId:{" "}
        <Link
          href={`/crud/peer_suggestion/${peerSuggestionItem.peerSuggestionId}`}
          className='underline'
        >
          {peerSuggestionItem.peerSuggestionId}
        </Link>
      </p>
      <p>suggestion: {peerSuggestionItem.suggestion}</p>
      <p>pageNumber: {peerSuggestionItem.pageNumber}</p>
      <p>actionTaken: {peerSuggestionItem.actionTaken}</p>
      <p>remarks: {peerSuggestionItem.remarks}</p>
    </CrudLayout>
  );
}
