import CrudLayout from "@/components/CrudLayout";
import useCoordinatorSuggestionItems from "@/hooks/useCoordinatorSuggestionItems";
import Link from "next/link";
import { useState } from "react";

export default function CoordinatorSuggestionItemsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { coordinatorSuggestionItems, count } =
    useCoordinatorSuggestionItems(state);

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
        <h2>CoordinatorSuggestionItem</h2>
        <Link
          className="border rounded"
          href={`/crud/coordinator_suggestion_item/add`}
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
              <th>coordinatorSuggestionId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {coordinatorSuggestionItems.map((coordinatorSuggestionItem) => {
              return (
                <tr key={coordinatorSuggestionItem.id}>
                  <td>{coordinatorSuggestionItem.id}</td>
                  <td>
                    {new Date(
                      coordinatorSuggestionItem.createdAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    {new Date(
                      coordinatorSuggestionItem.updatedAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    <Link
                      href={`/crud/coordinator_suggestion/${coordinatorSuggestionItem.coordinatorSuggestionId}`}
                      className="underline"
                    >
                      {coordinatorSuggestionItem.coordinatorSuggestionId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/coordinator_suggestion_item/${coordinatorSuggestionItem.id}`}
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
