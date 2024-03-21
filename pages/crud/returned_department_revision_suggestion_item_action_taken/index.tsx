import CrudLayout from "@/components/CrudLayout";
import useReturnedDepartmentRevisionSuggestionItemActionTakens from "@/hooks/useReturnedDepartmentRevisionSuggestionItemActionTakens";
import Link from "next/link";
import { useState } from "react";

export default function ReturnedDepartmentRevisionSuggestionItemActionTakensPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { returnedDepartmentRevisionSuggestionItemActionTakens, count } =
    useReturnedDepartmentRevisionSuggestionItemActionTakens(state);

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
        <h2>ReturnedDepartmentRevisionSuggestionItemActionTaken</h2>
        <Link
          className="border rounded"
          href={`/crud/returned_department_revision_suggestion_item_action_taken/add`}
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
              <th>returnedDepartmentRevisionSuggestionItemId</th>
              <th>value</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {returnedDepartmentRevisionSuggestionItemActionTakens.map(
              (returnedDepartmentRevisionSuggestionItemActionTaken) => {
                return (
                  <tr
                    key={returnedDepartmentRevisionSuggestionItemActionTaken.id}
                  >
                    <td>
                      {returnedDepartmentRevisionSuggestionItemActionTaken.id}
                    </td>
                    <td>
                      {new Date(
                        returnedDepartmentRevisionSuggestionItemActionTaken.createdAt
                      ).toLocaleString()}
                    </td>
                    <td>
                      {new Date(
                        returnedDepartmentRevisionSuggestionItemActionTaken.updatedAt
                      ).toLocaleString()}
                    </td>
                    <td>
                      <Link
                        href={`/crud/returned_department_revision_suggestion_item/${returnedDepartmentRevisionSuggestionItemActionTaken.returnedDepartmentRevisionSuggestionItemId}`}
                        className="underline"
                      >
                        {
                          returnedDepartmentRevisionSuggestionItemActionTaken.returnedDepartmentRevisionSuggestionItemId
                        }
                      </Link>
                    </td>
                    <td>
                      {
                        returnedDepartmentRevisionSuggestionItemActionTaken.value
                      }
                    </td>
                    <td>
                      <Link
                        href={`/crud/returned_department_revision_suggestion_item_action_taken/${returnedDepartmentRevisionSuggestionItemActionTaken.id}`}
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
