import CrudLayout from "@/components/CrudLayout";
import useDepartmentReviews from "@/hooks/useDepartmentReviews";
import Link from "next/link";
import { useState } from "react";

export default function DepartmentReviewsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { departmentReviews, count } = useDepartmentReviews(state);

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
        <h2>DepartmentReview</h2>
        <Link className='border rounded' href={`/crud/department_review/add`}>
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
              <th>iMFileId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {departmentReviews.map((departmentReview) => {
              return (
                <tr key={departmentReview.id}>
                  <td>{departmentReview.id}</td>
                  <td>
                    {new Date(departmentReview.createdAt).toLocaleString()}
                  </td>
                  <td>
                    {new Date(departmentReview.updatedAt).toLocaleString()}
                  </td>
                  <td>
                    <Link
                      href={`/crud/im_file/${departmentReview.iMFileId}`}
                      className='underline'
                    >
                      {departmentReview.iMFileId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/department_review/${departmentReview.id}`}
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
