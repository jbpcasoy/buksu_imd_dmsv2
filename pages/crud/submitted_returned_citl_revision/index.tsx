import CrudLayout from "@/components/CrudLayout";
import useSubmittedReturnedCITLRevisions from "@/hooks/useSubmittedReturnedCITLRevisions";
import Link from "next/link";
import { useState } from "react";

export default function SubmittedReturnedCITLRevisionsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { submittedReturnedCITLRevisions, count } =
    useSubmittedReturnedCITLRevisions(state);

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
        <h2>SubmittedReturnedCITLRevision</h2>
        <Link
          className='border rounded'
          href={`/crud/submitted_returned_citl_revision/add`}
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
              <th>returnedCITLRevisionId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {submittedReturnedCITLRevisions.map((submittedReturnedCITLRevision) => {
              return (
                <tr key={submittedReturnedCITLRevision.id}>
                  <td>{submittedReturnedCITLRevision.id}</td>
                  <td>
                    {new Date(
                      submittedReturnedCITLRevision.createdAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    {new Date(
                      submittedReturnedCITLRevision.updatedAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    <Link
                      href={`/crud/returned_citl_revision/${submittedReturnedCITLRevision.returnedCITLRevisionId}`}
                      className='underline'
                    >
                      {submittedReturnedCITLRevision.returnedCITLRevisionId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/submitted_returned_citl_revision/${submittedReturnedCITLRevision.id}`}
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
