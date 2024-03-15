import CrudLayout from "@/components/CrudLayout";
import useIDDCoordinatorSuggestionItemActionTakens from "@/hooks/useIDDCoordinatorSuggestionItemActionTakens";
import Link from "next/link";
import { useState } from "react";

export default function IDDCoordinatorSuggestionItemActionTakensPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { iDDCoordinatorSuggestionItemActionTakens, count } =
    useIDDCoordinatorSuggestionItemActionTakens(state);

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
        <h2>IDDCoordinatorSuggestionItemActionTaken</h2>
        <Link
          className="border rounded"
          href={`/crud/idd_coordinator_suggestion_item_action_taken/add`}
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
              <th>iDDCoordinatorSuggestionItemId</th>
              <th>value</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {iDDCoordinatorSuggestionItemActionTakens.map(
              (iDDCoordinatorSuggestionItemActionTaken) => {
                return (
                  <tr key={iDDCoordinatorSuggestionItemActionTaken.id}>
                    <td>{iDDCoordinatorSuggestionItemActionTaken.id}</td>
                    <td>
                      {new Date(
                        iDDCoordinatorSuggestionItemActionTaken.createdAt
                      ).toLocaleString()}
                    </td>
                    <td>
                      {new Date(
                        iDDCoordinatorSuggestionItemActionTaken.updatedAt
                      ).toLocaleString()}
                    </td>
                    <td>
                      <Link
                        href={`/crud/idd_coordinator_suggestion_item/${iDDCoordinatorSuggestionItemActionTaken.iDDCoordinatorSuggestionItemId}`}
                        className="underline"
                      >
                        {
                          iDDCoordinatorSuggestionItemActionTaken.iDDCoordinatorSuggestionItemId
                        }
                      </Link>
                    </td>
                    <td>{iDDCoordinatorSuggestionItemActionTaken.value}</td>
                    <td>
                      <Link
                        href={`/crud/idd_coordinator_suggestion_item_action_taken/${iDDCoordinatorSuggestionItemActionTaken.id}`}
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
