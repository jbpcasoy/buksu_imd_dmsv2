import CrudLayout from "@/components/CrudLayout";
import useSyllabusDepartmentReviews from "@/hooks/useSyllabusDepartmentReviews";
import Link from "next/link";
import { useState } from "react";

export default function SyllabusDepartmentReview() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { count, syllabusDepartmentReviews } =
    useSyllabusDepartmentReviews(state);

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
        <h2>SyllabusDepartmentReview</h2>
        <Link
          className="border rounded"
          href={`/crud/syllabus_department_review/add`}
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
              <th>syllabusFileId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {syllabusDepartmentReviews.map((syllabusDepartmentReview) => {
              return (
                <tr key={syllabusDepartmentReview.id}>
                  <td>{syllabusDepartmentReview.id}</td>
                  <td>
                    {new Date(
                      syllabusDepartmentReview.createdAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    {new Date(
                      syllabusDepartmentReview.updatedAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    <Link
                      href={`/crud/syllabus_file/${syllabusDepartmentReview.syllabusFileId}`}
                      className="underline"
                    >
                      {syllabusDepartmentReview.syllabusFileId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/syllabus_department_review/${syllabusDepartmentReview.id}`}
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
