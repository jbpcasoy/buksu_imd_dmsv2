import usePeerSuggestionItemActionTakenPeerSuggestionItem from "@/hooks/usePeerSuggestionItemActionTakenPeerSuggestionItem";
import usePeerSuggestionItemsIM from "@/hooks/usePeerSuggestionItemsIM";
import { PeerSuggestionItem } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";

export interface IMPeerSuggestionItemsProps {
  id: string;
  editable?: boolean;
}

export default function IMPeerSuggestionItems({
  id,
  editable = true,
}: IMPeerSuggestionItemsProps) {
  const [state, setState] = useState({
    skip: 0,
    take: 10,
    id,
  });

  const peerSuggestionItems = usePeerSuggestionItemsIM(state);

  useEffect(() => {
    setState((prev) => ({ ...prev, id }));
  }, [id]);

  const handleNext = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return {
        ...prev,
        skip: nextVal <= peerSuggestionItems.count ? nextVal : prev.skip,
      };
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
            {editable && <th>actions</th>}
          </tr>
        </thead>
        <tbody>
          {peerSuggestionItems.peerSuggestionItems.map((peerSuggestionItem) => {
            return (
              <Item
                peerSuggestionItem={peerSuggestionItem}
                editable={editable}
                key={peerSuggestionItem.id}
              />
            );
          })}
        </tbody>
      </table>
      <div className='flex justify-end space-x-1'>
        <p>
          {state.skip} - {state.skip + state.take} of{" "}
          {peerSuggestionItems.count}
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

function Item({
  peerSuggestionItem,
  editable,
}: {
  peerSuggestionItem: PeerSuggestionItem;
  editable: boolean;
}) {
  const peerSuggestionItemActionTaken =
    usePeerSuggestionItemActionTakenPeerSuggestionItem({
      id: peerSuggestionItem.id,
    });

  return (
    <tr>
      <td>{peerSuggestionItem.id}</td>
      <td>{new Date(peerSuggestionItem.createdAt).toLocaleString()}</td>
      <td>{new Date(peerSuggestionItem.updatedAt).toLocaleString()}</td>
      <td>{peerSuggestionItem.suggestion}</td>
      <td>{peerSuggestionItem.pageNumber}</td>
      <td>{peerSuggestionItemActionTaken?.value}</td>
      <td>{peerSuggestionItem.remarks}</td>
      <td>{peerSuggestionItem.peerSuggestionId}</td>
      {editable && (
        <td>
          <Link
            href={`/peer_suggestion_item/${peerSuggestionItem.id}/action_taken/edit`}
            className='border rounded'
          >
            edit
          </Link>
        </td>
      )}
    </tr>
  );
}
