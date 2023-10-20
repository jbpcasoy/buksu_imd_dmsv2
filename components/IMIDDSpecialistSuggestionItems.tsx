import useIDDSpecialistSuggestionItemsIM from "@/hooks/useIDDSpecialistSuggestionItemsIM";
import Link from "next/link";
import { useEffect, useState } from "react";

export interface IMIDDSpecialistSuggestionItemsProps {
  id: string;
  editable?: boolean;
}

export default function IMIDDSpecialistSuggestionItems({
  id,
  editable = true,
}: IMIDDSpecialistSuggestionItemsProps) {
  const [state, setState] = useState({
    skip: 0,
    take: 10,
    id,
  });

  useEffect(() => {
    setState((prev) => ({ ...prev, id }));
  }, [id]);

  const iDDSpecialistSuggestionItems = useIDDSpecialistSuggestionItemsIM(state);

  const handleNext = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return {
        ...prev,
        skip:
          nextVal <= iDDSpecialistSuggestionItems.count ? nextVal : prev.skip,
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
        <caption>IDDSpecialist Suggestions</caption>
        <thead>
          <tr>
            <th>id</th>
            <th>createdAt</th>
            <th>updatedAt</th>
            <th>suggestion</th>
            <th>pageNumber</th>
            <th>actionTaken</th>
            <th>remarks</th>
            <th>iDDSpecialistSuggestionId</th>
            {editable && <th>actions</th>}
          </tr>
        </thead>
        <tbody>
          {iDDSpecialistSuggestionItems.iDDSpecialistSuggestionItems.map(
            (iDDSpecialistSuggestionItem) => {
              return (
                <tr key={iDDSpecialistSuggestionItem.id}>
                  <td>{iDDSpecialistSuggestionItem.id}</td>
                  <td>
                    {new Date(
                      iDDSpecialistSuggestionItem.createdAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    {new Date(
                      iDDSpecialistSuggestionItem.updatedAt
                    ).toLocaleString()}
                  </td>
                  <td>{iDDSpecialistSuggestionItem.suggestion}</td>
                  <td>{iDDSpecialistSuggestionItem.pageNumber}</td>
                  <td>{iDDSpecialistSuggestionItem.actionTaken}</td>
                  <td>{iDDSpecialistSuggestionItem.remarks}</td>
                  <td>
                    {iDDSpecialistSuggestionItem.iDDSpecialistSuggestionId}
                  </td>
                  {editable && (
                    <td>
                      <Link
                        href={`/idd_specialist_suggestion_item/${iDDSpecialistSuggestionItem.id}/action_taken/edit`}
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
          {iDDSpecialistSuggestionItems.count}
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
