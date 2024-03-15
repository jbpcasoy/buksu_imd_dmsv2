import CrudLayout from "@/components/CrudLayout";
import useReturnedIMERCCITLRevisionSuggestionItems from "@/hooks/useReturnedIMERCCITLRevisionSuggestionItems";
import Link from "next/link";
import { useState } from "react";

export default function ReturnedIMERCCITLRevisionSuggestionItemsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { returnedIMERCCITLRevisionSuggestionItems, count } =
    useReturnedIMERCCITLRevisionSuggestionItems(state);

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
        <h2>ReturnedIMERCCITLRevisionSuggestionItem</h2>
        <Link
          className="border rounded"
          href={`/crud/returned_imerc_citl_revision_suggestion_item/add`}
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
              <th>returnedIMERCCITLRevisionId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {returnedIMERCCITLRevisionSuggestionItems.map(
              (returnedIMERCCITLRevisionSuggestionItem) => {
                return (
                  <tr key={returnedIMERCCITLRevisionSuggestionItem.id}>
                    <td>{returnedIMERCCITLRevisionSuggestionItem.id}</td>
                    <td>
                      {new Date(
                        returnedIMERCCITLRevisionSuggestionItem.createdAt
                      ).toLocaleString()}
                    </td>
                    <td>
                      {new Date(
                        returnedIMERCCITLRevisionSuggestionItem.updatedAt
                      ).toLocaleString()}
                    </td>
                    <td>
                      <Link
                        href={`/crud/returned_imerc_citl_revision/${returnedIMERCCITLRevisionSuggestionItem.returnedIMERCCITLRevisionId}`}
                        className="underline"
                      >
                        {
                          returnedIMERCCITLRevisionSuggestionItem.returnedIMERCCITLRevisionId
                        }
                      </Link>
                    </td>
                    <td>
                      <Link
                        href={`/crud/returned_imerc_citl_revision_suggestion_item/${returnedIMERCCITLRevisionSuggestionItem.id}`}
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
