import CrudLayout from "@/components/CrudLayout";
import useChairpersons from "@/hooks/useChairpersons";
import Link from "next/link";
import { useState } from "react";

export default function ChairpersonsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { chairpersons, count } = useChairpersons(state);

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
        <h2>Chairperson</h2>
        <Link className="border rounded" href={`/crud/chairperson/add`}>
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
              <th>facultyId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {chairpersons.map((chairperson) => {
              return (
                <tr key={chairperson.id}>
                  <td>{chairperson.id}</td>
                  <td>{new Date(chairperson.createdAt).toLocaleString()}</td>
                  <td>{new Date(chairperson.updatedAt).toLocaleString()}</td>
                  <td>
                    <Link
                      href={`/crud/faculty/${chairperson.facultyId}`}
                      className="underline"
                    >
                      {chairperson.facultyId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/chairperson/${chairperson.id}`}
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
