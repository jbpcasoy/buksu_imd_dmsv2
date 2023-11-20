import useQAMISSuggestionItemsIM from "@/hooks/useQAMISSuggestionItemsIM";
import { DateTime } from "luxon";
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
    <div className="border border-palette_orange rounded">
      <table className="w-full text-sm">
        <caption className="bg-palette_grey bg-opacity-10 p-1 text-left font-bold">QAMIS SUGGESTIONS</caption>
        <thead className="bg-palette_grey bg-opacity-10 text-palette_grey">
          <tr>
            <th className="font-normal">LAST ACTIVITY</th>
            <th className="font-normal">SUGGESTION</th>
            <th className="font-normal">PAGE NUMBER</th>
            <th className="font-normal">ACTION TAKEN</th>
            <th className="font-normal">REMARKS</th>
            {editable && <th className="font-normal">ACTIONS</th>}
          </tr>
        </thead>
        <tbody className="text-palette_grey">
          {qAMISSuggestionItems.qAMISSuggestionItems.map(
            (qAMISSuggestionItem) => {
              return (
                <tr key={qAMISSuggestionItem.id}>
                  <td>
                    {DateTime.fromJSDate(
                      new Date(qAMISSuggestionItem.updatedAt)
                    ).toRelative()}
                  </td>
                  <td>{qAMISSuggestionItem.suggestion}</td>
                  <td className="text-center">{qAMISSuggestionItem.pageNumber}</td>
                  <td>{qAMISSuggestionItem.actionTaken}</td>
                  <td>{qAMISSuggestionItem.remarks}</td>
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
