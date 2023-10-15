import CrudLayout from "@/components/CrudLayout";
import useContentSpecialistReviews from "@/hooks/useContentSpecialistReviews";
import Link from "next/link";
import { useState } from "react";

export default function ContentSpecialistReviewsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { contentSpecialistReviews, count } = useContentSpecialistReviews(state);

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
        <h2>ContentSpecialistReview</h2>
        <Link className='border rounded' href={`/crud/content_specialist_review/add`}>
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
              <th>qAMISDepartmentEndorsementId</th>
              <th>facultyId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {contentSpecialistReviews.map((contentSpecialistReview) => {
              return (
                <tr key={contentSpecialistReview.id}>
                  <td>{contentSpecialistReview.id}</td>
                  <td>{new Date(contentSpecialistReview.createdAt).toLocaleString()}</td>
                  <td>{new Date(contentSpecialistReview.updatedAt).toLocaleString()}</td>
                  <td>
                    <Link
                      href={`/crud/qamis_department_endorsement/${contentSpecialistReview.qAMISDepartmentEndorsementId}`}
                      className='underline'
                    >
                      {contentSpecialistReview.qAMISDepartmentEndorsementId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/faculty/${contentSpecialistReview.facultyId}`}
                      className='underline'
                    >
                      {contentSpecialistReview.facultyId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/content_specialist_review/${contentSpecialistReview.id}`}
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
