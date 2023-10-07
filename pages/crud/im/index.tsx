import CrudLayout from "@/components/CrudLayout";
import useIMs from "@/hooks/useIMs";
import Link from "next/link";
import { useState } from "react";

export default function IMsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { iMs, count } = useIMs(state);

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
        <h2>IM</h2>
        <Link className='border rounded' href={`/crud/im/add`}>
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
              <th>title</th>
              <th>type</th>
              <th>faculty</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {iMs.map((iM) => {
              return (
                <tr key={iM.id}>
                  <td>{iM.id}</td>
                  <td>{new Date(iM.createdAt).toLocaleString()}</td>
                  <td>{new Date(iM.updatedAt).toLocaleString()}</td>
                  <td>{iM.title}</td>
                  <td>{iM.type}</td>
                  <td>
                    <Link
                      href={`/crud/faculty/${iM.facultyId}`}
                      className='underline'
                    >
                      {iM.facultyId}
                    </Link>
                  </td>
                  <td>
                    <Link href={`/crud/im/${iM.id}`} className='border rounded'>
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
