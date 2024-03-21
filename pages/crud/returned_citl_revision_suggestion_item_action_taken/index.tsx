import CrudLayout from "@/components/CrudLayout";
import useReturnedCITLRevisionSuggestionItemActionTakens from "@/hooks/useReturnedCITLRevisionSuggestionItemActionTakens";
import Link from "next/link";
import { useState } from "react";

export default function ReturnedCITLRevisionSuggestionItemActionTakensPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { returnedCITLRevisionSuggestionItemActionTakens, count } =
    useReturnedCITLRevisionSuggestionItemActionTakens(state);

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
        <h2>ReturnedCITLRevisionSuggestionItemActionTaken</h2>
        <Link
          className="border rounded"
          href={`/crud/returned_citl_revision_suggestion_item_action_taken/add`}
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
              <th>returnedCITLRevisionSuggestionItemId</th>
              <th>value</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {returnedCITLRevisionSuggestionItemActionTakens.map(
              (returnedCITLRevisionSuggestionItemActionTaken) => {
                return (
                  <tr key={returnedCITLRevisionSuggestionItemActionTaken.id}>
                    <td>{returnedCITLRevisionSuggestionItemActionTaken.id}</td>
                    <td>
                      {new Date(
                        returnedCITLRevisionSuggestionItemActionTaken.createdAt
                      ).toLocaleString()}
                    </td>
                    <td>
                      {new Date(
                        returnedCITLRevisionSuggestionItemActionTaken.updatedAt
                      ).toLocaleString()}
                    </td>
                    <td>
                      <Link
                        href={`/crud/returned_citl_revision_suggestion_item/${returnedCITLRevisionSuggestionItemActionTaken.returnedCITLRevisionSuggestionItemId}`}
                        className="underline"
                      >
                        {
                          returnedCITLRevisionSuggestionItemActionTaken.returnedCITLRevisionSuggestionItemId
                        }
                      </Link>
                    </td>
                    <td>
                      {returnedCITLRevisionSuggestionItemActionTaken.value}
                    </td>
                    <td>
                      <Link
                        href={`/crud/returned_citl_revision_suggestion_item_action_taken/${returnedCITLRevisionSuggestionItemActionTaken.id}`}
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
