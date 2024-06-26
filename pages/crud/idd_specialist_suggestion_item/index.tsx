import CrudLayout from "@/components/CrudLayout";
import useIDDSpecialistSuggestionItems from "@/hooks/useIDDSpecialistSuggestionItems";
import Link from "next/link";
import { useState } from "react";

export default function IDDSpecialistSuggestionItemsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { iDDSpecialistSuggestionItems, count } =
    useIDDSpecialistSuggestionItems(state);

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
        <h2>IDDSpecialistSuggestionItem</h2>
        <Link
          className="border rounded"
          href={`/crud/idd_specialist_suggestion_item/add`}
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
              <th>iDDSpecialistSuggestionId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {iDDSpecialistSuggestionItems.map((iDDSpecialistSuggestionItem) => {
              return (
                <tr key={iDDSpecialistSuggestionItem.id}>
                  <td>{iDDSpecialistSuggestionItem.id}</td>
                  <td>
                    {new Date(
                      iDDSpecialistSuggestionItem.createdAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    {new Date(
                      iDDSpecialistSuggestionItem.updatedAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    <Link
                      href={`/crud/idd_specialist_suggestion/${iDDSpecialistSuggestionItem.iDDSpecialistSuggestionId}`}
                      className="underline"
                    >
                      {iDDSpecialistSuggestionItem.iDDSpecialistSuggestionId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/idd_specialist_suggestion_item/${iDDSpecialistSuggestionItem.id}`}
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
