import useContentSpecialistSuggestionItemActionTakenContentSpecialistSuggestionItem from "@/hooks/useContentSpecialistSuggestionItemActionTakenContentSpecialistSuggestionItem";
import useContentSpecialistSuggestionItemsIM from "@/hooks/useContentSpecialistSuggestionItemsIM";
import { ContentSpecialistSuggestionItem } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";

export interface IMContentSpecialistSuggestionItemsProps {
  id: string;
  editable?: boolean;
}

export default function IMContentSpecialistSuggestionItems({
  id,
  editable = true,
}: IMContentSpecialistSuggestionItemsProps) {
  const [state, setState] = useState({
    skip: 0,
    take: 10,
    id,
  });

  const contentSpecialistSuggestionItems = useContentSpecialistSuggestionItemsIM(state);

  useEffect(() => {
    setState((prev) => ({ ...prev, id }));
  }, [id]);

  const handleNext = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return {
        ...prev,
        skip: nextVal <= contentSpecialistSuggestionItems.count ? nextVal : prev.skip,
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
            {editable && <th>actions</th>}
          </tr>
        </thead>
        <tbody>
          {contentSpecialistSuggestionItems.contentSpecialistSuggestionItems.map((contentSpecialistSuggestionItem) => {
            return (
              <Item
                contentSpecialistSuggestionItem={contentSpecialistSuggestionItem}
                editable={editable}
                key={contentSpecialistSuggestionItem.id}
              />
            );
          })}
        </tbody>
      </table>
      <div className='flex justify-end space-x-1'>
        <p>
          {state.skip} - {state.skip + state.take} of{" "}
          {contentSpecialistSuggestionItems.count}
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

function Item({
  contentSpecialistSuggestionItem,
  editable,
}: {
  contentSpecialistSuggestionItem: ContentSpecialistSuggestionItem;
  editable: boolean;
}) {
  const contentSpecialistSuggestionItemActionTaken =
    useContentSpecialistSuggestionItemActionTakenContentSpecialistSuggestionItem({
      id: contentSpecialistSuggestionItem.id,
    });

  return (
    <tr>
      <td>{contentSpecialistSuggestionItem.id}</td>
      <td>{new Date(contentSpecialistSuggestionItem.createdAt).toLocaleString()}</td>
      <td>{new Date(contentSpecialistSuggestionItem.updatedAt).toLocaleString()}</td>
      <td>{contentSpecialistSuggestionItem.suggestion}</td>
      <td>{contentSpecialistSuggestionItem.pageNumber}</td>
      <td>{contentSpecialistSuggestionItemActionTaken?.value}</td>
      <td>{contentSpecialistSuggestionItem.remarks}</td>
      <td>{contentSpecialistSuggestionItem.contentSpecialistSuggestionId}</td>
      {editable && (
        <td>
          <Link
            href={`/content_specialist_suggestion_item/${contentSpecialistSuggestionItem.id}/action_taken/edit`}
            className='border rounded'
          >
            edit
          </Link>
        </td>
      )}
    </tr>
  );
}
