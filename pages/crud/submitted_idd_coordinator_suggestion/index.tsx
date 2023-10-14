import CrudLayout from "@/components/CrudLayout";
import useSubmittedIDDCoordinatorSuggestions from "@/hooks/useSubmittedIDDCoordinatorSuggestions";
import Link from "next/link";
import { useState } from "react";

export default function SubmittedIDDCoordinatorSuggestionsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { submittedIDDCoordinatorSuggestions, count } =
    useSubmittedIDDCoordinatorSuggestions(state);

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
        <h2>SubmittedIDDCoordinatorSuggestion</h2>
        <Link
          className='border rounded'
          href={`/crud/submitted_idd_coordinator_suggestion/add`}
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
              <th>iDDCoordinatorSuggestionId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {submittedIDDCoordinatorSuggestions.map((submittedIDDCoordinatorSuggestion) => {
              return (
                <tr key={submittedIDDCoordinatorSuggestion.id}>
                  <td>{submittedIDDCoordinatorSuggestion.id}</td>
                  <td>
                    {new Date(
                      submittedIDDCoordinatorSuggestion.createdAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    {new Date(
                      submittedIDDCoordinatorSuggestion.updatedAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    <Link
                      href={`/crud/idd_coordinator_suggestion/${submittedIDDCoordinatorSuggestion.iDDCoordinatorSuggestionId}`}
                      className='underline'
                    >
                      {submittedIDDCoordinatorSuggestion.iDDCoordinatorSuggestionId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/submitted_idd_coordinator_suggestion/${submittedIDDCoordinatorSuggestion.id}`}
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
