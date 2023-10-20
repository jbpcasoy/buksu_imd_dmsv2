import useCoordinatorSuggestionItemsIM from "@/hooks/useCoordinatorSuggestionItemsIM";
import Link from "next/link";
import { useEffect, useState } from "react";

export interface IMCoordinatorSuggestionItemsProps {
  id: string;
  editable?: boolean;
}

export default function IMCoordinatorSuggestionItems({
  id,
  editable = true,
}: IMCoordinatorSuggestionItemsProps) {
  const [state, setState] = useState({
    skip: 0,
    take: 10,
    id,
  });

  useEffect(() => {
    setState((prev) => ({ ...prev, id }));
  }, [id]);

  const coordinatorSuggestionItems = useCoordinatorSuggestionItemsIM(state);
  const handleNext = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return {
        ...prev,
        skip: nextVal <= coordinatorSuggestionItems.count ? nextVal : prev.skip,
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
        <caption>Coordinator Suggestions</caption>
        <thead>
          <tr>
            <th>id</th>
            <th>createdAt</th>
            <th>updatedAt</th>
            <th>suggestion</th>
            <th>pageNumber</th>
            <th>actionTaken</th>
            <th>remarks</th>
            <th>coordinatorSuggestionId</th>
            {editable && <th>actions</th>}
          </tr>
        </thead>
        <tbody>
          {coordinatorSuggestionItems.coordinatorSuggestionItems.map(
            (coordinatorSuggestionItem) => {
              return (
                <tr key={coordinatorSuggestionItem.id}>
                  <td>{coordinatorSuggestionItem.id}</td>
                  <td>
                    {new Date(
                      coordinatorSuggestionItem.createdAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    {new Date(
                      coordinatorSuggestionItem.updatedAt
                    ).toLocaleString()}
                  </td>
                  <td>{coordinatorSuggestionItem.suggestion}</td>
                  <td>{coordinatorSuggestionItem.pageNumber}</td>
                  <td>{coordinatorSuggestionItem.actionTaken}</td>
                  <td>{coordinatorSuggestionItem.remarks}</td>
                  <td>{coordinatorSuggestionItem.coordinatorSuggestionId}</td>
                  {editable && (
                    <td>
                      <Link
                        href={`/coordinator_suggestion_item/${coordinatorSuggestionItem.id}/action_taken/edit`}
                        className='border rounded'
                      >
                        edit
                      </Link>
                    </td>
                  )}
                </tr>
              );
            }
          )}
        </tbody>
      </table>
      <div className='flex justify-end space-x-1'>
        <p>
          {state.skip} - {state.skip + state.take} of{" "}
          {coordinatorSuggestionItems.count}
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
