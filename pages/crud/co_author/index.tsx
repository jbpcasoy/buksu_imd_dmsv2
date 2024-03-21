import CrudLayout from "@/components/CrudLayout";
import useCoAuthors from "@/hooks/useCoAuthors";
import Link from "next/link";
import { useState } from "react";

export default function CoAuthorsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { coAuthors, count } = useCoAuthors(state);

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
        <h2>Co-author</h2>
        <Link className="border rounded" href={`/crud/co_author/add`}>
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
              <th>iMId</th>
            </tr>
          </thead>
          <tbody>
            {coAuthors.map((coAuthor) => {
              return (
                <tr key={coAuthor.id}>
                  <td>{coAuthor.id}</td>
                  <td>{new Date(coAuthor.createdAt).toLocaleString()}</td>
                  <td>{new Date(coAuthor.updatedAt).toLocaleString()}</td>
                  <td>{coAuthor.iMId}</td>
                  <td>
                    <Link
                      href={`/crud/co_author/${coAuthor.id}`}
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
