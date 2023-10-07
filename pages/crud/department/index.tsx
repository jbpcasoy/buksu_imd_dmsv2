import CrudLayout from "@/components/CrudLayout";
import useDepartments from "@/hooks/useDepartments";
import Link from "next/link";
import { useState } from "react";

export default function DepartmentsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { departments, count } = useDepartments(state);

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
      <div className="flex justify-between">
        <h2>Department</h2>
        <Link className="border rounded" href={`/crud/department/add`}>Add</Link>
      </div>

      <div>
        <table className='table-auto w-full'>
          <thead>
            <tr>
              <th>id</th>
              <th>createdAt</th>
              <th>updatedAt</th>
              <th>name</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((department) => {
              return (
                <tr key={department.id}>
                  <td>{department.id}</td>
                  <td>{new Date(department.createdAt).toLocaleString()}</td>
                  <td>{new Date(department.updatedAt).toLocaleString()}</td>
                  <td>{department.name}</td>
                  <td>
                    <Link
                      href={`/crud/department/${department.id}`}
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
