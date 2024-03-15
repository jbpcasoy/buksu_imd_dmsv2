import CrudLayout from "@/components/CrudLayout";
import useCoordinatorReviews from "@/hooks/useCoordinatorReviews";
import Link from "next/link";
import { useState } from "react";

export default function CoordinatorReviewsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { coordinatorReviews, count } = useCoordinatorReviews(state);

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
      <div className="flex justify-between">
        <h2>CoordinatorReview</h2>
        <Link className="border rounded" href={`/crud/coordinator_review/add`}>
          Add
        </Link>
      </div>

      <div>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th>id</th>
              <th>createdAt</th>
              <th>updatedAt</th>
              <th>departmentReviewId</th>
              <th>coordinatorId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {coordinatorReviews.map((coordinatorReview) => {
              return (
                <tr key={coordinatorReview.id}>
                  <td>{coordinatorReview.id}</td>
                  <td>
                    {new Date(coordinatorReview.createdAt).toLocaleString()}
                  </td>
                  <td>
                    {new Date(coordinatorReview.updatedAt).toLocaleString()}
                  </td>
                  <td>
                    <Link
                      href={`/crud/department_review/${coordinatorReview.departmentReviewId}`}
                      className="underline"
                    >
                      {coordinatorReview.departmentReviewId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/coordinator/${coordinatorReview.coordinatorId}`}
                      className="underline"
                    >
                      {coordinatorReview.coordinatorId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/coordinator_review/${coordinatorReview.id}`}
                      className="border rounded"
                    >
                      view
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex justify-end space-x-1">
          <p>
            {state.skip} - {state.skip + state.take} of {count}
          </p>
          <button className="border rounded" onClick={handlePrev}>
            prev
          </button>
          <button className="border rounded" onClick={handleNext}>
            next
          </button>
        </div>
      </div>
    </CrudLayout>
  );
}
