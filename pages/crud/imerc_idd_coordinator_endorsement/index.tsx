import CrudLayout from "@/components/CrudLayout";
import useIMERCIDDCoordinatorEndorsements from "@/hooks/useIMERCIDDCoordinatorEndorsements";
import Link from "next/link";
import { useState } from "react";

export default function IMERCIDDCoordinatorEndorsementsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { iMERCIDDCoordinatorEndorsements, count } =
    useIMERCIDDCoordinatorEndorsements(state);

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
        <h2>IMERCIDDCoordinatorEndorsement</h2>
        <Link
          className="border rounded"
          href={`/crud/imerc_idd_coordinator_endorsement/add`}
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
              <th>iMERCCITLRevisionId</th>
              <th>iDDCoordinatorId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {iMERCIDDCoordinatorEndorsements.map(
              (iMERCIDDCoordinatorEndorsement) => {
                return (
                  <tr key={iMERCIDDCoordinatorEndorsement.id}>
                    <td>{iMERCIDDCoordinatorEndorsement.id}</td>
                    <td>
                      {new Date(
                        iMERCIDDCoordinatorEndorsement.createdAt
                      ).toLocaleString()}
                    </td>
                    <td>
                      {new Date(
                        iMERCIDDCoordinatorEndorsement.updatedAt
                      ).toLocaleString()}
                    </td>
                    <td>
                      <Link
                        href={`/crud/imerc_citl_revision/${iMERCIDDCoordinatorEndorsement.iMERCCITLRevisionId}`}
                        className="underline"
                      >
                        {iMERCIDDCoordinatorEndorsement.iMERCCITLRevisionId}
                      </Link>
                    </td>
                    <td>
                      <Link
                        href={`/crud/idd_coordinator/${iMERCIDDCoordinatorEndorsement.iDDCoordinatorId}`}
                        className="underline"
                      >
                        {iMERCIDDCoordinatorEndorsement.iDDCoordinatorId}
                      </Link>
                    </td>
                    <td>
                      <Link
                        href={`/crud/imerc_idd_coordinator_endorsement/${iMERCIDDCoordinatorEndorsement.id}`}
                        className="border rounded"
                      >
                        view
                      </Link>
                    </td>
                  </tr>
                );
              }
            )}
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
