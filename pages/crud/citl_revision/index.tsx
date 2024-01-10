import CrudLayout from "@/components/CrudLayout";
import useCITLRevisions from "@/hooks/useCITLRevisions";
import Link from "next/link";
import { useState } from "react";

export default function CITLRevisionsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { cITLRevisions, count } = useCITLRevisions(state);

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
        <h2>CITLRevision</h2>
        <Link className='border rounded' href={`/crud/citl_revision/add`}>
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
              <th>submittedIDDCoordinatorSuggestionId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {cITLRevisions.map((cITLRevision) => {
              return (
                <tr key={cITLRevision.id}>
                  <td>{cITLRevision.id}</td>
                  <td>
                    {new Date(cITLRevision.createdAt).toLocaleString()}
                  </td>
                  <td>
                    {new Date(cITLRevision.updatedAt).toLocaleString()}
                  </td>
                  <td>
                    <Link
                      href={`/crud/im_file/${cITLRevision.iMFileId}`}
                      className='underline'
                    >
                      {cITLRevision.iMFileId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/submitted_idd_coordinator_suggestion/${cITLRevision.submittedIDDCoordinatorSuggestionId}`}
                      className='underline'
                    >
                      {cITLRevision.submittedIDDCoordinatorSuggestionId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/citl_revision/${cITLRevision.id}`}
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
