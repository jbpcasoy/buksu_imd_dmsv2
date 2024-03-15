import CrudLayout from "@/components/CrudLayout";
import useSubmittedQAMISSuggestions from "@/hooks/useSubmittedQAMISSuggestions";
import Link from "next/link";
import { useState } from "react";

export default function SubmittedQAMISSuggestionsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { submittedQAMISSuggestions, count } =
    useSubmittedQAMISSuggestions(state);

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
        <h2>SubmittedQAMISSuggestion</h2>
        <Link
          className="border rounded"
          href={`/crud/submitted_qamis_suggestion/add`}
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
              <th>qAMISSuggestionId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {submittedQAMISSuggestions.map((submittedQAMISSuggestion) => {
              return (
                <tr key={submittedQAMISSuggestion.id}>
                  <td>{submittedQAMISSuggestion.id}</td>
                  <td>
                    {new Date(
                      submittedQAMISSuggestion.createdAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    {new Date(
                      submittedQAMISSuggestion.updatedAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    <Link
                      href={`/crud/qamis_suggestion/${submittedQAMISSuggestion.qAMISSuggestionId}`}
                      className="underline"
                    >
                      {submittedQAMISSuggestion.qAMISSuggestionId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/submitted_qamis_suggestion/${submittedQAMISSuggestion.id}`}
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
