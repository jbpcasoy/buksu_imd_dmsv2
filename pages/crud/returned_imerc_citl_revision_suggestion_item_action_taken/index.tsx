import CrudLayout from "@/components/CrudLayout";
import useReturnedIMERCCITLRevisionSuggestionItemActionTakens from "@/hooks/useReturnedIMERCCITLRevisionSuggestionItemActionTakens";
import Link from "next/link";
import { useState } from "react";

export default function ReturnedIMERCCITLRevisionSuggestionItemActionTakensPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { returnedIMERCCITLRevisionSuggestionItemActionTakens, count } =
    useReturnedIMERCCITLRevisionSuggestionItemActionTakens(state);

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
        <h2>ReturnedIMERCCITLRevisionSuggestionItemActionTaken</h2>
        <Link
          className='border rounded'
          href={`/crud/returned_imerc_citl_revision_suggestion_item_action_taken/add`}
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
              <th>returnedIMERCCITLRevisionSuggestionItemId</th>
              <th>value</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {returnedIMERCCITLRevisionSuggestionItemActionTakens.map(
              (returnedIMERCCITLRevisionSuggestionItemActionTaken) => {
                return (
                  <tr key={returnedIMERCCITLRevisionSuggestionItemActionTaken.id}>
                    <td>{returnedIMERCCITLRevisionSuggestionItemActionTaken.id}</td>
                    <td>
                      {new Date(
                        returnedIMERCCITLRevisionSuggestionItemActionTaken.createdAt
                      ).toLocaleString()}
                    </td>
                    <td>
                      {new Date(
                        returnedIMERCCITLRevisionSuggestionItemActionTaken.updatedAt
                      ).toLocaleString()}
                    </td>
                    <td>
                      <Link
                        href={`/crud/returned_imerc_citl_revision_suggestion_item/${returnedIMERCCITLRevisionSuggestionItemActionTaken.returnedIMERCCITLRevisionSuggestionItemId}`}
                        className='underline'
                      >
                        {returnedIMERCCITLRevisionSuggestionItemActionTaken.returnedIMERCCITLRevisionSuggestionItemId}
                      </Link>
                    </td>
                    <td>{returnedIMERCCITLRevisionSuggestionItemActionTaken.value}</td>
                    <td>
                      <Link
                        href={`/crud/returned_imerc_citl_revision_suggestion_item_action_taken/${returnedIMERCCITLRevisionSuggestionItemActionTaken.id}`}
                        className='border rounded'
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
