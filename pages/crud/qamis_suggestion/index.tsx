import CrudLayout from "@/components/CrudLayout";
import useQAMISSuggestions from "@/hooks/useQAMISSuggestions";
import Link from "next/link";
import { useState } from "react";

export default function QAMISSuggestionsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { qAMISSuggestions, count } = useQAMISSuggestions(state);

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
        <h2>QAMISSuggestion</h2>
        <Link className="border rounded" href={`/crud/qamis_suggestion/add`}>
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
              <th>cITLDirectorEndorsementId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {qAMISSuggestions.map((qAMISSuggestion) => {
              return (
                <tr key={qAMISSuggestion.id}>
                  <td>{qAMISSuggestion.id}</td>
                  <td>
                    {new Date(qAMISSuggestion.createdAt).toLocaleString()}
                  </td>
                  <td>
                    {new Date(qAMISSuggestion.updatedAt).toLocaleString()}
                  </td>
                  <td>
                    <Link
                      href={`/crud/citl_endorsement/${qAMISSuggestion.cITLDirectorEndorsementId}`}
                      className="underline"
                    >
                      {qAMISSuggestion.cITLDirectorEndorsementId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/qamis_suggestion/${qAMISSuggestion.id}`}
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
