import CrudLayout from "@/components/CrudLayout";
import useReturnedCITLRevisions from "@/hooks/useReturnedCITLRevisions";
import Link from "next/link";
import { useState } from "react";

export default function ReturnedCITLRevisionsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { returnedCITLRevisions, count } = useReturnedCITLRevisions(state);

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
        <h2>ReturnedCITLRevision</h2>
        <Link
          className="border rounded"
          href={`/crud/returned_citl_revision/add`}
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
              <th>iDDCoordinatorId</th>
              <th>cITLRevisionId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {returnedCITLRevisions.map((returnedCITLRevision) => {
              return (
                <tr key={returnedCITLRevision.id}>
                  <td>{returnedCITLRevision.id}</td>
                  <td>
                    {new Date(returnedCITLRevision.createdAt).toLocaleString()}
                  </td>
                  <td>
                    {new Date(returnedCITLRevision.updatedAt).toLocaleString()}
                  </td>
                  <td>
                    <Link
                      href={`/crud/coordinator/${returnedCITLRevision.iDDCoordinatorId}`}
                      className="underline"
                    >
                      {returnedCITLRevision.iDDCoordinatorId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/citl_revision/${returnedCITLRevision.cITLRevisionId}`}
                      className="underline"
                    >
                      {returnedCITLRevision.cITLRevisionId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/returned_citl_revision/${returnedCITLRevision.id}`}
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
