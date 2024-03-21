import CrudLayout from "@/components/CrudLayout";
import useDeanEndorsements from "@/hooks/useDeanEndorsements";
import Link from "next/link";
import { useState } from "react";

export default function DeanEndorsementsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { deanEndorsements, count } = useDeanEndorsements(state);

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
        <h2>DeanEndorsement</h2>
        <Link className="border rounded" href={`/crud/dean_endorsement/add`}>
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
              <th>coordinatorEndorsementId</th>
              <th>deanId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {deanEndorsements.map((deanEndorsement) => {
              return (
                <tr key={deanEndorsement.id}>
                  <td>{deanEndorsement.id}</td>
                  <td>
                    {new Date(deanEndorsement.createdAt).toLocaleString()}
                  </td>
                  <td>
                    {new Date(deanEndorsement.updatedAt).toLocaleString()}
                  </td>
                  <td>
                    <Link
                      href={`/crud/department_revision/${deanEndorsement.coordinatorEndorsementId}`}
                      className="underline"
                    >
                      {deanEndorsement.coordinatorEndorsementId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/department_revision/${deanEndorsement.deanId}`}
                      className="underline"
                    >
                      {deanEndorsement.deanId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/dean_endorsement/${deanEndorsement.id}`}
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
