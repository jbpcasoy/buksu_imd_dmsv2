import useReturnedCITLRevisionSuggestionItemsIM from "@/hooks/useReturnedCITLRevisionSuggestionItemsIM";
import Link from "next/link";
import { useEffect, useState } from "react";

export interface IMReturnedCITLRevisionSuggestionItemsProps {
  id: string;
  editable?: boolean;
}

export default function IMReturnedCITLRevisionSuggestionItems({
  id,
  editable = true,
}: IMReturnedCITLRevisionSuggestionItemsProps) {
  const [state, setState] = useState({
    skip: 0,
    take: 10,
    id,
  });

  useEffect(() => {
    setState((prev) => ({ ...prev, id }));
  }, [id]);

  const returnedCITLRevisionSuggestionItems = useReturnedCITLRevisionSuggestionItemsIM(state);
  const handleNext = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return {
        ...prev,
        skip: nextVal <= returnedCITLRevisionSuggestionItems.count ? nextVal : prev.skip,
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
        <caption>Returned CITL Revision Suggestions</caption>
        <thead>
          <tr>
            <th>id</th>
            <th>createdAt</th>
            <th>updatedAt</th>
            <th>suggestion</th>
            <th>pageNumber</th>
            <th>actionTaken</th>
            <th>remarks</th>
            <th>returnedCITLRevisionId</th>
            {editable && <th>actions</th>}
          </tr>
        </thead>
        <tbody>
          {returnedCITLRevisionSuggestionItems.returnedCITLRevisionSuggestionItems.map(
            (returnedCITLRevisionSuggestionItem) => {
              return (
                <tr key={returnedCITLRevisionSuggestionItem.id}>
                  <td>{returnedCITLRevisionSuggestionItem.id}</td>
                  <td>
                    {new Date(
                      returnedCITLRevisionSuggestionItem.createdAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    {new Date(
                      returnedCITLRevisionSuggestionItem.updatedAt
                    ).toLocaleString()}
                  </td>
                  <td>{returnedCITLRevisionSuggestionItem.suggestion}</td>
                  <td>{returnedCITLRevisionSuggestionItem.pageNumber}</td>
                  <td>{returnedCITLRevisionSuggestionItem.actionTaken}</td>
                  <td>{returnedCITLRevisionSuggestionItem.remarks}</td>
                  <td>{returnedCITLRevisionSuggestionItem.returnedCITLRevisionId}</td>
                  {editable && (
                    <td>
                      <Link
                        href={`/returned_citl_revision_suggestion_item/${returnedCITLRevisionSuggestionItem.id}/action_taken/edit`}
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
          {returnedCITLRevisionSuggestionItems.count}
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
