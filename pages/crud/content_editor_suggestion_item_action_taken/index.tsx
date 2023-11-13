import CrudLayout from "@/components/CrudLayout";
import useContentEditorSuggestionItemActionTakens from "@/hooks/useContentEditorSuggestionItemActionTakens";
import Link from "next/link";
import { useState } from "react";

export default function ContentEditorSuggestionItemActionTakensPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { contentEditorSuggestionItemActionTakens, count } =
    useContentEditorSuggestionItemActionTakens(state);

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
        <h2>ContentEditorSuggestionItemActionTaken</h2>
        <Link
          className='border rounded'
          href={`/crud/content_editor_suggestion_item_action_taken/add`}
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
              <th>contentEditorSuggestionItemId</th>
              <th>value</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {contentEditorSuggestionItemActionTakens.map(
              (contentEditorSuggestionItemActionTaken) => {
                return (
                  <tr key={contentEditorSuggestionItemActionTaken.id}>
                    <td>{contentEditorSuggestionItemActionTaken.id}</td>
                    <td>
                      {new Date(
                        contentEditorSuggestionItemActionTaken.createdAt
                      ).toLocaleString()}
                    </td>
                    <td>
                      {new Date(
                        contentEditorSuggestionItemActionTaken.updatedAt
                      ).toLocaleString()}
                    </td>
                    <td>
                      <Link
                        href={`/crud/content_editor_suggestion_item/${contentEditorSuggestionItemActionTaken.contentEditorSuggestionItemId}`}
                        className='underline'
                      >
                        {
                          contentEditorSuggestionItemActionTaken.contentEditorSuggestionItemId
                        }
                      </Link>
                    </td>
                    <td>{contentEditorSuggestionItemActionTaken.value}</td>
                    <td>
                      <Link
                        href={`/crud/content_editor_suggestion_item_action_taken/${contentEditorSuggestionItemActionTaken.id}`}
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
