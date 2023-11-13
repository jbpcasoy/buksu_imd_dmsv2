import useReturnedIMERCCITLRevisionSuggestionItemActionTakenReturnedIMERCCITLRevisionSuggestionItem from "@/hooks/useReturnedIMERCCITLRevisionSuggestionItemActionTakenReturnedIMERCCITLRevisionSuggestionItem";
import useReturnedIMERCCITLRevisionSuggestionItemsIM from "@/hooks/useReturnedIMERCCITLRevisionSuggestionItemsIM";
import { ReturnedIMERCCITLRevisionSuggestionItem } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";

export interface IMReturnedIMERCCITLRevisionSuggestionItemsProps {
  id: string;
  editable?: boolean;
}

export default function IMReturnedIMERCCITLRevisionSuggestionItems({
  id,
  editable = true,
}: IMReturnedIMERCCITLRevisionSuggestionItemsProps) {
  const [state, setState] = useState({
    skip: 0,
    take: 10,
    id,
  });

  const returnedIMERCCITLRevisionSuggestionItems = useReturnedIMERCCITLRevisionSuggestionItemsIM(state);

  useEffect(() => {
    setState((prev) => ({ ...prev, id }));
  }, [id]);

  const handleNext = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return {
        ...prev,
        skip: nextVal <= returnedIMERCCITLRevisionSuggestionItems.count ? nextVal : prev.skip,
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
        <caption>ReturnedIMERCCITLRevision Suggestions</caption>
        <thead>
          <tr>
            <th>id</th>
            <th>createdAt</th>
            <th>updatedAt</th>
            <th>suggestion</th>
            <th>pageNumber</th>
            <th>actionTaken</th>
            <th>remarks</th>
            <th>returnedIMERCCITLRevisionId</th>
            {editable && <th>actions</th>}
          </tr>
        </thead>
        <tbody>
          {returnedIMERCCITLRevisionSuggestionItems.returnedIMERCCITLRevisionSuggestionItems.map((returnedIMERCCITLRevisionSuggestionItem) => {
            return (
              <Item
                returnedIMERCCITLRevisionSuggestionItem={returnedIMERCCITLRevisionSuggestionItem}
                editable={editable}
                key={returnedIMERCCITLRevisionSuggestionItem.id}
              />
            );
          })}
        </tbody>
      </table>
      <div className='flex justify-end space-x-1'>
        <p>
          {state.skip} - {state.skip + state.take} of{" "}
          {returnedIMERCCITLRevisionSuggestionItems.count}
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
  returnedIMERCCITLRevisionSuggestionItem,
  editable,
}: {
  returnedIMERCCITLRevisionSuggestionItem: ReturnedIMERCCITLRevisionSuggestionItem;
  editable: boolean;
}) {
  const returnedIMERCCITLRevisionSuggestionItemActionTaken =
    useReturnedIMERCCITLRevisionSuggestionItemActionTakenReturnedIMERCCITLRevisionSuggestionItem({
      id: returnedIMERCCITLRevisionSuggestionItem.id,
    });

  return (
    <tr>
      <td>{returnedIMERCCITLRevisionSuggestionItem.id}</td>
      <td>{new Date(returnedIMERCCITLRevisionSuggestionItem.createdAt).toLocaleString()}</td>
      <td>{new Date(returnedIMERCCITLRevisionSuggestionItem.updatedAt).toLocaleString()}</td>
      <td>{returnedIMERCCITLRevisionSuggestionItem.suggestion}</td>
      <td>{returnedIMERCCITLRevisionSuggestionItem.pageNumber}</td>
      <td>{returnedIMERCCITLRevisionSuggestionItemActionTaken?.value}</td>
      <td>{returnedIMERCCITLRevisionSuggestionItem.remarks}</td>
      <td>{returnedIMERCCITLRevisionSuggestionItem.returnedIMERCCITLRevisionId}</td>
      {editable && (
        <td>
          <Link
            href={`/returned_imerc_citl_revision_suggestion_item/${returnedIMERCCITLRevisionSuggestionItem.id}/action_taken/edit`}
            className='border rounded'
          >
            edit
          </Link>
        </td>
      )}
    </tr>
  );
}
