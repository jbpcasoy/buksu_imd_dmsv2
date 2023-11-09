import useReturnedDepartmentRevisionSuggestionItemsIM from "@/hooks/useReturnedDepartmentRevisionSuggestionItemsIM";
import Link from "next/link";
import { useEffect, useState } from "react";

export interface IMReturnedDepartmentRevisionSuggestionItemsProps {
  id: string;
  editable?: boolean;
}

export default function IMReturnedDepartmentRevisionSuggestionItems({
  id,
  editable = true,
}: IMReturnedDepartmentRevisionSuggestionItemsProps) {
  const [state, setState] = useState({
    skip: 0,
    take: 10,
    id,
  });

  useEffect(() => {
    setState((prev) => ({ ...prev, id }));
  }, [id]);

  const returnedDepartmentRevisionSuggestionItems = useReturnedDepartmentRevisionSuggestionItemsIM(state);
  const handleNext = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return {
        ...prev,
        skip: nextVal <= returnedDepartmentRevisionSuggestionItems.count ? nextVal : prev.skip,
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
        <caption>Returned Department Revision Suggestions</caption>
        <thead>
          <tr>
            <th>id</th>
            <th>createdAt</th>
            <th>updatedAt</th>
            <th>suggestion</th>
            <th>pageNumber</th>
            <th>actionTaken</th>
            <th>remarks</th>
            <th>returnedDepartmentRevisionId</th>
            {editable && <th>actions</th>}
          </tr>
        </thead>
        <tbody>
          {returnedDepartmentRevisionSuggestionItems.returnedDepartmentRevisionSuggestionItems.map(
            (returnedDepartmentRevisionSuggestionItem) => {
              return (
                <tr key={returnedDepartmentRevisionSuggestionItem.id}>
                  <td>{returnedDepartmentRevisionSuggestionItem.id}</td>
                  <td>
                    {new Date(
                      returnedDepartmentRevisionSuggestionItem.createdAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    {new Date(
                      returnedDepartmentRevisionSuggestionItem.updatedAt
                    ).toLocaleString()}
                  </td>
                  <td>{returnedDepartmentRevisionSuggestionItem.suggestion}</td>
                  <td>{returnedDepartmentRevisionSuggestionItem.pageNumber}</td>
                  <td>{returnedDepartmentRevisionSuggestionItem.actionTaken}</td>
                  <td>{returnedDepartmentRevisionSuggestionItem.remarks}</td>
                  <td>{returnedDepartmentRevisionSuggestionItem.returnedDepartmentRevisionId}</td>
                  {editable && (
                    <td>
                      <Link
                        href={`/returned_department_revision_suggestion_item/${returnedDepartmentRevisionSuggestionItem.id}/action_taken/edit`}
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
          {returnedDepartmentRevisionSuggestionItems.count}
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
