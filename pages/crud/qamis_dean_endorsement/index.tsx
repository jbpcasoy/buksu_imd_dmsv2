import CrudLayout from "@/components/CrudLayout";
import useQAMISDeanEndorsements from "@/hooks/useQAMISDeanEndorsements";
import Link from "next/link";
import { useState } from "react";

export default function QAMISDeanEndorsementsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { qAMISDeanEndorsements, count } = useQAMISDeanEndorsements(state);

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
        <h2>QAMISDeanEndorsement</h2>
        <Link
          className="border rounded"
          href={`/crud/qamis_dean_endorsement/add`}
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
              <th>deanId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {qAMISDeanEndorsements.map((qAMISDeanEndorsement) => {
              return (
                <tr key={qAMISDeanEndorsement.id}>
                  <td>{qAMISDeanEndorsement.id}</td>
                  <td>
                    {new Date(qAMISDeanEndorsement.createdAt).toLocaleString()}
                  </td>
                  <td>
                    {new Date(qAMISDeanEndorsement.updatedAt).toLocaleString()}
                  </td>
                  <td>
                    <Link
                      href={`/crud/qamis_revision/${qAMISDeanEndorsement.qAMISRevisionId}`}
                      className="underline"
                    >
                      {qAMISDeanEndorsement.qAMISRevisionId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/dean/${qAMISDeanEndorsement.deanId}`}
                      className="underline"
                    >
                      {qAMISDeanEndorsement.deanId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/qamis_dean_endorsement/${qAMISDeanEndorsement.id}`}
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
