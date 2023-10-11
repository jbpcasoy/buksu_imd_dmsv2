import CrudLayout from "@/components/CrudLayout";
import useSubmittedCoordinatorSuggestions from "@/hooks/useSubmittedCoordinatorSuggestions";
import Link from "next/link";
import { useState } from "react";

export default function SubmittedCoordinatorSuggestionsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { submittedCoordinatorSuggestions, count } =
    useSubmittedCoordinatorSuggestions(state);

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
        <h2>SubmittedCoordinatorSuggestion</h2>
        <Link
          className='border rounded'
          href={`/crud/submitted_coordinator_suggestion/add`}
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
              <th>coordinatorSuggestionId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {submittedCoordinatorSuggestions.map((submittedCoordinatorSuggestion) => {
              return (
                <tr key={submittedCoordinatorSuggestion.id}>
                  <td>{submittedCoordinatorSuggestion.id}</td>
                  <td>
                    {new Date(
                      submittedCoordinatorSuggestion.createdAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    {new Date(
                      submittedCoordinatorSuggestion.updatedAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    <Link
                      href={`/crud/coordinator_suggestion/${submittedCoordinatorSuggestion.coordinatorSuggestionId}`}
                      className='underline'
                    >
                      {submittedCoordinatorSuggestion.coordinatorSuggestionId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/submitted_coordinator_suggestion/${submittedCoordinatorSuggestion.id}`}
                      className='border rounded'
                    >
                      view
                    </Link>
                  </td>
                </tr>
              );
            })}
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
