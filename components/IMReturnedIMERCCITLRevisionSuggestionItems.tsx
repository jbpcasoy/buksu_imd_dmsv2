import useReturnedIMERCCITLRevisionSuggestionItemActionTakenReturnedIMERCCITLRevisionSuggestionItem from "@/hooks/useReturnedIMERCCITLRevisionSuggestionItemActionTakenReturnedIMERCCITLRevisionSuggestionItem";
import useReturnedIMERCCITLRevisionSuggestionItemsIM from "@/hooks/useReturnedIMERCCITLRevisionSuggestionItemsIM";
import { ReturnedIMERCCITLRevisionSuggestionItem } from "@prisma/client";
import { DateTime } from "luxon";
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

  const returnedIMERCCITLRevisionSuggestionItems =
    useReturnedIMERCCITLRevisionSuggestionItemsIM(state);

  useEffect(() => {
    setState((prev) => ({ ...prev, id }));
  }, [id]);

  const handleNext = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return {
        ...prev,
        skip:
          nextVal <= returnedIMERCCITLRevisionSuggestionItems.count
            ? nextVal
            : prev.skip,
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
      <table className="w-full text-sm">
        <caption>ReturnedIMERCCITLRevision Suggestions</caption>
        <thead>
          <tr>
            <th>LAST ACTIVITY</th>
            <th>SUGGESTION</th>
            <th>PAGE NUMBER</th>
            <th>ACTION TAKEN</th>
            <th>REMARKS</th>
            {editable && <th>ACTIONS</th>}
          </tr>
        </thead>
        <tbody>
          {returnedIMERCCITLRevisionSuggestionItems.returnedIMERCCITLRevisionSuggestionItems.map(
            (returnedIMERCCITLRevisionSuggestionItem) => {
              return (
                <Item
                  returnedIMERCCITLRevisionSuggestionItem={
                    returnedIMERCCITLRevisionSuggestionItem
                  }
                  editable={editable}
                  key={returnedIMERCCITLRevisionSuggestionItem.id}
                />
              );
            }
          )}
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
    useReturnedIMERCCITLRevisionSuggestionItemActionTakenReturnedIMERCCITLRevisionSuggestionItem(
      {
        id: returnedIMERCCITLRevisionSuggestionItem.id,
      }
    );

  return (
    <tr>
      <td>
        {DateTime.fromJSDate(
          new Date(returnedIMERCCITLRevisionSuggestionItem.updatedAt)
        ).toRelative()}
      </td>
      <td>{returnedIMERCCITLRevisionSuggestionItem.suggestion}</td>
      <td className="text-center">{returnedIMERCCITLRevisionSuggestionItem.pageNumber}</td>
      <td>{returnedIMERCCITLRevisionSuggestionItemActionTaken?.value}</td>
      <td>{returnedIMERCCITLRevisionSuggestionItem.remarks}</td>
      <td>
      </td>
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
