import CrudLayout from "@/components/CrudLayout";
import useContentEditorReviews from "@/hooks/useContentEditorReviews";
import Link from "next/link";
import { useState } from "react";

export default function ContentEditorReviewsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { contentEditorReviews, count } = useContentEditorReviews(state);

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
        <h2>ContentEditorReview</h2>
        <Link className='border rounded' href={`/crud/content_editor_review/add`}>
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
              <th>cITLDirectorId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {contentEditorReviews.map((contentEditorReview) => {
              return (
                <tr key={contentEditorReview.id}>
                  <td>{contentEditorReview.id}</td>
                  <td>{new Date(contentEditorReview.createdAt).toLocaleString()}</td>
                  <td>{new Date(contentEditorReview.updatedAt).toLocaleString()}</td>
                  <td>
                    <Link
                      href={`/crud/qamis_department_endorsement_review/${contentEditorReview.qAMISDepartmentEndorsementId}`}
                      className='underline'
                    >
                      {contentEditorReview.qAMISDepartmentEndorsementId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/citl_director/${contentEditorReview.cITLDirectorId}`}
                      className='underline'
                    >
                      {contentEditorReview.cITLDirectorId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/content_editor_review/${contentEditorReview.id}`}
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
