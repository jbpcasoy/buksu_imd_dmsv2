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
  
  const handleNext = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return {
        ...prev,
        skip: nextVal <= qAMISSuggestionItems.count ? nextVal : prev.skip,
      };
    });
  };

  const handlePrev = () => {
    setState((prev) => {
      const nextVal = prev.skip - prev.take;
      return { ...prev, skip: nextVal >= 0 ? nextVal : prev.skip };
    });
  };

  return (
    <div>
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
                    {new Date(qAMISSuggestionItem.createdAt).toLocaleString()}
                  </td>
                  <td>
                    {new Date(qAMISSuggestionItem.updatedAt).toLocaleString()}
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

      <div className='flex justify-end space-x-1'>
        <p>
          {state.skip} - {state.skip + state.take} of{" "}
          {qAMISSuggestionItems.count}
        </p>
        <button className='border rounded' onClick={handlePrev}>
          prev
        </button>
        <button className='border rounded' onClick={handleNext}>
          next
        </button>
      </div>
    </div>
  );
}
