import CrudLayout from "@/components/CrudLayout";
import usePeerSuggestionItemActionTaken from "@/hooks/usePeerSuggestionItemActionTaken";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function PeerSuggestionItemActionTakenPage() {
  const router = useRouter();
  const PeerSuggestionItemActionTakenId = router.query.id;
  const PeerSuggestionItemActionTaken = usePeerSuggestionItemActionTaken({ id: PeerSuggestionItemActionTakenId as string });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios.delete(`/api/peer_suggestion_item_action_taken/${PeerSuggestionItemActionTakenId}`).then(() => {
      alert("PeerSuggestionItemActionTaken deleted successfully.");
    }).catch(error => {
      alert(error.message)
    });
  };

  if (!PeerSuggestionItemActionTaken) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>PeerSuggestionItemActionTaken</h2>
        <div className='space-x-1'>
          <Link className='border rounded' href={`/crud/peer_suggestion_item_action_taken/${PeerSuggestionItemActionTakenId}/edit`}>edit</Link>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {PeerSuggestionItemActionTaken.id}</p>
      <p>createdAt: {new Date(PeerSuggestionItemActionTaken.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(PeerSuggestionItemActionTaken.updatedAt).toLocaleString()}</p>
      <p>peerSuggestionItemId: {PeerSuggestionItemActionTaken.peerSuggestionItemId}</p>
      <p>value: {PeerSuggestionItemActionTaken.value}</p>
    </CrudLayout>
  );
}
