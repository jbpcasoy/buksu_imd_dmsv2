import CrudLayout from "@/components/CrudLayout";
import useDepartmentRevisions from "@/hooks/useDepartmentRevisions";
import Link from "next/link";
import { useState } from "react";

export default function DepartmentRevisionsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { departmentRevisions, count } = useDepartmentRevisions(state);

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
        <h2>DepartmentRevision</h2>
        <Link className='border rounded' href={`/crud/department_revision/add`}>
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
              <th>departmentReviewedId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {departmentRevisions.map((departmentRevision) => {
              return (
                <tr key={departmentRevision.id}>
                  <td>{departmentRevision.id}</td>
                  <td>
                    {new Date(departmentRevision.createdAt).toLocaleString()}
                  </td>
                  <td>
                    {new Date(departmentRevision.updatedAt).toLocaleString()}
                  </td>
                  <td>
                    <Link
                      href={`/crud/im_file/${departmentRevision.iMFileId}`}
                      className='underline'
                    >
                      {departmentRevision.iMFileId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/department_reviewed/${departmentRevision.departmentReviewedId}`}
                      className='underline'
                    >
                      {departmentRevision.departmentReviewedId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/department_revision/${departmentRevision.id}`}
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
