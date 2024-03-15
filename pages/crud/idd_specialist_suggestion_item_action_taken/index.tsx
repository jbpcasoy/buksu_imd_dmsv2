import CrudLayout from "@/components/CrudLayout";
import useIDDSpecialistSuggestionItemActionTakens from "@/hooks/useIDDSpecialistSuggestionItemActionTakens";
import Link from "next/link";
import { useState } from "react";

export default function IDDSpecialistSuggestionItemActionTakensPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { iDDSpecialistSuggestionItemActionTakens, count } =
    useIDDSpecialistSuggestionItemActionTakens(state);

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
        <h2>IDDSpecialistSuggestionItemActionTaken</h2>
        <Link
          className="border rounded"
          href={`/crud/idd_specialist_suggestion_item_action_taken/add`}
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
              <th>iDDSpecialistSuggestionItemId</th>
              <th>value</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {iDDSpecialistSuggestionItemActionTakens.map(
              (iDDSpecialistSuggestionItemActionTaken) => {
                return (
                  <tr key={iDDSpecialistSuggestionItemActionTaken.id}>
                    <td>{iDDSpecialistSuggestionItemActionTaken.id}</td>
                    <td>
                      {new Date(
                        iDDSpecialistSuggestionItemActionTaken.createdAt
                      ).toLocaleString()}
                    </td>
                    <td>
                      {new Date(
                        iDDSpecialistSuggestionItemActionTaken.updatedAt
                      ).toLocaleString()}
                    </td>
                    <td>
                      <Link
                        href={`/crud/idd_specialist_suggestion_item/${iDDSpecialistSuggestionItemActionTaken.iDDSpecialistSuggestionItemId}`}
                        className="underline"
                      >
                        {
                          iDDSpecialistSuggestionItemActionTaken.iDDSpecialistSuggestionItemId
                        }
                      </Link>
                    </td>
                    <td>{iDDSpecialistSuggestionItemActionTaken.value}</td>
                    <td>
                      <Link
                        href={`/crud/idd_specialist_suggestion_item_action_taken/${iDDSpecialistSuggestionItemActionTaken.id}`}
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
