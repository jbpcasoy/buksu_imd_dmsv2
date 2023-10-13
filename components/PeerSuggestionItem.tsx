import { PeerSuggestionItem } from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export interface PeerSuggestionItemProps {
  peerSuggestionItem: PeerSuggestionItem;
}
export default function PeerSuggestionItem({
  peerSuggestionItem,
}: PeerSuggestionItemProps) {
  const router = useRouter();
  const handleDelete = () => {
    if (confirm("Are you sure? This action cannot be undone.")) {
      axios
        .delete(`/api/peer_suggestion_item/${peerSuggestionItem.id}`)
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
      <p>suggestion: {peerSuggestionItem.suggestion}</p>
      <p>pageNumber: {peerSuggestionItem.pageNumber}</p>
      <p>remarks: {peerSuggestionItem.remarks}</p>
      <div className='space-x-1'>
        <Link
          className='border rounded'
          href={`/peer_suggestion_item/${peerSuggestionItem.id}/edit`}
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
