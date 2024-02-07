import CrudLayout from "@/components/CrudLayout";
import useIMERCCITLRevisions from "@/hooks/useIMERCCITLRevisions";
import Link from "next/link";
import { useState } from "react";

export default function IMERCCITLRevisionsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { iMERCCITLRevisions, count } = useIMERCCITLRevisions(state);

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
        <h2>IMERCCITLRevision</h2>
        <Link className='border rounded' href={`/crud/imerc_citl_revision/add`}>
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
              <th>iMERCCITLReviewedId</th>
              <th>plagiarismFileId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {iMERCCITLRevisions.map((iMERCCITLRevision) => {
              return (
                <tr key={iMERCCITLRevision.id}>
                  <td>{iMERCCITLRevision.id}</td>
                  <td>
                    {new Date(iMERCCITLRevision.createdAt).toLocaleString()}
                  </td>
                  <td>
                    {new Date(iMERCCITLRevision.updatedAt).toLocaleString()}
                  </td>
                  <td>
                    <Link
                      href={`/crud/im_file/${iMERCCITLRevision.iMFileId}`}
                      className='underline'
                    >
                      {iMERCCITLRevision.iMFileId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/imerc_citl_reviewed/${iMERCCITLRevision.iMERCCITLReviewedId}`}
                      className='underline'
                    >
                      {iMERCCITLRevision.iMERCCITLReviewedId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/plagiarism_file/${iMERCCITLRevision.plagiarismFileId}`}
                      className='underline'
                    >
                      {iMERCCITLRevision.plagiarismFileId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/imerc_citl_revision/${iMERCCITLRevision.id}`}
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
