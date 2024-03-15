import CrudLayout from "@/components/CrudLayout";
import useActiveIDDCoordinators from "@/hooks/useActiveIDDCoordinators";
import Link from "next/link";
import { useState } from "react";

export default function ActiveIDDCoordinatorsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { activeIDDCoordinators, count } = useActiveIDDCoordinators(state);

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
        <h2>ActiveIDDCoordinator</h2>
        <Link
          className="border rounded"
          href={`/crud/active_idd_coordinator/add`}
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
              <th>iDDCoordinatorId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {activeIDDCoordinators.map((activeIDDCoordinator) => {
              return (
                <tr key={activeIDDCoordinator.id}>
                  <td>{activeIDDCoordinator.id}</td>
                  <td>
                    {new Date(activeIDDCoordinator.createdAt).toLocaleString()}
                  </td>
                  <td>
                    {new Date(activeIDDCoordinator.updatedAt).toLocaleString()}
                  </td>
                  <td>
                    <Link
                      href={`/crud/iDDCoordinator/${activeIDDCoordinator.iDDCoordinatorId}`}
                      className="underline"
                    >
                      {activeIDDCoordinator.iDDCoordinatorId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/active_idd_coordinator/${activeIDDCoordinator.id}`}
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
