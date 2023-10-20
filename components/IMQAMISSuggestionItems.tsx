import useQAMISSuggestionItemsIM from "@/hooks/useQAMISSuggestionItemsIM";
import Link from "next/link";
import { useEffect, useState } from "react";

export interface IMQAMISSuggestionItemsProps {
  id: string;
  editable?: boolean;
}

export default function IMQAMISSuggestionItems({
  id,
  editable = true,
}: IMQAMISSuggestionItemsProps) {
  const [state, setState] = useState({
    skip: 0,
    take: 10,
    id,
  });

  useEffect(() => {
    setState((prev) => ({ ...prev, id }));
  }, [id]);

  const qAMISSuggestionItems = useQAMISSuggestionItemsIM(state);

  return (
    <table>
      <caption>QAMIS Suggestions</caption>
      <thead>
        <tr>
          <th>id</th>
          <th>createdAt</th>
          <th>updatedAt</th>
          <th>suggestion</th>
          <th>pageNumber</th>
          <th>actionTaken</th>
          <th>remarks</th>
          <th>qAMISSuggestionId</th>
        </tr>
      </thead>
      <tbody>
        {qAMISSuggestionItems.qAMISSuggestionItems.map(
          (qAMISSuggestionItem) => {
            return (
              <tr key={qAMISSuggestionItem.id}>
                <td>{qAMISSuggestionItem.id}</td>
                <td>
                  {new Date(
                    qAMISSuggestionItem.createdAt
                  ).toLocaleString()}
                </td>
                <td>
                  {new Date(
                    qAMISSuggestionItem.updatedAt
                  ).toLocaleString()}
                </td>
                <td>{qAMISSuggestionItem.suggestion}</td>
                <td>{qAMISSuggestionItem.pageNumber}</td>
                <td>{qAMISSuggestionItem.actionTaken}</td>
                <td>{qAMISSuggestionItem.remarks}</td>
                <td>{qAMISSuggestionItem.qAMISSuggestionId}</td>
              </tr>
            );
          }
        )}
      </tbody>
    </table>
  );
}
