import CrudLayout from "@/components/CrudLayout";
import useQAMISDepartmentEndorsements from "@/hooks/useQAMISDepartmentEndorsements";
import Link from "next/link";
import { useState } from "react";

export default function QAMISDepartmentEndorsementsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { qAMISDepartmentEndorsements, count } = useQAMISDepartmentEndorsements(state);

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
        <h2>QAMISDepartmentEndorsement Reviewed</h2>
      </div>

      <div>
        <table className='table-auto w-full'>
          <thead>
            <tr>
              <th>id</th>
              <th>createdAt</th>
              <th>updatedAt</th>
              <th>qAMISChairpersonEndorsementId</th>
              <th>qAMISCoordinatorEndorsementId</th>
              <th>qAMISDeanEndorsementId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {qAMISDepartmentEndorsements.map((qAMISDepartmentEndorsement) => {
              return (
                <tr key={qAMISDepartmentEndorsement.id}>
                  <td>{qAMISDepartmentEndorsement.id}</td>
                  <td>{new Date(qAMISDepartmentEndorsement.createdAt).toLocaleString()}</td>
                  <td>{new Date(qAMISDepartmentEndorsement.updatedAt).toLocaleString()}</td>
                  <td>
                    <Link
                      href={`/crud/submitted_chairperson_suggestion/${qAMISDepartmentEndorsement.qAMISChairpersonEndorsementId}`}
                      className='underline'
                    >
                      {qAMISDepartmentEndorsement.qAMISChairpersonEndorsementId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/submitted_coordinator_suggestion/${qAMISDepartmentEndorsement.qAMISCoordinatorEndorsementId}`}
                      className='underline'
                    >
                      {qAMISDepartmentEndorsement.qAMISCoordinatorEndorsementId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/submitted_peer_suggestion/${qAMISDepartmentEndorsement.qAMISDeanEndorsementId}`}
                      className='underline'
                    >
                      {qAMISDepartmentEndorsement.qAMISDeanEndorsementId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/qamis_department_endorsement/${qAMISDepartmentEndorsement.id}`}
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
