import CrudLayout from "@/components/CrudLayout";
import useActiveFaculties from "@/hooks/useActiveFaculties";
import Link from "next/link";
import { useState } from "react";

export default function ActiveFacultiesPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { activeFaculties, count } = useActiveFaculties(state);

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
        <h2>ActiveFaculty</h2>
        <Link className='border rounded' href={`/crud/active_faculty/add`}>
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
              <th>facultyId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {activeFaculties.map((activeFaculty) => {
              return (
                <tr key={activeFaculty.id}>
                  <td>{activeFaculty.id}</td>
                  <td>{new Date(activeFaculty.createdAt).toLocaleString()}</td>
                  <td>{new Date(activeFaculty.updatedAt).toLocaleString()}</td>
                  <td>
                    <Link
                      href={`/crud/faculty/${activeFaculty.facultyId}`}
                      className='underline'
                    >
                      {activeFaculty.facultyId}
                    </Link></td>
                  <td>
                    <Link
                      href={`/crud/active_faculty/${activeFaculty.id}`}
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
