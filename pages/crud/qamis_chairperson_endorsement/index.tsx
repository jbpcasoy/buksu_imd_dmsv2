import CrudLayout from "@/components/CrudLayout";
import useQAMISChairpersonEndorsements from "@/hooks/useQAMISChairpersonEndorsements";
import Link from "next/link";
import { useState } from "react";

export default function QAMISChairpersonEndorsementsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { qAMISChairpersonEndorsements, count } = useQAMISChairpersonEndorsements(state);

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
        <h2>QAMISChairpersonEndorsement</h2>
        <Link
          className='border rounded'
          href={`/crud/qamis_chairperson_endorsement/add`}
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
              <th>qAMISRevisionId</th>
              <th>chairpersonId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {qAMISChairpersonEndorsements.map((qAMISChairpersonEndorsement) => {
              return (
                <tr key={qAMISChairpersonEndorsement.id}>
                  <td>{qAMISChairpersonEndorsement.id}</td>
                  <td>
                    {new Date(
                      qAMISChairpersonEndorsement.createdAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    {new Date(
                      qAMISChairpersonEndorsement.updatedAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    <Link
                      href={`/crud/qamis_revision/${qAMISChairpersonEndorsement.qAMISRevisionId}`}
                      className='underline'
                    >
                      {qAMISChairpersonEndorsement.qAMISRevisionId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/chairperson/${qAMISChairpersonEndorsement.chairpersonId}`}
                      className='underline'
                    >
                      {qAMISChairpersonEndorsement.chairpersonId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/qamis_chairperson_endorsement/${qAMISChairpersonEndorsement.id}`}
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
