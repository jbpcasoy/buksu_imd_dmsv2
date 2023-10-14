import CrudLayout from "@/components/CrudLayout";
import useIDDCoordinatorSuggestionItems from "@/hooks/useIDDCoordinatorSuggestionItems";
import Link from "next/link";
import { useState } from "react";

export default function IDDCoordinatorSuggestionItemsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { iDDCoordinatorSuggestionItems, count } = useIDDCoordinatorSuggestionItems(state);

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
        <h2>IDDCoordinatorSuggestionItem</h2>
        <Link
          className='border rounded'
          href={`/crud/idd_coordinator_suggestion_item/add`}
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
              <th>iDDCoordinatorSuggestionId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {iDDCoordinatorSuggestionItems.map((iDDCoordinatorSuggestionItem) => {
              return (
                <tr key={iDDCoordinatorSuggestionItem.id}>
                  <td>{iDDCoordinatorSuggestionItem.id}</td>
                  <td>
                    {new Date(iDDCoordinatorSuggestionItem.createdAt).toLocaleString()}
                  </td>
                  <td>
                    {new Date(iDDCoordinatorSuggestionItem.updatedAt).toLocaleString()}
                  </td>
                  <td>
                    <Link
                      href={`/crud/iDDCoordinator_suggestion/${iDDCoordinatorSuggestionItem.iDDCoordinatorSuggestionId}`}
                      className='underline'
                    >
                      {iDDCoordinatorSuggestionItem.iDDCoordinatorSuggestionId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/idd_coordinator_suggestion_item/${iDDCoordinatorSuggestionItem.id}`}
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
