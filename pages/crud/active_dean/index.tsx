import CrudLayout from "@/components/CrudLayout";
import useActiveDeans from "@/hooks/useActiveDeans";
import Link from "next/link";
import { useState } from "react";

export default function ActiveDeansPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { activeDeans, count } = useActiveDeans(state);

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
        <h2>ActiveDean</h2>
        <Link className="border rounded" href={`/crud/active_dean/add`}>
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
              <th>deanId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {activeDeans.map((activeDean) => {
              return (
                <tr key={activeDean.id}>
                  <td>{activeDean.id}</td>
                  <td>{new Date(activeDean.createdAt).toLocaleString()}</td>
                  <td>{new Date(activeDean.updatedAt).toLocaleString()}</td>
                  <td>
                    <Link
                      href={`/crud/dean/${activeDean.deanId}`}
                      className="underline"
                    >
                      {activeDean.deanId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/active_dean/${activeDean.id}`}
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
