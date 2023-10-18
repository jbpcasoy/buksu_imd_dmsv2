import useContentSpecialistSuggestionItemsIM from "@/hooks/useContentSpecialistSuggestionItemsIM";
import Link from "next/link";
import { useState } from "react";

export interface IMContentSpecialistSuggestionItemsProps {
  id: string;
}

export default function IMContentSpecialistSuggestionItems({
  id,
}: IMContentSpecialistSuggestionItemsProps) {
  const [state, setState] = useState({
    skip: 0,
    take: 10,
    id,
  });

  const contentSpecialistSuggestionItems =
    useContentSpecialistSuggestionItemsIM(state);

  return (
    <table>
      <caption>ContentSpecialist Suggestions</caption>
      <thead>
        <tr>
          <th>id</th>
          <th>createdAt</th>
          <th>updatedAt</th>
          <th>suggestion</th>
          <th>pageNumber</th>
          <th>actionTaken</th>
          <th>remarks</th>
          <th>contentSpecialistSuggestionId</th>
          <th>actions</th>
        </tr>
      </thead>
      <tbody>
        {contentSpecialistSuggestionItems.contentSpecialistSuggestionItems.map(
          (contentSpecialistSuggestionItem) => {
            return (
              <tr key={contentSpecialistSuggestionItem.id}>
                <td>{contentSpecialistSuggestionItem.id}</td>
                <td>
                  {new Date(
                    contentSpecialistSuggestionItem.createdAt
                  ).toLocaleString()}
                </td>
                <td>
                  {new Date(
                    contentSpecialistSuggestionItem.updatedAt
                  ).toLocaleString()}
                </td>
                <td>{contentSpecialistSuggestionItem.suggestion}</td>
                <td>{contentSpecialistSuggestionItem.pageNumber}</td>
                <td>{contentSpecialistSuggestionItem.actionTaken}</td>
                <td>{contentSpecialistSuggestionItem.remarks}</td>
                <td>
                  {
                    contentSpecialistSuggestionItem.contentSpecialistSuggestionId
                  }
                </td>
                <td>
                  <Link
                    href={`/content_specialist_suggestion_item/${contentSpecialistSuggestionItem.id}/action_taken/edit`}
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
