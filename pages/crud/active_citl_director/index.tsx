import CrudLayout from "@/components/CrudLayout";
import useActiveCITLDirectors from "@/hooks/useActiveCITLDirectors";
import Link from "next/link";
import { useState } from "react";

export default function ActiveCITLDirectorsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { activeCITLDirectors, count } = useActiveCITLDirectors(state);

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
        <h2>ActiveCITLDirector</h2>
        <Link
          className="border rounded"
          href={`/crud/active_citl_director/add`}
        >
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
              <th>cITLDirectorId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {activeCITLDirectors.map((activeCITLDirector) => {
              return (
                <tr key={activeCITLDirector.id}>
                  <td>{activeCITLDirector.id}</td>
                  <td>
                    {new Date(activeCITLDirector.createdAt).toLocaleString()}
                  </td>
                  <td>
                    {new Date(activeCITLDirector.updatedAt).toLocaleString()}
                  </td>
                  <td>
                    <Link
                      href={`/crud/cITLDirector/${activeCITLDirector.cITLDirectorId}`}
                      className="underline"
                    >
                      {activeCITLDirector.cITLDirectorId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/active_citl_director/${activeCITLDirector.id}`}
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
