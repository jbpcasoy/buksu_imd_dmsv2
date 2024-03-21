import CrudLayout from "@/components/CrudLayout";
import usePeerReviews from "@/hooks/usePeerReviews";
import Link from "next/link";
import { useState } from "react";

export default function PeerReviewsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { peerReviews, count } = usePeerReviews(state);

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
        <h2>PeerReview</h2>
        <Link className="border rounded" href={`/crud/peer_review/add`}>
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
              <th>facultyId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {peerReviews.map((peerReview) => {
              return (
                <tr key={peerReview.id}>
                  <td>{peerReview.id}</td>
                  <td>{new Date(peerReview.createdAt).toLocaleString()}</td>
                  <td>{new Date(peerReview.updatedAt).toLocaleString()}</td>
                  <td>
                    <Link
                      href={`/crud/department_review/${peerReview.departmentReviewId}`}
                      className="underline"
                    >
                      {peerReview.departmentReviewId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/faculty/${peerReview.facultyId}`}
                      className="underline"
                    >
                      {peerReview.facultyId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/peer_review/${peerReview.id}`}
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
