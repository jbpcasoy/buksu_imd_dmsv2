import CrudLayout from "@/components/CrudLayout";
import useQAMISCoordinatorEndorsements from "@/hooks/useQAMISCoordinatorEndorsements";
import Link from "next/link";
import { useState } from "react";

export default function QAMISCoordinatorEndorsementsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { qAMISCoordinatorEndorsements, count } =
    useQAMISCoordinatorEndorsements(state);

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
        <h2>QAMISCoordinatorEndorsement</h2>
        <Link
          className="border rounded"
          href={`/crud/qamis_coordinator_endorsement/add`}
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
              <th>qAMISRevisionId</th>
              <th>coordinatorId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {qAMISCoordinatorEndorsements.map((qAMISCoordinatorEndorsement) => {
              return (
                <tr key={qAMISCoordinatorEndorsement.id}>
                  <td>{qAMISCoordinatorEndorsement.id}</td>
                  <td>
                    {new Date(
                      qAMISCoordinatorEndorsement.createdAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    {new Date(
                      qAMISCoordinatorEndorsement.updatedAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    <Link
                      href={`/crud/qamis_revision/${qAMISCoordinatorEndorsement.qAMISRevisionId}`}
                      className="underline"
                    >
                      {qAMISCoordinatorEndorsement.qAMISRevisionId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/coordinator/${qAMISCoordinatorEndorsement.coordinatorId}`}
                      className="underline"
                    >
                      {qAMISCoordinatorEndorsement.coordinatorId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/qamis_coordinator_endorsement/${qAMISCoordinatorEndorsement.id}`}
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
