import CrudLayout from "@/components/CrudLayout";
import useDeans from "@/hooks/useDeans";
import Link from "next/link";
import { useState } from "react";

export default function DeansPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { deans, count } = useDeans(state);

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
        <h2>Dean</h2>
        <Link className='border rounded' href={`/crud/dean/add`}>
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
            {deans.map((dean) => {
              return (
                <tr key={dean.id}>
                  <td>{dean.id}</td>
                  <td>{new Date(dean.createdAt).toLocaleString()}</td>
                  <td>{new Date(dean.updatedAt).toLocaleString()}</td>
                  <td>
                    <Link
                      href={`/crud/faculty/${dean.facultyId}`}
                      className='underline'
                    >
                      {dean.facultyId}
                    </Link></td>
                  <td>
                    <Link
                      href={`/crud/dean/${dean.id}`}
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
