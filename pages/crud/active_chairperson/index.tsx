import CrudLayout from "@/components/CrudLayout";
import useActiveChairpersons from "@/hooks/useActiveChairpersons";
import Link from "next/link";
import { useState } from "react";

export default function ActiveChairpersonsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { activeChairpersons, count } = useActiveChairpersons(state);

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
        <h2>ActiveChairperson</h2>
        <Link className='border rounded' href={`/crud/active_chairperson/add`}>
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
              <th>chairpersonId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {activeChairpersons.map((activeChairperson) => {
              return (
                <tr key={activeChairperson.id}>
                  <td>{activeChairperson.id}</td>
                  <td>{new Date(activeChairperson.createdAt).toLocaleString()}</td>
                  <td>{new Date(activeChairperson.updatedAt).toLocaleString()}</td>
                  <td>
                    <Link
                      href={`/crud/chairperson/${activeChairperson.chairpersonId}`}
                      className='underline'
                    >
                      {activeChairperson.chairpersonId}
                    </Link></td>
                  <td>
                    <Link
                      href={`/crud/active_chairperson/${activeChairperson.id}`}
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
