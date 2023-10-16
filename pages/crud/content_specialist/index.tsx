import CrudLayout from "@/components/CrudLayout";
import useContentSpecialists from "@/hooks/useContentSpecialists";
import Link from "next/link";
import { useState } from "react";

export default function ContentSpecialistsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { contentSpecialists, count } = useContentSpecialists(state);

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
        <h2>ContentSpecialist</h2>
        <Link className='border rounded' href={`/crud/content_specialist/add`}>
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
              <th>userId</th>
              <th>departmentId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {contentSpecialists.map((contentSpecialist) => {
              return (
                <tr key={contentSpecialist.id}>
                  <td>{contentSpecialist.id}</td>
                  <td>{new Date(contentSpecialist.createdAt).toLocaleString()}</td>
                  <td>{new Date(contentSpecialist.updatedAt).toLocaleString()}</td>
                  <td><Link href={`/crud/user/${contentSpecialist.userId}`} className="underline">{contentSpecialist.userId}</Link></td>
                  <td><Link href={`/crud/department/${contentSpecialist.departmentId}`} className="underline">{contentSpecialist.departmentId}</Link></td>
                  <td>
                    <Link
                      href={`/crud/content_specialist/${contentSpecialist.id}`}
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
