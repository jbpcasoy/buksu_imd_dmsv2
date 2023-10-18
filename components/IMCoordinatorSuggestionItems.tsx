import useCoordinatorSuggestionItemsIM from "@/hooks/useCoordinatorSuggestionItemsIM";
import Link from "next/link";
import { useState } from "react";

export interface IMCoordinatorSuggestionItemsProps {
  id: string;
}

export default function IMCoordinatorSuggestionItems({
  id,
}: IMCoordinatorSuggestionItemsProps) {
  const [state, setState] = useState({
    skip: 0,
    take: 10,
    id,
  });

  const coordinatorSuggestionItems = useCoordinatorSuggestionItemsIM(state);

  return (
    <table>
      <caption>Coordinator Suggestions</caption>
      <thead>
        <tr>
          <th>id</th>
          <th>createdAt</th>
          <th>updatedAt</th>
          <th>suggestion</th>
          <th>pageNumber</th>
          <th>actionTaken</th>
          <th>remarks</th>
          <th>coordinatorSuggestionId</th>
          <th>actions</th>
        </tr>
      </thead>
      <tbody>
        {coordinatorSuggestionItems.coordinatorSuggestionItems.map(
          (coordinatorSuggestionItem) => {
            return (
              <tr key={coordinatorSuggestionItem.id}>
                <td>{coordinatorSuggestionItem.id}</td>
                <td>
                  {new Date(
                    coordinatorSuggestionItem.createdAt
                  ).toLocaleString()}
                </td>
                <td>
                  {new Date(
                    coordinatorSuggestionItem.updatedAt
                  ).toLocaleString()}
                </td>
                <td>{coordinatorSuggestionItem.suggestion}</td>
                <td>{coordinatorSuggestionItem.pageNumber}</td>
                <td>{coordinatorSuggestionItem.actionTaken}</td>
                <td>{coordinatorSuggestionItem.remarks}</td>
                <td>{coordinatorSuggestionItem.coordinatorSuggestionId}</td>
                <td>
                  <Link
                    href={`/coordinator_suggestion_item/${coordinatorSuggestionItem.id}/action_taken/edit`}
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
