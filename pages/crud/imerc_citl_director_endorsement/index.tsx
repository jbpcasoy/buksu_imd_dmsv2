import CrudLayout from "@/components/CrudLayout";
import useIMERCCITLDirectorEndorsements from "@/hooks/useIMERCCITLDirectorEndorsements";
import Link from "next/link";
import { useState } from "react";

export default function IMERCCITLDirectorEndorsementsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { iMERCCITLDirectorEndorsements, count } =
    useIMERCCITLDirectorEndorsements(state);

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
        <h2>IMERCCITLDirectorEndorsement</h2>
        <Link
          className="border rounded"
          href={`/crud/imerc_citl_director_endorsement/add`}
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
              <th>iMERCIDDCoordinatorEndorsementId</th>
              <th>cITLDirectorId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {iMERCCITLDirectorEndorsements.map(
              (iMERCCITLDirectorEndorsement) => {
                return (
                  <tr key={iMERCCITLDirectorEndorsement.id}>
                    <td>{iMERCCITLDirectorEndorsement.id}</td>
                    <td>
                      {new Date(
                        iMERCCITLDirectorEndorsement.createdAt
                      ).toLocaleString()}
                    </td>
                    <td>
                      {new Date(
                        iMERCCITLDirectorEndorsement.updatedAt
                      ).toLocaleString()}
                    </td>
                    <td>
                      <Link
                        href={`/crud/imerc_idd_coordinator_endorsement/${iMERCCITLDirectorEndorsement.iMERCIDDCoordinatorEndorsementId}`}
                        className="underline"
                      >
                        {
                          iMERCCITLDirectorEndorsement.iMERCIDDCoordinatorEndorsementId
                        }
                      </Link>
                    </td>
                    <td>
                      <Link
                        href={`/crud/citl_director/${iMERCCITLDirectorEndorsement.cITLDirectorId}`}
                        className="underline"
                      >
                        {iMERCCITLDirectorEndorsement.cITLDirectorId}
                      </Link>
                    </td>
                    <td>
                      <Link
                        href={`/crud/imerc_citl_director_endorsement/${iMERCCITLDirectorEndorsement.id}`}
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
