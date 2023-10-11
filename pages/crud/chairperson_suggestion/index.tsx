import CrudLayout from "@/components/CrudLayout";
import useChairpersonSuggestions from "@/hooks/useChairpersonSuggestions";
import Link from "next/link";
import { useState } from "react";

export default function ChairpersonSuggestionsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { chairpersonSuggestions, count } = useChairpersonSuggestions(state);

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
        <h2>ChairpersonSuggestion</h2>
        <Link className='border rounded' href={`/crud/chairperson_suggestion/add`}>
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
              <th>chairpersonReviewId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {chairpersonSuggestions.map((chairpersonSuggestion) => {
              return (
                <tr key={chairpersonSuggestion.id}>
                  <td>{chairpersonSuggestion.id}</td>
                  <td>{new Date(chairpersonSuggestion.createdAt).toLocaleString()}</td>
                  <td>{new Date(chairpersonSuggestion.updatedAt).toLocaleString()}</td>
                  <td>
                    <Link
                      href={`/crud/chairperson_review/${chairpersonSuggestion.chairpersonReviewId}`}
                      className='underline'
                    >
                      {chairpersonSuggestion.chairpersonReviewId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/chairperson_suggestion/${chairpersonSuggestion.id}`}
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
