import CrudLayout from "@/components/CrudLayout";
import useCoordinatorEndorsements from "@/hooks/useCoordinatorEndorsements";
import Link from "next/link";
import { useState } from "react";

export default function CoordinatorEndorsementsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { coordinatorEndorsements, count } = useCoordinatorEndorsements(state);

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
        <h2>CoordinatorEndorsement</h2>
        <Link
          className='border rounded'
          href={`/crud/coordinator_endorsement/add`}
        >
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
              <th>departmentRevisionId</th>
              <th>coordinatorId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {coordinatorEndorsements.map((coordinatorEndorsement) => {
              return (
                <tr key={coordinatorEndorsement.id}>
                  <td>{coordinatorEndorsement.id}</td>
                  <td>
                    {new Date(
                      coordinatorEndorsement.createdAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    {new Date(
                      coordinatorEndorsement.updatedAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    <Link
                      href={`/crud/department_revision/${coordinatorEndorsement.departmentRevisionId}`}
                      className='underline'
                    >
                      {coordinatorEndorsement.departmentRevisionId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/department_revision/${coordinatorEndorsement.coordinatorId}`}
                      className='underline'
                    >
                      {coordinatorEndorsement.coordinatorId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/coordinator_endorsement/${coordinatorEndorsement.id}`}
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
