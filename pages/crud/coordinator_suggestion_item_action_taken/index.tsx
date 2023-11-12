import CrudLayout from "@/components/CrudLayout";
import useCoordinatorSuggestionItemActionTakens from "@/hooks/useCoordinatorSuggestionItemActionTakens";
import Link from "next/link";
import { useState } from "react";

export default function CoordinatorSuggestionItemActionTakensPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { coordinatorSuggestionItemActionTakens, count } =
    useCoordinatorSuggestionItemActionTakens(state);

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
        <h2>CoordinatorSuggestionItemActionTaken</h2>
        <Link
          className='border rounded'
          href={`/crud/coordinator_suggestion_item_action_taken/add`}
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
              <th>value</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {coordinatorSuggestionItemActionTakens.map(
              (coordinatorSuggestionItemActionTaken) => {
                return (
                  <tr key={coordinatorSuggestionItemActionTaken.id}>
                    <td>{coordinatorSuggestionItemActionTaken.id}</td>
                    <td>
                      {new Date(
                        coordinatorSuggestionItemActionTaken.createdAt
                      ).toLocaleString()}
                    </td>
                    <td>
                      {new Date(
                        coordinatorSuggestionItemActionTaken.updatedAt
                      ).toLocaleString()}
                    </td>
                    <td>{coordinatorSuggestionItemActionTaken.value}</td>
                    <td>
                      <Link
                        href={`/crud/coordinator_suggestion_item/${coordinatorSuggestionItemActionTaken.coordinatorSuggestionItemId}`}
                        className='underline'
                      >
                        {
                          coordinatorSuggestionItemActionTaken.coordinatorSuggestionItemId
                        }
                      </Link>
                    </td>
                    <td>
                      <Link
                        href={`/crud/coordinator_suggestion_item_action_taken/${coordinatorSuggestionItemActionTaken.id}`}
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
