import CrudLayout from "@/components/CrudLayout";
import useSubmittedChairpersonSuggestions from "@/hooks/useSubmittedChairpersonSuggestions";
import Link from "next/link";
import { useState } from "react";

export default function SubmittedChairpersonSuggestionsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { submittedChairpersonSuggestions, count } =
    useSubmittedChairpersonSuggestions(state);

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
        <h2>SubmittedChairpersonSuggestion</h2>
        <Link
          className="border rounded"
          href={`/crud/submitted_chairperson_suggestion/add`}
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
              <th>chairpersonSuggestionId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {submittedChairpersonSuggestions.map(
              (submittedChairpersonSuggestion) => {
                return (
                  <tr key={submittedChairpersonSuggestion.id}>
                    <td>{submittedChairpersonSuggestion.id}</td>
                    <td>
                      {new Date(
                        submittedChairpersonSuggestion.createdAt
                      ).toLocaleString()}
                    </td>
                    <td>
                      {new Date(
                        submittedChairpersonSuggestion.updatedAt
                      ).toLocaleString()}
                    </td>
                    <td>
                      <Link
                        href={`/crud/chairperson_suggestion/${submittedChairpersonSuggestion.chairpersonSuggestionId}`}
                        className="underline"
                      >
                        {submittedChairpersonSuggestion.chairpersonSuggestionId}
                      </Link>
                    </td>
                    <td>
                      <Link
                        href={`/crud/submitted_chairperson_suggestion/${submittedChairpersonSuggestion.id}`}
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
