import CrudLayout from "@/components/CrudLayout";
import useContentEditorSuggestionItems from "@/hooks/useContentEditorSuggestionItems";
import Link from "next/link";
import { useState } from "react";

export default function ContentEditorSuggestionItemsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { contentEditorSuggestionItems, count } =
    useContentEditorSuggestionItems(state);

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
      <div className="flex justify-between">
        <h2>ContentEditorSuggestionItem</h2>
        <Link
          className="border rounded"
          href={`/crud/content_editor_suggestion_item/add`}
        >
          Add
        </Link>
      </div>

      <div>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th>id</th>
              <th>createdAt</th>
              <th>updatedAt</th>
              <th>contentEditorSuggestionId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {contentEditorSuggestionItems.map((contentEditorSuggestionItem) => {
              return (
                <tr key={contentEditorSuggestionItem.id}>
                  <td>{contentEditorSuggestionItem.id}</td>
                  <td>
                    {new Date(
                      contentEditorSuggestionItem.createdAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    {new Date(
                      contentEditorSuggestionItem.updatedAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    <Link
                      href={`/crud/content_editor_suggestion/${contentEditorSuggestionItem.contentEditorSuggestionId}`}
                      className="underline"
                    >
                      {contentEditorSuggestionItem.contentEditorSuggestionId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/content_editor_suggestion_item/${contentEditorSuggestionItem.id}`}
                      className="border rounded"
                    >
                      view
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex justify-end space-x-1">
          <p>
            {state.skip} - {state.skip + state.take} of {count}
          </p>
          <button className="border rounded" onClick={handlePrev}>
            prev
          </button>
          <button className="border rounded" onClick={handleNext}>
            next
          </button>
        </div>
      </div>
    </CrudLayout>
  );
}
