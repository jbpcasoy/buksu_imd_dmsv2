import CrudLayout from "@/components/CrudLayout";
import useSubmittedPeerSuggestions from "@/hooks/useSubmittedPeerSuggestions";
import Link from "next/link";
import { useState } from "react";

export default function SubmittedPeerSuggestionsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { submittedPeerSuggestions, count } =
    useSubmittedPeerSuggestions(state);

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
        <h2>SubmittedPeerSuggestion</h2>
        <Link
          className="border rounded"
          href={`/crud/submitted_peer_suggestion/add`}
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
              <th>peerSuggestionId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {submittedPeerSuggestions.map((submittedPeerSuggestion) => {
              return (
                <tr key={submittedPeerSuggestion.id}>
                  <td>{submittedPeerSuggestion.id}</td>
                  <td>
                    {new Date(
                      submittedPeerSuggestion.createdAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    {new Date(
                      submittedPeerSuggestion.updatedAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    <Link
                      href={`/crud/peer_suggestion/${submittedPeerSuggestion.peerSuggestionId}`}
                      className="underline"
                    >
                      {submittedPeerSuggestion.peerSuggestionId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/submitted_peer_suggestion/${submittedPeerSuggestion.id}`}
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
