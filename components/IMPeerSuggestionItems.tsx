import usePeerSuggestionItemsIM from "@/hooks/usePeerSuggestionItemsIM";
import Link from "next/link";
import { useState } from "react";

export interface IMPeerSuggestionItemsProps {
  id: string;
}

export default function IMPeerSuggestionItems({
  id,
}: IMPeerSuggestionItemsProps) {
  const [state, setState] = useState({
    skip: 0,
    take: 10,
    id,
  });

  const peerSuggestionItems = usePeerSuggestionItemsIM(state);

  const handleNext = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return { ...prev, skip: nextVal <= peerSuggestionItems.count ? nextVal : prev.skip };
    });
  };

  const handlePrev = () => {
    setState((prev) => {
      const nextVal = prev.skip - prev.take;
      return { ...prev, skip: nextVal >= 0 ? nextVal : prev.skip };
    });
  };

  return (
    <div>
      <table>
        <caption>Peer Suggestions</caption>
        <thead>
          <tr>
            <th>id</th>
            <th>createdAt</th>
            <th>updatedAt</th>
            <th>suggestion</th>
            <th>pageNumber</th>
            <th>actionTaken</th>
            <th>remarks</th>
            <th>peerSuggestionId</th>
            <th>actions</th>
          </tr>
        </thead>
        <tbody>
          {peerSuggestionItems.peerSuggestionItems.map((peerSuggestionItem) => {
            return (
              <tr>
                <td>{peerSuggestionItem.id}</td>
                <td>
                  {new Date(peerSuggestionItem.createdAt).toLocaleString()}
                </td>
                <td>
                  {new Date(peerSuggestionItem.updatedAt).toLocaleString()}
                </td>
                <td>{peerSuggestionItem.suggestion}</td>
                <td>{peerSuggestionItem.pageNumber}</td>
                <td>{peerSuggestionItem.actionTaken}</td>
                <td>{peerSuggestionItem.remarks}</td>
                <td>{peerSuggestionItem.peerSuggestionId}</td>
                <td>
                  <Link
                    href={`/peer_suggestion_item/${peerSuggestionItem.id}/action_taken/edit`}
                    className='border rounded'
                  >
                    edit
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className='flex justify-end space-x-1'>
        <p>
          {state.skip} - {state.skip + state.take} of {peerSuggestionItems.count}
        </p>
        <button className='border rounded' onClick={handlePrev}>
          prev
        </button>
        <button className='border rounded' onClick={handleNext}>
          next
        </button>
      </div>
    </div>
  );
}
