import CrudLayout from "@/components/CrudLayout";
import usePeerSuggestion from "@/hooks/usePeerSuggestion";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function PeerSuggestionPage() {
  const router = useRouter();
  const peerSuggestionId = router.query.id;
  const peerSuggestion = usePeerSuggestion({ id: peerSuggestionId as string });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/peerSuggestion/${peerSuggestionId}`)
      .then(() => {
        alert("PeerSuggestion deleted successfully.");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  if (!peerSuggestion) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>PeerSuggestion</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {peerSuggestion.id}</p>
      <p>createdAt: {new Date(peerSuggestion.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(peerSuggestion.updatedAt).toLocaleString()}</p>
      <p>
        peerReviewId:{" "}
        <Link
          href={`/crud/peer_review/${peerSuggestion.peerReviewId}`}
          className='underline'
        >
          {peerSuggestion.peerReviewId}{" "}
        </Link>
      </p>
    </CrudLayout>
  );
}
