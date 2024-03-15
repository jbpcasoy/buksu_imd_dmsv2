import CrudLayout from "@/components/CrudLayout";
import useSubmittedContentEditorSuggestions from "@/hooks/useSubmittedContentEditorSuggestions";
import Link from "next/link";
import { useState } from "react";

export default function SubmittedContentEditorSuggestionsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { submittedContentEditorSuggestions, count } =
    useSubmittedContentEditorSuggestions(state);

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
        <h2>SubmittedContentEditorSuggestion</h2>
        <Link
          className="border rounded"
          href={`/crud/submitted_content_editor_suggestion/add`}
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
            {submittedContentEditorSuggestions.map(
              (submittedContentEditorSuggestion) => {
                return (
                  <tr key={submittedContentEditorSuggestion.id}>
                    <td>{submittedContentEditorSuggestion.id}</td>
                    <td>
                      {new Date(
                        submittedContentEditorSuggestion.createdAt
                      ).toLocaleString()}
                    </td>
                    <td>
                      {new Date(
                        submittedContentEditorSuggestion.updatedAt
                      ).toLocaleString()}
                    </td>
                    <td>
                      <Link
                        href={`/crud/content_editor_suggestion/${submittedContentEditorSuggestion.contentEditorSuggestionId}`}
                        className="underline"
                      >
                        {
                          submittedContentEditorSuggestion.contentEditorSuggestionId
                        }
                      </Link>
                    </td>
                    <td>
                      <Link
                        href={`/crud/submitted_content_editor_suggestion/${submittedContentEditorSuggestion.id}`}
                        className="border rounded"
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
