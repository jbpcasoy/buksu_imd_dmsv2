import CrudLayout from "@/components/CrudLayout";
import useActiveCoordinators from "@/hooks/useActiveCoordinators";
import Link from "next/link";
import { useState } from "react";

export default function ActiveCoordinatorsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { activeCoordinators, count } = useActiveCoordinators(state);

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
        <h2>ActiveCoordinator</h2>
        <Link className="border rounded" href={`/crud/active_coordinator/add`}>
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
              <th>coordinatorId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {activeCoordinators.map((activeCoordinator) => {
              return (
                <tr key={activeCoordinator.id}>
                  <td>{activeCoordinator.id}</td>
                  <td>
                    {new Date(activeCoordinator.createdAt).toLocaleString()}
                  </td>
                  <td>
                    {new Date(activeCoordinator.updatedAt).toLocaleString()}
                  </td>
                  <td>
                    <Link
                      href={`/crud/coordinator/${activeCoordinator.coordinatorId}`}
                      className="underline"
                    >
                      {activeCoordinator.coordinatorId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/active_coordinator/${activeCoordinator.id}`}
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
