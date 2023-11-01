import AdminLayout from "@/components/AdminLayout";
import useIDDCoordinators from "@/hooks/useIDDCoordinators";
import Link from "next/link";
import { useState } from "react";

export default function IDDCoordinatorsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { iDDCoordinators, count } = useIDDCoordinators(state);

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
    <AdminLayout>
      <div className='flex justify-between'>
        <h2>IDDCoordinator</h2>
        <Link className='border rounded' href={`/admin/idd_coordinator/add`}>
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
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {iDDCoordinators.map((iDDCoordinator) => {
              return (
                <tr key={iDDCoordinator.id}>
                  <td>{iDDCoordinator.id}</td>
                  <td>{new Date(iDDCoordinator.createdAt).toLocaleString()}</td>
                  <td>{new Date(iDDCoordinator.updatedAt).toLocaleString()}</td>
                  <td>
                    <Link
                      href={`/admin/user/${iDDCoordinator.userId}`}
                      className='underline'
                    >
                      {iDDCoordinator.userId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/admin/idd_coordinator/${iDDCoordinator.id}`}
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
    </AdminLayout>
  );
}