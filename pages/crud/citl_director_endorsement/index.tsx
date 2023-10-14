import CrudLayout from "@/components/CrudLayout";
import useCITLDirectorEndorsements from "@/hooks/useCITLDirectorEndorsements";
import Link from "next/link";
import { useState } from "react";

export default function CITLDirectorEndorsementsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { cITLDirectorEndorsements, count } = useCITLDirectorEndorsements(state);

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
        <h2>CITLDirectorEndorsement</h2>
        <Link
          className='border rounded'
          href={`/crud/citl_director_endorsement/add`}
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
              <th>iDDCoordinatorEndorsementId</th>
              <th>cITLDirectorId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {cITLDirectorEndorsements.map((cITLDirectorEndorsement) => {
              return (
                <tr key={cITLDirectorEndorsement.id}>
                  <td>{cITLDirectorEndorsement.id}</td>
                  <td>
                    {new Date(
                      cITLDirectorEndorsement.createdAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    {new Date(
                      cITLDirectorEndorsement.updatedAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    <Link
                      href={`/crud/idd_coordinator_endorsement/${cITLDirectorEndorsement.iDDCoordinatorEndorsementId}`}
                      className='underline'
                    >
                      {cITLDirectorEndorsement.iDDCoordinatorEndorsementId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/citl_director/${cITLDirectorEndorsement.cITLDirectorId}`}
                      className='underline'
                    >
                      {cITLDirectorEndorsement.cITLDirectorId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/citl_director_endorsement/${cITLDirectorEndorsement.id}`}
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
