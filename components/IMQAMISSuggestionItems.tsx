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
    take: 999,
    id,
  });

  useEffect(() => {
    setState((prev) => ({ ...prev, id }));
  }, [id]);

  const qAMISSuggestionItems = useQAMISSuggestionItemsIM(state);

  return (
    <div className='border border-palette_orange rounded overflow-auto'>
      <table className='w-full text-sm'>
        <caption className='bg-palette_grey bg-opacity-10 p-2 text-left font-bold'>
          QAMIS SUGGESTIONS
        </caption>
        <thead className='bg-palette_grey bg-opacity-10 text-palette_grey'>
          <tr>
            <th className='font-normal pl-2'>SUGGESTION</th>
            <th className='font-normal'>PAGE NUMBER</th>
            <th className='font-normal'>ACTION TAKEN</th>
            <th className={`font-normal ${editable ? "" : "pr-2"}`}>REMARKS</th>
            {editable && <th className='font-normal pr-2'>ACTIONS</th>}
          </tr>
        </thead>
        <tbody className='text-palette_grey'>
          {qAMISSuggestionItems.qAMISSuggestionItems.map(
            (qAMISSuggestionItem) => {
              return (
                <tr
                  className='border-t border-b last:border-b-0'
                  key={qAMISSuggestionItem.id}
                >
                  <td className={`pl-2 ${editable ? "w-1/4" : "w-3/10"}`}>
                    {qAMISSuggestionItem.suggestion}
                  </td>
                  <td
                    className={`text-center ${editable ? "w-1/8" : "w-1/10"}`}
                  >
                    {qAMISSuggestionItem.pageNumber}
                  </td>
                  <td className={`${editable ? "w-1/4" : "w-3/10"}`}>
                    {qAMISSuggestionItem.actionTaken}
                  </td>
                  <td className={`${editable ? "w-1/4" : "w-3/10 pr-2"}`}>
                    {qAMISSuggestionItem.remarks}
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </div>
  );
}
