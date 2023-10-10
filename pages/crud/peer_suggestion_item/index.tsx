import CrudLayout from "@/components/CrudLayout";
import usePeerSuggestionItems from "@/hooks/usePeerSuggestionItems";
import Link from "next/link";
import { useState } from "react";

export default function PeerSuggestionItemsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { peerSuggestionItems, count } = usePeerSuggestionItems(state);

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
        <h2>PeerSuggestionItem</h2>
        <Link
          className='border rounded'
          href={`/crud/peer_suggestion_item/add`}
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
              <th>peerSuggestionId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {peerSuggestionItems.map((peerSuggestionItem) => {
              return (
                <tr key={peerSuggestionItem.id}>
                  <td>{peerSuggestionItem.id}</td>
                  <td>
                    {new Date(peerSuggestionItem.createdAt).toLocaleString()}
                  </td>
                  <td>
                    {new Date(peerSuggestionItem.updatedAt).toLocaleString()}
                  </td>
                  <td>
                    <Link
                      href={`/crud/peer_suggestion/${peerSuggestionItem.peerSuggestionId}`}
                      className='underline'
                    >
                      {peerSuggestionItem.peerSuggestionId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/peer_suggestion_item/${peerSuggestionItem.id}`}
                      className='border rounded'
                    >
                      view
                    </Link>
                  </td>
                </tr>
              );
            })}
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
