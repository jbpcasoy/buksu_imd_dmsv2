import CrudLayout from "@/components/CrudLayout";
import usePeerSuggestionItemActionTaken from "@/hooks/usePeerSuggestionItemActionTaken";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function PeerSuggestionItemActionTakenPage() {
  const router = useRouter();
  const peerSuggestionItemActionTakenId = router.query.id;
  const peerSuggestionItemActionTaken = usePeerSuggestionItemActionTaken({
    id: peerSuggestionItemActionTakenId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(
        `/api/peer_suggestion_item_action_taken/${peerSuggestionItemActionTakenId}`
      )
      .then(() => {
        alert("PeerSuggestionItemActionTaken deleted successfully");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  if (!peerSuggestionItemActionTaken) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>PeerSuggestionItemActionTaken</h2>
        <div className='space-x-1'>
          <Link
            className='border rounded'
            href={`/crud/peer_suggestion_item_action_taken/${peerSuggestionItemActionTakenId}/edit`}
          >
            edit
          </Link>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {peerSuggestionItemActionTaken.id}</p>
      <p>
        createdAt:{" "}
        {new Date(peerSuggestionItemActionTaken.createdAt).toLocaleString()}
      </p>
      <p>
        updatedAt:{" "}
        {new Date(peerSuggestionItemActionTaken.updatedAt).toLocaleString()}
      </p>
      <p>
        peerSuggestionItemId:
        <Link
          href={`/crud/peer_suggestion_item/${peerSuggestionItemActionTaken.peerSuggestionItemId}`}
          className='underline'
        >
          {peerSuggestionItemActionTaken.peerSuggestionItemId}
        </Link>
      </p>
      <p>value: {peerSuggestionItemActionTaken.value}</p>
    </CrudLayout>
  );
}
