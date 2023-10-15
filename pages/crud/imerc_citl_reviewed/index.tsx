import CrudLayout from "@/components/CrudLayout";
import useIMERCCITLRevieweds from "@/hooks/useIMERCCITLRevieweds";
import Link from "next/link";
import { useState } from "react";

export default function IMERCCITLReviewedsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { iMERCCITLRevieweds, count } = useIMERCCITLRevieweds(state);

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
        <h2>IMERCCITLReviewed Reviewed</h2>
      </div>

      <div>
        <table className='table-auto w-full'>
          <thead>
            <tr>
              <th>id</th>
              <th>createdAt</th>
              <th>updatedAt</th>
              <th>submittedContentEditorSuggestionId</th>
              <th>submittedContentSpecialistSuggestionId</th>
              <th>submittedIDDSpecialistSuggestionId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {iMERCCITLRevieweds.map((iMERCCITLReviewed) => {
              return (
                <tr key={iMERCCITLReviewed.id}>
                  <td>{iMERCCITLReviewed.id}</td>
                  <td>{new Date(iMERCCITLReviewed.createdAt).toLocaleString()}</td>
                  <td>{new Date(iMERCCITLReviewed.updatedAt).toLocaleString()}</td>
                  <td>
                    <Link
                      href={`/crud/submitted_chairperson_suggestion/${iMERCCITLReviewed.submittedContentEditorSuggestionId}`}
                      className='underline'
                    >
                      {iMERCCITLReviewed.submittedContentEditorSuggestionId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/submitted_coordinator_suggestion/${iMERCCITLReviewed.submittedContentSpecialistSuggestionId}`}
                      className='underline'
                    >
                      {iMERCCITLReviewed.submittedContentSpecialistSuggestionId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/submitted_peer_suggestion/${iMERCCITLReviewed.submittedIDDSpecialistSuggestionId}`}
                      className='underline'
                    >
                      {iMERCCITLReviewed.submittedIDDSpecialistSuggestionId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/imerc_citl_reviewed/${iMERCCITLReviewed.id}`}
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
