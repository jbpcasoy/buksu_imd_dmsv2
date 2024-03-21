import CrudLayout from "@/components/CrudLayout";
import useFaculties from "@/hooks/useFaculties";
import Link from "next/link";
import { useState } from "react";

export default function FacultiesPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { faculties, count } = useFaculties(state);

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
        <h2>Faculty</h2>
        <Link className="border rounded" href={`/crud/faculty/add`}>
          Add
        </Link>
      </div>

      <div>
        <table className="table-auto w-full">
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
            {faculties.map((faculty) => {
              return (
                <tr key={faculty.id}>
                  <td>{faculty.id}</td>
                  <td>{new Date(faculty.createdAt).toLocaleString()}</td>
                  <td>{new Date(faculty.updatedAt).toLocaleString()}</td>
                  <td>
                    <Link
                      href={`/crud/user/${faculty.userId}`}
                      className="underline"
                    >
                      {faculty.userId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/department/${faculty.departmentId}`}
                      className="underline"
                    >
                      {faculty.departmentId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/faculty/${faculty.id}`}
                      className="border rounded"
                    >
                      view
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex justify-end space-x-1">
          <p>
            {state.skip} - {state.skip + state.take} of {count}
          </p>
          <button className="border rounded" onClick={handlePrev}>
            prev
          </button>
          <button className="border rounded" onClick={handleNext}>
            next
          </button>
        </div>
      </div>
    </CrudLayout>
  );
}
