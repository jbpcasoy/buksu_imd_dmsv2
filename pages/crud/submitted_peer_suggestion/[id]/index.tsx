import CrudLayout from "@/components/CrudLayout";
import useSubmittedPeerSuggestion from "@/hooks/useSubmittedPeerSuggestion";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function SubmittedPeerSuggestionPage() {
  const router = useRouter();
  const submittedPeerSuggestionId = router.query.id;
  const submittedPeerSuggestion = useSubmittedPeerSuggestion({
    id: submittedPeerSuggestionId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/submitted_peer_suggestion/${submittedPeerSuggestionId}`)
      .then(() => {
        alert("SubmittedPeerSuggestion deleted successfully.");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!submittedPeerSuggestion) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>SubmittedPeerSuggestion</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {submittedPeerSuggestion.id}</p>
      <p>
        createdAt:{" "}
        {new Date(submittedPeerSuggestion.createdAt).toLocaleString()}
      </p>
      <p>
        updatedAt:{" "}
        {new Date(submittedPeerSuggestion.updatedAt).toLocaleString()}
      </p>
      <p>
        peerSuggestionId:{" "}
        <Link
          href={`/crud/peer_suggestion/${submittedPeerSuggestion.peerSuggestionId}`}
          className='underline'
        >
          {submittedPeerSuggestion.peerSuggestionId}
        </Link>
      </p>
    </CrudLayout>
  );
}
