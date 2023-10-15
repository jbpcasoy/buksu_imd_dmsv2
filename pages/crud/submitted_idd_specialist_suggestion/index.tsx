import CrudLayout from "@/components/CrudLayout";
import useSubmittedIDDSpecialistSuggestions from "@/hooks/useSubmittedIDDSpecialistSuggestions";
import Link from "next/link";
import { useState } from "react";

export default function SubmittedIDDSpecialistSuggestionsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { submittedIDDSpecialistSuggestions, count } =
    useSubmittedIDDSpecialistSuggestions(state);

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
        <h2>SubmittedIDDSpecialistSuggestion</h2>
        <Link
          className='border rounded'
          href={`/crud/submitted_idd_specialist_suggestion/add`}
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
              <th>iDDSpecialistSuggestionId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {submittedIDDSpecialistSuggestions.map((submittedIDDSpecialistSuggestion) => {
              return (
                <tr key={submittedIDDSpecialistSuggestion.id}>
                  <td>{submittedIDDSpecialistSuggestion.id}</td>
                  <td>
                    {new Date(
                      submittedIDDSpecialistSuggestion.createdAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    {new Date(
                      submittedIDDSpecialistSuggestion.updatedAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    <Link
                      href={`/crud/idd_specialist_suggestion/${submittedIDDSpecialistSuggestion.iDDSpecialistSuggestionId}`}
                      className='underline'
                    >
                      {submittedIDDSpecialistSuggestion.iDDSpecialistSuggestionId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/submitted_idd_specialist_suggestion/${submittedIDDSpecialistSuggestion.id}`}
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
