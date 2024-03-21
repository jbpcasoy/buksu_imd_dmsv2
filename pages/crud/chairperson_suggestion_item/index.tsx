import CrudLayout from "@/components/CrudLayout";
import useChairpersonSuggestionItems from "@/hooks/useChairpersonSuggestionItems";
import Link from "next/link";
import { useState } from "react";

export default function ChairpersonSuggestionItemsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { chairpersonSuggestionItems, count } =
    useChairpersonSuggestionItems(state);

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
        <h2>ChairpersonSuggestionItem</h2>
        <Link
          className="border rounded"
          href={`/crud/chairperson_suggestion_item/add`}
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
              <th>chairpersonSuggestionId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {chairpersonSuggestionItems.map((chairpersonSuggestionItem) => {
              return (
                <tr key={chairpersonSuggestionItem.id}>
                  <td>{chairpersonSuggestionItem.id}</td>
                  <td>
                    {new Date(
                      chairpersonSuggestionItem.createdAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    {new Date(
                      chairpersonSuggestionItem.updatedAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    <Link
                      href={`/crud/chairperson_suggestion/${chairpersonSuggestionItem.chairpersonSuggestionId}`}
                      className="underline"
                    >
                      {chairpersonSuggestionItem.chairpersonSuggestionId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/chairperson_suggestion_item/${chairpersonSuggestionItem.id}`}
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
