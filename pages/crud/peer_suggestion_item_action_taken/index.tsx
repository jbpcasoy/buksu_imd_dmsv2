import CrudLayout from "@/components/CrudLayout";
import usePeerSuggestionItemActionTakens from "@/hooks/usePeerSuggestionItemActionTakens";
import Link from "next/link";
import { useState } from "react";

export default function PeerSuggestionItemActionTakensPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { peerSuggestionItemActionTakens, count } =
    usePeerSuggestionItemActionTakens(state);

  const handleNext = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return { ...prev, skip: nextVal <= count ? nextVal : prev.skip };
    });
  };

  const handlePrev = () => {
    setState((prev) => {
      const nextVal = prev.skip - prev.take;
      return { ...prev, skip: nextVal >= 0 ? nextVal : prev.skip };
    });
  };

  return (
    <CrudLayout>
      <div className='flex justify-between'>
        <h2>PeerSuggestionItemActionTaken</h2>
        <Link
          className='border rounded'
          href={`/crud/peer_suggestion_item_action_taken/add`}
        >
          Add
        </Link>
      </div>

      <div>
        <table className='table-auto w-full'>
          <thead>
            <tr>
              <th>id</th>
              <th>createdAt</th>
              <th>updatedAt</th>
              <th>peerSuggestionItemId</th>
              <th>value</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {peerSuggestionItemActionTakens.map(
              (peerSuggestionItemActionTaken) => {
                return (
                  <tr key={peerSuggestionItemActionTaken.id}>
                    <td>{peerSuggestionItemActionTaken.id}</td>
                    <td>
                      {new Date(
                        peerSuggestionItemActionTaken.createdAt
                      ).toLocaleString()}
                    </td>
                    <td>
                      {new Date(
                        peerSuggestionItemActionTaken.updatedAt
                      ).toLocaleString()}
                    </td>
                    <td>{peerSuggestionItemActionTaken.value}</td>
                    <td>
                      <Link
                        href={`/crud/peer_suggestion_item/${peerSuggestionItemActionTaken.peerSuggestionItemId}`}
                        className='underline'
                      >
                        {peerSuggestionItemActionTaken.peerSuggestionItemId}
                      </Link>
                    </td>
                    <td>
                      <Link
                        href={`/crud/peer_suggestion_item_action_taken/${peerSuggestionItemActionTaken.id}`}
                        className='border rounded'
                      >
                        view
                      </Link>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
        <div className='flex justify-end space-x-1'>
          <p>
            {state.skip} - {state.skip + state.take} of {count}
          </p>
          <button className='border rounded' onClick={handlePrev}>
            prev
          </button>
          <button className='border rounded' onClick={handleNext}>
            next
          </button>
        </div>
      </div>
    </CrudLayout>
  );
}
