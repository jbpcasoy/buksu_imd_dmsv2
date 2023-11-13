import CrudLayout from "@/components/CrudLayout";
import useContentSpecialistSuggestionItemActionTakens from "@/hooks/useContentSpecialistSuggestionItemActionTakens";
import Link from "next/link";
import { useState } from "react";

export default function ContentSpecialistSuggestionItemActionTakensPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { contentSpecialistSuggestionItemActionTakens, count } =
    useContentSpecialistSuggestionItemActionTakens(state);

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
        <h2>ContentSpecialistSuggestionItemActionTaken</h2>
        <Link
          className='border rounded'
          href={`/crud/content_specialist_suggestion_item_action_taken/add`}
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
              <th>contentSpecialistSuggestionItemId</th>
              <th>value</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {contentSpecialistSuggestionItemActionTakens.map(
              (contentSpecialistSuggestionItemActionTaken) => {
                return (
                  <tr key={contentSpecialistSuggestionItemActionTaken.id}>
                    <td>{contentSpecialistSuggestionItemActionTaken.id}</td>
                    <td>
                      {new Date(
                        contentSpecialistSuggestionItemActionTaken.createdAt
                      ).toLocaleString()}
                    </td>
                    <td>
                      {new Date(
                        contentSpecialistSuggestionItemActionTaken.updatedAt
                      ).toLocaleString()}
                    </td>
                    <td>
                      <Link
                        href={`/crud/content_specialist_suggestion_item/${contentSpecialistSuggestionItemActionTaken.contentSpecialistSuggestionItemId}`}
                        className='underline'
                      >
                        {
                          contentSpecialistSuggestionItemActionTaken.contentSpecialistSuggestionItemId
                        }
                      </Link>
                    </td>
                    <td>{contentSpecialistSuggestionItemActionTaken.value}</td>
                    <td>
                      <Link
                        href={`/crud/content_specialist_suggestion_item_action_taken/${contentSpecialistSuggestionItemActionTaken.id}`}
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
