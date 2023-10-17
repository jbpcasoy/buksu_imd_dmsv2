import useChairpersonSuggestionItemsIM from "@/hooks/useChairpersonSuggestionItemsIM";
import Link from "next/link";
import { useState } from "react";

export interface IMChairpersonSuggestionItemsProps {
  id: string;
}

export default function IMChairpersonSuggestionItems({
  id,
}: IMChairpersonSuggestionItemsProps) {
  const [state, setState] = useState({
    skip: 0,
    take: 10,
    id,
  });

  const chairpersonSuggestionItems = useChairpersonSuggestionItemsIM(state);

  return (
    <table>
      <caption>Chairperson Suggestions</caption>
      <thead>
        <tr>
          <th>id</th>
          <th>createdAt</th>
          <th>updatedAt</th>
          <th>suggestion</th>
          <th>pageNumber</th>
          <th>actionTaken</th>
          <th>remarks</th>
          <th>chairpersonSuggestionId</th>
          <th>actions</th>
        </tr>
      </thead>
      <tbody>
        {chairpersonSuggestionItems.chairpersonSuggestionItems.map(
          (chairpersonSuggestionItem) => {
            return (
              <tr>
                <td>{chairpersonSuggestionItem.id}</td>
                <td>
                  {new Date(
                    chairpersonSuggestionItem.createdAt
                  ).toLocaleString()}
                </td>
                <td>
                  {new Date(
                    chairpersonSuggestionItem.updatedAt
                  ).toLocaleString()}
                </td>
                <td>{chairpersonSuggestionItem.suggestion}</td>
                <td>{chairpersonSuggestionItem.pageNumber}</td>
                <td>{chairpersonSuggestionItem.actionTaken}</td>
                <td>{chairpersonSuggestionItem.remarks}</td>
                <td>{chairpersonSuggestionItem.chairpersonSuggestionId}</td>
                <td>
                  <Link
                    href={`/chairperson_suggestion_item/${chairpersonSuggestionItem.id}/action_taken/edit`}
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
