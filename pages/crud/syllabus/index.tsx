import CrudLayout from "@/components/CrudLayout";
import useSyllabi from "@/hooks/useSyllabi";
import Link from "next/link";
import { useState } from "react";

export default function SyllabiPage() {
  const [state, setState] = useState({
    skip: 0,
    take: 10,
  });
  const { count, syllabi } = useSyllabi(state);

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
        <h2>Syllabus</h2>
        <Link className="border rounded" href={`/crud/syllabus/add`}>
          Add
        </Link>
      </div>
      <div>
        <table className="table-auto w-full">
          <thead>
            <th>id</th>
            <th>createdAt</th>
            <th>updatedAt</th>
            <th>courseTitle</th>
            <th>courseCode</th>
            <th>faculty</th>
            <th>action</th>
          </thead>
          <tbody>
            {syllabi.map((syllabus) => {
              return (
                <tr key={syllabus.id}>
                  <td>{syllabus.id}</td>
                  <td>{new Date(syllabus.createdAt).toLocaleString()}</td>
                  <td>{new Date(syllabus.updatedAt).toLocaleString()}</td>
                  <td>{syllabus.courseTitle}</td>
                  <td>{syllabus.courseCode}</td>
                  <td>
                    <Link
                      href={`/crud/faculty/${syllabus.facultyId}`}
                      className="underline"
                    >
                      {syllabus.facultyId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/syllabus/${syllabus.id}`}
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
