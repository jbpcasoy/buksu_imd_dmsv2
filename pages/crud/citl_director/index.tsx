import CrudLayout from "@/components/CrudLayout";
import useCITLDirectors from "@/hooks/useCITLDirectors";
import Link from "next/link";
import { useState } from "react";

export default function CITLDirectorsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { cITLDirectors, count } = useCITLDirectors(state);

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
        <h2>CITLDirector</h2>
        <Link className="border rounded" href={`/crud/citl_director/add`}>
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
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {cITLDirectors.map((cITLDirector) => {
              return (
                <tr key={cITLDirector.id}>
                  <td>{cITLDirector.id}</td>
                  <td>{new Date(cITLDirector.createdAt).toLocaleString()}</td>
                  <td>{new Date(cITLDirector.updatedAt).toLocaleString()}</td>
                  <td>
                    <Link
                      href={`/crud/user/${cITLDirector.userId}`}
                      className="underline"
                    >
                      {cITLDirector.userId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/citl_director/${cITLDirector.id}`}
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
