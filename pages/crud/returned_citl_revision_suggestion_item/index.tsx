import CrudLayout from "@/components/CrudLayout";
import useReturnedCITLRevisionSuggestionItems from "@/hooks/useReturnedCITLRevisionSuggestionItems";
import Link from "next/link";
import { useState } from "react";

export default function ReturnedCITLRevisionSuggestionItemsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { returnedCITLRevisionSuggestionItems, count } = useReturnedCITLRevisionSuggestionItems(state);

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
      <div className='flex justify-between'>
        <h2>ReturnedCITLRevisionSuggestionItem</h2>
        <Link
          className='border rounded'
          href={`/crud/returned_citl_revision_suggestion_item/add`}
        >
          Add
        </Link>
      </div>

      <div>
        <table className='table-auto w-full'>
          <thead>
            <tr>
              <th>id</th>
              <th>createdAt</th>
              <th>updatedAt</th>
              <th>returnedCITLRevisionId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {returnedCITLRevisionSuggestionItems.map((returnedCITLRevisionSuggestionItem) => {
              return (
                <tr key={returnedCITLRevisionSuggestionItem.id}>
                  <td>{returnedCITLRevisionSuggestionItem.id}</td>
                  <td>
                    {new Date(returnedCITLRevisionSuggestionItem.createdAt).toLocaleString()}
                  </td>
                  <td>
                    {new Date(returnedCITLRevisionSuggestionItem.updatedAt).toLocaleString()}
                  </td>
                  <td>
                    <Link
                      href={`/crud/returned_citl_revision/${returnedCITLRevisionSuggestionItem.returnedCITLRevisionId}`}
                      className='underline'
                    >
                      {returnedCITLRevisionSuggestionItem.returnedCITLRevisionId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/returned_citl_revision_suggestion_item/${returnedCITLRevisionSuggestionItem.id}`}
                      className='border rounded'
                    >
                      view
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className='flex justify-end space-x-1'>
          <p>
            {state.skip} - {state.skip + state.take} of {count}
          </p>
          <button className='border rounded' onClick={handlePrev}>
            prev
          </button>
          <button className='border rounded' onClick={handleNext}>
            next
          </button>
        </div>
      </div>
    </CrudLayout>
  );
}
