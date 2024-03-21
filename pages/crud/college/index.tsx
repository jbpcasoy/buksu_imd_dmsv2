import CrudLayout from "@/components/CrudLayout";
import useColleges from "@/hooks/useColleges";
import Link from "next/link";
import { useState } from "react";

export default function CollegesPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { colleges, count } = useColleges(state);

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
        <h2>College</h2>
        <Link className="border rounded" href={`/crud/college/add`}>
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
              <th>name</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {colleges.map((college) => {
              return (
                <tr key={college.id}>
                  <td>{college.id}</td>
                  <td>{new Date(college.createdAt).toLocaleString()}</td>
                  <td>{new Date(college.updatedAt).toLocaleString()}</td>
                  <td>{college.name}</td>
                  <td>
                    <Link
                      href={`/crud/college/${college.id}`}
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
