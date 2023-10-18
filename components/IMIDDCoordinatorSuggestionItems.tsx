import useIDDCoordinatorSuggestionItemsIM from "@/hooks/useIDDCoordinatorSuggestionItemsIM";
import Link from "next/link";
import { useState } from "react";

export interface IMIDDCoordinatorSuggestionItemsProps {
  id: string;
}

export default function IMIDDCoordinatorSuggestionItems({
  id,
}: IMIDDCoordinatorSuggestionItemsProps) {
  const [state, setState] = useState({
    skip: 0,
    take: 10,
    id,
  });

  const iDDCoordinatorSuggestionItems =
    useIDDCoordinatorSuggestionItemsIM(state);

  const handleNext = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return {
        ...prev,
        skip:
          nextVal <= iDDCoordinatorSuggestionItems.count ? nextVal : prev.skip,
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
        <caption>IDDCoordinator Suggestions</caption>
        <thead>
          <tr>
            <th>id</th>
            <th>createdAt</th>
            <th>updatedAt</th>
            <th>suggestion</th>
            <th>pageNumber</th>
            <th>actionTaken</th>
            <th>remarks</th>
            <th>iDDCoordinatorSuggestionId</th>
            <th>actions</th>
          </tr>
        </thead>
        <tbody>
          {iDDCoordinatorSuggestionItems.iDDCoordinatorSuggestionItems.map(
            (iDDCoordinatorSuggestionItem) => {
              return (
                <tr key={iDDCoordinatorSuggestionItem.id}>
                  <td>{iDDCoordinatorSuggestionItem.id}</td>
                  <td>
                    {new Date(
                      iDDCoordinatorSuggestionItem.createdAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    {new Date(
                      iDDCoordinatorSuggestionItem.updatedAt
                    ).toLocaleString()}
                  </td>
                  <td>{iDDCoordinatorSuggestionItem.suggestion}</td>
                  <td>{iDDCoordinatorSuggestionItem.pageNumber}</td>
                  <td>{iDDCoordinatorSuggestionItem.actionTaken}</td>
                  <td>{iDDCoordinatorSuggestionItem.remarks}</td>
                  <td>
                    {iDDCoordinatorSuggestionItem.iDDCoordinatorSuggestionId}
                  </td>
                  <td>
                    <Link
                      href={`/idd_coordinator_suggestion_item/${iDDCoordinatorSuggestionItem.id}/action_taken/edit`}
                      className='border rounded'
                    >
                      edit
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
          {state.skip} - {state.skip + state.take} of{" "}
          {iDDCoordinatorSuggestionItems.count}
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
