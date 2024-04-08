import CrudLayout from "@/components/CrudLayout";
import useSyllabusChairpersonReviews from "@/hooks/useSyllabusChairpersonReviews";
import Link from "next/link";
import { useState } from "react";

export default function SyllabusChairpersonReviewsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { syllabusChairpersonReviews, count } =
    useSyllabusChairpersonReviews(state);

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
        <h2>SyllabusChairpersonReview</h2>
        <Link
          className="border rounded"
          href={`/crud/syllabus_chairperson_review/add`}
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
              <th>syllabusDepartmentReviewId</th>
              <th>chairpersonId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {syllabusChairpersonReviews.map((chairpersonReview) => {
              return (
                <tr key={chairpersonReview.id}>
                  <td>{chairpersonReview.id}</td>
                  <td>
                    {new Date(chairpersonReview.createdAt).toLocaleString()}
                  </td>
                  <td>
                    {new Date(chairpersonReview.updatedAt).toLocaleString()}
                  </td>
                  <td>
                    <Link
                      href={`/crud/syllabus_department_review/${chairpersonReview.syllabusDepartmentReviewId}`}
                      className="underline"
                    >
                      {chairpersonReview.syllabusDepartmentReviewId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/chairperson/${chairpersonReview.chairpersonId}`}
                      className="underline"
                    >
                      {chairpersonReview.chairpersonId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/syllabus_chairperson_review/${chairpersonReview.id}`}
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
