import CrudLayout from "@/components/CrudLayout";
import useReturnedDepartmentRevisionSuggestionItems from "@/hooks/useReturnedDepartmentRevisionSuggestionItems";
import Link from "next/link";
import { useState } from "react";

export default function ReturnedDepartmentRevisionSuggestionItemsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { returnedDepartmentRevisionSuggestionItems, count } =
    useReturnedDepartmentRevisionSuggestionItems(state);

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
        <h2>ReturnedDepartmentRevisionSuggestionItem</h2>
        <Link
          className="border rounded"
          href={`/crud/returned_department_revision_suggestion_item/add`}
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
              <th>returnedDepartmentRevisionId</th>
              <th>action</th>
            </tr>
            {/* NOTE: do not add suggestion and remarks as these tend to be long. */}
          </thead>
          <tbody>
            {returnedDepartmentRevisionSuggestionItems.map(
              (returnedDepartmentRevisionSuggestionItem) => {
                return (
                  <tr key={returnedDepartmentRevisionSuggestionItem.id}>
                    <td>{returnedDepartmentRevisionSuggestionItem.id}</td>
                    <td>
                      {new Date(
                        returnedDepartmentRevisionSuggestionItem.createdAt
                      ).toLocaleString()}
                    </td>
                    <td>
                      {new Date(
                        returnedDepartmentRevisionSuggestionItem.updatedAt
                      ).toLocaleString()}
                    </td>
                    <td>
                      <Link
                        href={`/crud/returned_department_revision/${returnedDepartmentRevisionSuggestionItem.returnedDepartmentRevisionId}`}
                        className="underline"
                      >
                        {
                          returnedDepartmentRevisionSuggestionItem.returnedDepartmentRevisionId
                        }
                      </Link>
                    </td>
                    <td>
                      <Link
                        href={`/crud/returned_department_revision_suggestion_item/${returnedDepartmentRevisionSuggestionItem.id}`}
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
