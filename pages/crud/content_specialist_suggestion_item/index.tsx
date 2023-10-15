import CrudLayout from "@/components/CrudLayout";
import useContentSpecialistSuggestionItems from "@/hooks/useContentSpecialistSuggestionItems";
import Link from "next/link";
import { useState } from "react";

export default function ContentSpecialistSuggestionItemsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { contentSpecialistSuggestionItems, count } = useContentSpecialistSuggestionItems(state);

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
        <h2>ContentSpecialistSuggestionItem</h2>
        <Link
          className='border rounded'
          href={`/crud/content_specialist_suggestion_item/add`}
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
              <th>contentSpecialistSuggestionId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {contentSpecialistSuggestionItems.map((contentSpecialistSuggestionItem) => {
              return (
                <tr key={contentSpecialistSuggestionItem.id}>
                  <td>{contentSpecialistSuggestionItem.id}</td>
                  <td>
                    {new Date(contentSpecialistSuggestionItem.createdAt).toLocaleString()}
                  </td>
                  <td>
                    {new Date(contentSpecialistSuggestionItem.updatedAt).toLocaleString()}
                  </td>
                  <td>
                    <Link
                      href={`/crud/peer_suggestion/${contentSpecialistSuggestionItem.contentSpecialistSuggestionId}`}
                      className='underline'
                    >
                      {contentSpecialistSuggestionItem.contentSpecialistSuggestionId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/content_specialist_suggestion_item/${contentSpecialistSuggestionItem.id}`}
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
