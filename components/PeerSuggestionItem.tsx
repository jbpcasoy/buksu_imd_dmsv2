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
    <tr className=''>
      <td>{peerSuggestionItem.id}</td>
      <td>{new Date(peerSuggestionItem.createdAt).toLocaleString()}</td>
      <td>{new Date(peerSuggestionItem.updatedAt).toLocaleString()}</td>
      <td>{peerSuggestionItem.suggestion}</td>
      <td>{peerSuggestionItem.pageNumber}</td>
      <td>{peerSuggestionItem.actionTaken}</td>
      <td>{peerSuggestionItem.remarks}</td>
      <td>{peerSuggestionItem.peerSuggestionId}</td>
      <td className=''>
        <Link
          className='border rounded'
          href={`/peer_suggestion_item/${peerSuggestionItem.id}/edit`}
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
