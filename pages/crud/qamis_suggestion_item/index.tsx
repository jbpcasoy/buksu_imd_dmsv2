import CrudLayout from "@/components/CrudLayout";
import useQAMISSuggestionItems from "@/hooks/useQAMISSuggestionItems";
import Link from "next/link";
import { useState } from "react";

export default function QAMISSuggestionItemsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { qAMISSuggestionItems, count } = useQAMISSuggestionItems(state);

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
        <h2>QAMISSuggestionItem</h2>
        <Link
          className='border rounded'
          href={`/crud/qamis_suggestion_item/add`}
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
              <th>qAMISSuggestionId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {qAMISSuggestionItems.map((qAMISSuggestionItem) => {
              return (
                <tr key={qAMISSuggestionItem.id}>
                  <td>{qAMISSuggestionItem.id}</td>
                  <td>
                    {new Date(qAMISSuggestionItem.createdAt).toLocaleString()}
                  </td>
                  <td>
                    {new Date(qAMISSuggestionItem.updatedAt).toLocaleString()}
                  </td>
                  <td>
                    <Link
                      href={`/crud/qamis_suggestion/${qAMISSuggestionItem.qAMISSuggestionId}`}
                      className='underline'
                    >
                      {qAMISSuggestionItem.qAMISSuggestionId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/qamis_suggestion_item/${qAMISSuggestionItem.id}`}
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
