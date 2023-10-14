import CrudLayout from "@/components/CrudLayout";
import useDepartmentRevieweds from "@/hooks/useDepartmentRevieweds";
import Link from "next/link";
import { useState } from "react";

export default function DepartmentReviewedsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { departmentRevieweds, count } = useDepartmentRevieweds(state);

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
        <h2>DepartmentReviewed Reviewed</h2>
      </div>

      <div>
        <table className='table-auto w-full'>
          <thead>
            <tr>
              <th>id</th>
              <th>createdAt</th>
              <th>updatedAt</th>
              <th>submittedChairpersonSuggestionId</th>
              <th>submittedCoordinatorSuggestionId</th>
              <th>submittedPeerSuggestionId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {departmentRevieweds.map((departmentReviewed) => {
              return (
                <tr key={departmentReviewed.id}>
                  <td>{departmentReviewed.id}</td>
                  <td>{new Date(departmentReviewed.createdAt).toLocaleString()}</td>
                  <td>{new Date(departmentReviewed.updatedAt).toLocaleString()}</td>
                  <td>
                    <Link
                      href={`/crud/submitted_chairperson_suggestion/${departmentReviewed.submittedChairpersonSuggestionId}`}
                      className='underline'
                    >
                      {departmentReviewed.submittedChairpersonSuggestionId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/submitted_coordinator_suggestion/${departmentReviewed.submittedCoordinatorSuggestionId}`}
                      className='underline'
                    >
                      {departmentReviewed.submittedCoordinatorSuggestionId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/submitted_peer_suggestion/${departmentReviewed.submittedPeerSuggestionId}`}
                      className='underline'
                    >
                      {departmentReviewed.submittedPeerSuggestionId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/department_reviewed/${departmentReviewed.id}`}
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
