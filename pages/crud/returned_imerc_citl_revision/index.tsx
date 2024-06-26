import CrudLayout from "@/components/CrudLayout";
import useReturnedIMERCCITLRevisions from "@/hooks/useReturnedIMERCCITLRevisions";
import Link from "next/link";
import { useState } from "react";

export default function ReturnedIMERCCITLRevisionsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { returnedIMERCCITLRevisions, count } =
    useReturnedIMERCCITLRevisions(state);

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
        <h2>ReturnedIMERCCITLRevision</h2>
        <Link
          className="border rounded"
          href={`/crud/returned_imerc_citl_revision/add`}
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
              <th>iMERCCITLRevisionId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {returnedIMERCCITLRevisions.map((returnedIMERCCITLRevision) => {
              return (
                <tr key={returnedIMERCCITLRevision.id}>
                  <td>{returnedIMERCCITLRevision.id}</td>
                  <td>
                    {new Date(
                      returnedIMERCCITLRevision.createdAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    {new Date(
                      returnedIMERCCITLRevision.updatedAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    <Link
                      href={`/crud/coordinator/${returnedIMERCCITLRevision.iDDCoordinatorId}`}
                      className="underline"
                    >
                      {returnedIMERCCITLRevision.iDDCoordinatorId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/citl_revision/${returnedIMERCCITLRevision.iMERCCITLRevisionId}`}
                      className="underline"
                    >
                      {returnedIMERCCITLRevision.iMERCCITLRevisionId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/returned_imerc_citl_revision/${returnedIMERCCITLRevision.id}`}
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
