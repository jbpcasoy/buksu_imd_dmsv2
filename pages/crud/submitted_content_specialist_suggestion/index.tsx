import CrudLayout from "@/components/CrudLayout";
import useSubmittedContentSpecialistSuggestions from "@/hooks/useSubmittedContentSpecialistSuggestions";
import Link from "next/link";
import { useState } from "react";

export default function SubmittedContentSpecialistSuggestionsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { submittedContentSpecialistSuggestions, count } =
    useSubmittedContentSpecialistSuggestions(state);

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
        <h2>SubmittedContentSpecialistSuggestion</h2>
        <Link
          className="border rounded"
          href={`/crud/submitted_content_specialist_suggestion/add`}
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
              <th>contentSpecialistSuggestionId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {submittedContentSpecialistSuggestions.map(
              (submittedContentSpecialistSuggestion) => {
                return (
                  <tr key={submittedContentSpecialistSuggestion.id}>
                    <td>{submittedContentSpecialistSuggestion.id}</td>
                    <td>
                      {new Date(
                        submittedContentSpecialistSuggestion.createdAt
                      ).toLocaleString()}
                    </td>
                    <td>
                      {new Date(
                        submittedContentSpecialistSuggestion.updatedAt
                      ).toLocaleString()}
                    </td>
                    <td>
                      <Link
                        href={`/crud/content_specialist_suggestion/${submittedContentSpecialistSuggestion.contentSpecialistSuggestionId}`}
                        className="underline"
                      >
                        {
                          submittedContentSpecialistSuggestion.contentSpecialistSuggestionId
                        }
                      </Link>
                    </td>
                    <td>
                      <Link
                        href={`/crud/submitted_content_specialist_suggestion/${submittedContentSpecialistSuggestion.id}`}
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
