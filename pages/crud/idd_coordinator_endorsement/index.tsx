import CrudLayout from "@/components/CrudLayout";
import useIDDCoordinatorEndorsements from "@/hooks/useIDDCoordinatorEndorsements";
import Link from "next/link";
import { useState } from "react";

export default function IDDCoordinatorEndorsementsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { iDDCoordinatorEndorsements, count } =
    useIDDCoordinatorEndorsements(state);

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
        <h2>IDDCoordinatorEndorsement</h2>
        <Link
          className="border rounded"
          href={`/crud/idd_coordinator_endorsement/add`}
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
              <th>cITLRevisionId</th>
              <th>iDDCoordinatorId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {iDDCoordinatorEndorsements.map((iDDCoordinatorEndorsement) => {
              return (
                <tr key={iDDCoordinatorEndorsement.id}>
                  <td>{iDDCoordinatorEndorsement.id}</td>
                  <td>
                    {new Date(
                      iDDCoordinatorEndorsement.createdAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    {new Date(
                      iDDCoordinatorEndorsement.updatedAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    <Link
                      href={`/crud/citl_revision/${iDDCoordinatorEndorsement.cITLRevisionId}`}
                      className="underline"
                    >
                      {iDDCoordinatorEndorsement.cITLRevisionId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/idd_coordinator/${iDDCoordinatorEndorsement.iDDCoordinatorId}`}
                      className="underline"
                    >
                      {iDDCoordinatorEndorsement.iDDCoordinatorId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/idd_coordinator_endorsement/${iDDCoordinatorEndorsement.id}`}
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
