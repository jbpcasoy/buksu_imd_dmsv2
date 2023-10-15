import CrudLayout from "@/components/CrudLayout";
import useContentSpecialistSuggestions from "@/hooks/useContentSpecialistSuggestions";
import Link from "next/link";
import { useState } from "react";

export default function ContentSpecialistSuggestionsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { contentSpecialistSuggestions, count } = useContentSpecialistSuggestions(state);

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
        <h2>ContentSpecialistSuggestion</h2>
        <Link className='border rounded' href={`/crud/content_specialist_suggestion/add`}>
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
              <th>contentSpecialistReviewId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {contentSpecialistSuggestions.map((contentSpecialistSuggestion) => {
              return (
                <tr key={contentSpecialistSuggestion.id}>
                  <td>{contentSpecialistSuggestion.id}</td>
                  <td>{new Date(contentSpecialistSuggestion.createdAt).toLocaleString()}</td>
                  <td>{new Date(contentSpecialistSuggestion.updatedAt).toLocaleString()}</td>
                  <td>
                    <Link
                      href={`/crud/content_specialist_review/${contentSpecialistSuggestion.contentSpecialistReviewId}`}
                      className='underline'
                    >
                      {contentSpecialistSuggestion.contentSpecialistReviewId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/content_specialist_suggestion/${contentSpecialistSuggestion.id}`}
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
