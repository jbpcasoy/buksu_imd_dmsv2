import useIDDSpecialistSuggestionItemsIM from "@/hooks/useIDDSpecialistSuggestionItemsIM";
import Link from "next/link";
import { useState } from "react";

export interface IMIDDSpecialistSuggestionItemsProps {
  id: string;
}

export default function IMIDDSpecialistSuggestionItems({
  id,
}: IMIDDSpecialistSuggestionItemsProps) {
  const [state, setState] = useState({
    skip: 0,
    take: 10,
    id,
  });

  const iDDSpecialistSuggestionItems =
    useIDDSpecialistSuggestionItemsIM(state);

  return (
    <table>
      <caption>IDDSpecialist Suggestions</caption>
      <thead>
        <tr>
          <th>id</th>
          <th>createdAt</th>
          <th>updatedAt</th>
          <th>suggestion</th>
          <th>pageNumber</th>
          <th>actionTaken</th>
          <th>remarks</th>
          <th>iDDSpecialistSuggestionId</th>
          <th>actions</th>
        </tr>
      </thead>
      <tbody>
        {iDDSpecialistSuggestionItems.iDDSpecialistSuggestionItems.map(
          (iDDSpecialistSuggestionItem) => {
            return (
              <tr key={iDDSpecialistSuggestionItem.id}>
                <td>{iDDSpecialistSuggestionItem.id}</td>
                <td>
                  {new Date(
                    iDDSpecialistSuggestionItem.createdAt
                  ).toLocaleString()}
                </td>
                <td>
                  {new Date(
                    iDDSpecialistSuggestionItem.updatedAt
                  ).toLocaleString()}
                </td>
                <td>{iDDSpecialistSuggestionItem.suggestion}</td>
                <td>{iDDSpecialistSuggestionItem.pageNumber}</td>
                <td>{iDDSpecialistSuggestionItem.actionTaken}</td>
                <td>{iDDSpecialistSuggestionItem.remarks}</td>
                <td>
                  {
                    iDDSpecialistSuggestionItem.iDDSpecialistSuggestionId
                  }
                </td>
                <td>
                  <Link
                    href={`/idd_specialist_suggestion_item/${iDDSpecialistSuggestionItem.id}/action_taken/edit`}
                    className='border rounded'
                  >
                    edit
                  </Link>
                </td>
              </tr>
            );
          }
        )}
      </tbody>
    </table>
  );
}
