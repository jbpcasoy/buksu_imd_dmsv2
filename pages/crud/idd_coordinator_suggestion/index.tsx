import CrudLayout from "@/components/CrudLayout";
import useIDDCoordinatorSuggestions from "@/hooks/useIDDCoordinatorSuggestions";
import Link from "next/link";
import { useState } from "react";

export default function IDDCoordinatorSuggestionsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { iDDCoordinatorSuggestions, count } =
    useIDDCoordinatorSuggestions(state);

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
        <h2>IDDCoordinatorSuggestion</h2>
        <Link
          className="border rounded"
          href={`/crud/idd_coordinator_suggestion/add`}
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
              <th>deanEndorsementId</th>
              <th>iDDCoordinatorId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {iDDCoordinatorSuggestions.map((iDDCoordinatorSuggestion) => {
              return (
                <tr key={iDDCoordinatorSuggestion.id}>
                  <td>{iDDCoordinatorSuggestion.id}</td>
                  <td>
                    {new Date(
                      iDDCoordinatorSuggestion.createdAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    {new Date(
                      iDDCoordinatorSuggestion.updatedAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    <Link
                      href={`/crud/dean_endorsement/${iDDCoordinatorSuggestion.deanEndorsementId}`}
                      className="underline"
                    >
                      {iDDCoordinatorSuggestion.deanEndorsementId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/idd_coordinator/${iDDCoordinatorSuggestion.iDDCoordinatorId}`}
                      className="underline"
                    >
                      {iDDCoordinatorSuggestion.iDDCoordinatorId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/idd_coordinator_suggestion/${iDDCoordinatorSuggestion.id}`}
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
