import CrudLayout from "@/components/CrudLayout";
import useActiveContentSpecialists from "@/hooks/useActiveContentSpecialists";
import Link from "next/link";
import { useState } from "react";

export default function ActiveContentSpecialistsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { activeContentSpecialists, count } =
    useActiveContentSpecialists(state);

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
        <h2>ActiveContentSpecialist</h2>
        <Link
          className="border rounded"
          href={`/crud/active_content_specialist/add`}
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
              <th>contentSpecialistId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {activeContentSpecialists.map((activeContentSpecialist) => {
              return (
                <tr key={activeContentSpecialist.id}>
                  <td>{activeContentSpecialist.id}</td>
                  <td>
                    {new Date(
                      activeContentSpecialist.createdAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    {new Date(
                      activeContentSpecialist.updatedAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    <Link
                      href={`/crud/content_specialist/${activeContentSpecialist.contentSpecialistId}`}
                      className="underline"
                    >
                      {activeContentSpecialist.contentSpecialistId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/active_content_specialist/${activeContentSpecialist.id}`}
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
