import useContentEditorSuggestionItemsIM from "@/hooks/useContentEditorSuggestionItemsIM";
import Link from "next/link";
import { useEffect, useState } from "react";

export interface IMContentEditorSuggestionItemsProps {
  id: string;
  editable?: boolean;
}

export default function IMContentEditorSuggestionItems({
  id,
  editable = true,
}: IMContentEditorSuggestionItemsProps) {
  const [state, setState] = useState({
    skip: 0,
    take: 10,
    id,
  });

  useEffect(() => {
    setState((prev) => ({ ...prev, id }));
  }, [id]);

  const contentEditorSuggestionItems = useContentEditorSuggestionItemsIM(state);

  const handleNext = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return {
        ...prev,
        skip:
          nextVal <= contentEditorSuggestionItems.count
            ? nextVal
            : prev.skip,
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
        <caption>ContentEditor Suggestions</caption>
        <thead>
          <tr>
            <th>id</th>
            <th>createdAt</th>
            <th>updatedAt</th>
            <th>suggestion</th>
            <th>pageNumber</th>
            <th>actionTaken</th>
            <th>remarks</th>
            <th>contentEditorSuggestionId</th>
            {editable && <th>actions</th>}
          </tr>
        </thead>
        <tbody>
          {contentEditorSuggestionItems.contentEditorSuggestionItems.map(
            (contentEditorSuggestionItem) => {
              return (
                <tr key={contentEditorSuggestionItem.id}>
                  <td>{contentEditorSuggestionItem.id}</td>
                  <td>
                    {new Date(
                      contentEditorSuggestionItem.createdAt
                    ).toLocaleString()}
                  </td>
                  <td>
                    {new Date(
                      contentEditorSuggestionItem.updatedAt
                    ).toLocaleString()}
                  </td>
                  <td>{contentEditorSuggestionItem.suggestion}</td>
                  <td>{contentEditorSuggestionItem.pageNumber}</td>
                  <td>{contentEditorSuggestionItem.actionTaken}</td>
                  <td>{contentEditorSuggestionItem.remarks}</td>
                  <td>
                    {contentEditorSuggestionItem.contentEditorSuggestionId}
                  </td>
                  {editable && (
                    <td>
                      <Link
                        href={`/content_editor_suggestion_item/${contentEditorSuggestionItem.id}/action_taken/edit`}
                        className='border rounded'
                      >
                        edit
                      </Link>
                    </td>
                  )}
                </tr>
              );
            }
          )}
        </tbody>
      </table>

      <div className='flex justify-end space-x-1'>
        <p>
          {state.skip} - {state.skip + state.take} of{" "}
          {contentEditorSuggestionItems.count}
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
