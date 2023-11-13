import CrudLayout from "@/components/CrudLayout";
import useChairpersonSuggestionItemActionTakens from "@/hooks/useChairpersonSuggestionItemActionTakens";
import Link from "next/link";
import { useState } from "react";

export default function ChairpersonSuggestionItemActionTakensPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { chairpersonSuggestionItemActionTakens, count } =
    useChairpersonSuggestionItemActionTakens(state);

  const handleNext = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return { ...prev, skip: nextVal <= count ? nextVal : prev.skip };
    });
  };

  const handlePrev = () => {
    setState((prev) => {
      const nextVal = prev.skip - prev.take;
      return { ...prev, skip: nextVal >= 0 ? nextVal : prev.skip };
    });
  };

  return (
    <CrudLayout>
      <div className='flex justify-between'>
        <h2>ChairpersonSuggestionItemActionTaken</h2>
        <Link
          className='border rounded'
          href={`/crud/chairperson_suggestion_item_action_taken/add`}
        >
          Add
        </Link>
      </div>

      <div>
        <table className='table-auto w-full'>
          <thead>
            <tr>
              <th>id</th>
              <th>createdAt</th>
              <th>updatedAt</th>
              <th>chairpersonSuggestionItemId</th>
              <th>value</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {chairpersonSuggestionItemActionTakens.map(
              (chairpersonSuggestionItemActionTaken) => {
                return (
                  <tr key={chairpersonSuggestionItemActionTaken.id}>
                    <td>{chairpersonSuggestionItemActionTaken.id}</td>
                    <td>
                      {new Date(
                        chairpersonSuggestionItemActionTaken.createdAt
                      ).toLocaleString()}
                    </td>
                    <td>
                      {new Date(
                        chairpersonSuggestionItemActionTaken.updatedAt
                      ).toLocaleString()}
                    </td>
                    <td>
                      <Link
                        href={`/crud/chairperson_suggestion_item/${chairpersonSuggestionItemActionTaken.chairpersonSuggestionItemId}`}
                        className='underline'
                      >
                        {
                          chairpersonSuggestionItemActionTaken.chairpersonSuggestionItemId
                        }
                      </Link>
                    </td>
                    <td>{chairpersonSuggestionItemActionTaken.value}</td>
                    <td>
                      <Link
                        href={`/crud/chairperson_suggestion_item_action_taken/${chairpersonSuggestionItemActionTaken.id}`}
                        className='border rounded'
                      >
                        view
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
            {state.skip} - {state.skip + state.take} of {count}
          </p>
          <button className='border rounded' onClick={handlePrev}>
            prev
          </button>
          <button className='border rounded' onClick={handleNext}>
            next
          </button>
        </div>
      </div>
    </CrudLayout>
  );
}
