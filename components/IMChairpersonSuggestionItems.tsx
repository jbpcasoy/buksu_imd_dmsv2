import useChairpersonSuggestionItemsIM from "@/hooks/useChairpersonSuggestionItemsIM";
import Link from "next/link";
import { useEffect, useState } from "react";

export interface IMChairpersonSuggestionItemsProps {
  id: string;
  editable?: boolean;
}

export default function IMChairpersonSuggestionItems({
  id,
  editable = true,
}: IMChairpersonSuggestionItemsProps) {
  const [state, setState] = useState({
    skip: 0,
    take: 10,
    id,
  });

  useEffect(() => {
    setState((prev) => ({ ...prev, id }));
  }, [id]);

  const chairpersonSuggestionItems = useChairpersonSuggestionItemsIM(state);
  const handleNext = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return {
        ...prev,
        skip: nextVal <= chairpersonSuggestionItems.count ? nextVal : prev.skip,
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
        <caption>Chairperson Suggestions</caption>
        <thead>
          <tr>
            <th>id</th>
            <th>createdAt</th>
            <th>updatedAt</th>
            <th>suggestion</th>
            <th>pageNumber</th>
            <th>actionTaken</th>
            <th>remarks</th>
            <th>chairpersonSuggestionId</th>
            {editable && <th>actions</th>}
          </tr>
        </thead>
        <tbody>
          {chairpersonSuggestionItems.chairpersonSuggestionItems.map(
            (chairpersonSuggestionItem) => {
              return (
                <tr key={chairpersonSuggestionItem.id}>
                  <td>{chairpersonSuggestionItem.id}</td>
                  <td>
                    {new Date(
                      chairpersonSuggestionItem.createdAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    {new Date(
                      chairpersonSuggestionItem.updatedAt
                    ).toLocaleString()}
                  </td>
                  <td>{chairpersonSuggestionItem.suggestion}</td>
                  <td>{chairpersonSuggestionItem.pageNumber}</td>
                  <td>{chairpersonSuggestionItem.actionTaken}</td>
                  <td>{chairpersonSuggestionItem.remarks}</td>
                  <td>{chairpersonSuggestionItem.chairpersonSuggestionId}</td>
                  {editable && (
                    <td>
                      <Link
                        href={`/chairperson_suggestion_item/${chairpersonSuggestionItem.id}/action_taken/edit`}
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
          {chairpersonSuggestionItems.count}
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
