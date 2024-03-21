import CrudLayout from "@/components/CrudLayout";
import useIDDSpecialistSuggestions from "@/hooks/useIDDSpecialistSuggestions";
import Link from "next/link";
import { useState } from "react";

export default function IDDSpecialistSuggestionsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { iDDSpecialistSuggestions, count } =
    useIDDSpecialistSuggestions(state);

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
        <h2>IDDSpecialistSuggestion</h2>
        <Link
          className="border rounded"
          href={`/crud/idd_specialist_suggestion/add`}
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
              <th>iDDSpecialistReviewId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {iDDSpecialistSuggestions.map((iDDSpecialistSuggestion) => {
              return (
                <tr key={iDDSpecialistSuggestion.id}>
                  <td>{iDDSpecialistSuggestion.id}</td>
                  <td>
                    {new Date(
                      iDDSpecialistSuggestion.createdAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    {new Date(
                      iDDSpecialistSuggestion.updatedAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    <Link
                      href={`/crud/idd_specialist_review/${iDDSpecialistSuggestion.iDDSpecialistReviewId}`}
                      className="underline"
                    >
                      {iDDSpecialistSuggestion.iDDSpecialistReviewId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/idd_specialist_suggestion/${iDDSpecialistSuggestion.id}`}
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
