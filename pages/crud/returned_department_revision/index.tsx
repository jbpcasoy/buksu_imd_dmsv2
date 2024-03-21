import CrudLayout from "@/components/CrudLayout";
import useReturnedDepartmentRevisions from "@/hooks/useReturnedDepartmentRevisions";
import Link from "next/link";
import { useState } from "react";

export default function ReturnedDepartmentRevisionsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { returnedDepartmentRevisions, count } =
    useReturnedDepartmentRevisions(state);

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
        <h2>ReturnedDepartmentRevision</h2>
        <Link
          className="border rounded"
          href={`/crud/returned_department_revision/add`}
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
              <th>coordinatorId</th>
              <th>departmentRevisionId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {returnedDepartmentRevisions.map((returnedDepartmentRevision) => {
              return (
                <tr key={returnedDepartmentRevision.id}>
                  <td>{returnedDepartmentRevision.id}</td>
                  <td>
                    {new Date(
                      returnedDepartmentRevision.createdAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    {new Date(
                      returnedDepartmentRevision.updatedAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    <Link
                      href={`/crud/coordinator/${returnedDepartmentRevision.coordinatorId}`}
                      className="underline"
                    >
                      {returnedDepartmentRevision.coordinatorId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/department_revision/${returnedDepartmentRevision.departmentRevisionId}`}
                      className="underline"
                    >
                      {returnedDepartmentRevision.departmentRevisionId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/returned_department_revision/${returnedDepartmentRevision.id}`}
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
