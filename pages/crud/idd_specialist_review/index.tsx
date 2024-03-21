import CrudLayout from "@/components/CrudLayout";
import useIDDSpecialistReviews from "@/hooks/useIDDSpecialistReviews";
import Link from "next/link";
import { useState } from "react";

export default function IDDSpecialistReviewsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { iDDSpecialistReviews, count } = useIDDSpecialistReviews(state);

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
        <h2>IDDSpecialistReview</h2>
        <Link
          className="border rounded"
          href={`/crud/idd_specialist_review/add`}
        >
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
              <th>qAMISDepartmentEndorsementId</th>
              <th>iDDCoordinatorId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {iDDSpecialistReviews.map((iDDSpecialistReview) => {
              return (
                <tr key={iDDSpecialistReview.id}>
                  <td>{iDDSpecialistReview.id}</td>
                  <td>
                    {new Date(iDDSpecialistReview.createdAt).toLocaleString()}
                  </td>
                  <td>
                    {new Date(iDDSpecialistReview.updatedAt).toLocaleString()}
                  </td>
                  <td>
                    <Link
                      href={`/crud/qamis_department_endorsement/${iDDSpecialistReview.qAMISDepartmentEndorsementId}`}
                      className="underline"
                    >
                      {iDDSpecialistReview.qAMISDepartmentEndorsementId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/idd_coordinator/${iDDSpecialistReview.iDDCoordinatorId}`}
                      className="underline"
                    >
                      {iDDSpecialistReview.iDDCoordinatorId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/idd_specialist_review/${iDDSpecialistReview.id}`}
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
