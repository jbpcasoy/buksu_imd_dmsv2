import useContentEditorSuggestionItemActionTakenContentEditorSuggestionItem from "@/hooks/useContentEditorSuggestionItemActionTakenContentEditorSuggestionItem";
import useContentEditorSuggestionItemsIM from "@/hooks/useContentEditorSuggestionItemsIM";
import { ContentEditorSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import { DateTime } from "luxon";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import Modal from "./Modal";

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

  const contentEditorSuggestionItems = useContentEditorSuggestionItemsIM(state);

  useEffect(() => {
    setState((prev) => ({ ...prev, id }));
  }, [id]);

  const handleNext = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return {
        ...prev,
        skip:
          nextVal <= contentEditorSuggestionItems.count ? nextVal : prev.skip,
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
    <div className='border border-palette_orange rounded'>
      <table className='w-full text-sm'>
        <caption className='font-bold text-left p-1 bg-palette_grey bg-opacity-10'>
          CONTENT EDITOR SUGGESTIONS
        </caption>
        <thead className='bg-palette_grey bg-opacity-10 text-palette_grey'>
          <tr>
            <th className='font-normal'>LAST ACTIVITY</th>
            <th className='font-normal'>SUGGESTION</th>
            <th className='font-normal'>PAGE NUMBER</th>
            <th className='font-normal'>ACTION TAKEN</th>
            <th className='font-normal'>REMARKS</th>
            {editable && <th className='font-normal'>ACTIONS</th>}
          </tr>
        </thead>
        <tbody className='text-palette_grey'>
          {contentEditorSuggestionItems.contentEditorSuggestionItems.map(
            (contentEditorSuggestionItem) => {
              return (
                <Item
                  contentEditorSuggestionItem={contentEditorSuggestionItem}
                  editable={editable}
                  key={contentEditorSuggestionItem.id}
                />
              );
            }
          )}
        </tbody>
      </table>
      <div className='flex justify-end space-x-1 p-1'>
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

function Item({
  contentEditorSuggestionItem,
  editable,
}: {
  contentEditorSuggestionItem: ContentEditorSuggestionItem;
  editable: boolean;
}) {
  const contentEditorSuggestionItemActionTaken =
    useContentEditorSuggestionItemActionTakenContentEditorSuggestionItem({
      id: contentEditorSuggestionItem.id,
    });

  return (
    <tr>
      <td>
        {DateTime.fromJSDate(
          new Date(contentEditorSuggestionItem.updatedAt)
        ).toRelative()}
      </td>
      <td>{contentEditorSuggestionItem.suggestion}</td>
      <td className='text-center'>{contentEditorSuggestionItem.pageNumber}</td>
      <td>{contentEditorSuggestionItemActionTaken?.value}</td>
      <td>{contentEditorSuggestionItem.remarks}</td>
      {editable && (
        <td>
          <EditSuggestionItemActionTaken
            contentEditorSuggestionItem={contentEditorSuggestionItem}
          />
        </td>
      )}
    </tr>
  );
}

interface EditSuggestionItemActionProps {
  contentEditorSuggestionItem: ContentEditorSuggestionItem;
}

function EditSuggestionItemActionTaken({
  contentEditorSuggestionItem,
}: EditSuggestionItemActionProps) {
  const [openEdit, setOpenEdit] = useState(false);
  const router = useRouter();
  const contentEditorSuggestionItemActionTaken =
    useContentEditorSuggestionItemActionTakenContentEditorSuggestionItem({
      id: contentEditorSuggestionItem.id as string,
    });
  const formik = useFormik({
    initialValues: {
      value: "",
    },
    validationSchema: Yup.object({
      value: Yup.string().required(),
    }),
    onSubmit: (values) => {
      if (contentEditorSuggestionItemActionTaken) {
        axios
          .put(
            `/api/content_editor_suggestion_item_action_taken/${contentEditorSuggestionItemActionTaken.id}`,
            values
          )
          .then(() => {
            alert("Suggestion updated successfully");
            router.reload();
          });
      } else {
        axios
          .post(`/api/content_editor_suggestion_item_action_taken`, {
            contentEditorSuggestionItemId: contentEditorSuggestionItem.id,
            value: values.value,
          })
          .then(() => {
            alert("Suggestion updated successfully");
            router.reload();
          });
      }
    },
  });

  useEffect(() => {
    if (!contentEditorSuggestionItemActionTaken) return;
    formik.setValues({
      value: contentEditorSuggestionItemActionTaken.value ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentEditorSuggestionItemActionTaken]);

  return (
    <div>
      <button
        className='bg-palette_blue text-palette_white rounded w-full'
        onClick={() => setOpenEdit(true)}
      >
        Edit
      </button>

      {openEdit && (
        <Modal title='Edit Action Taken' onClose={() => setOpenEdit(false)}>
          <form noValidate onSubmit={formik.handleSubmit}>
            <div className='flex flex-col space-y-1'>
              <textarea
                placeholder='Action Taken'
                {...formik.getFieldProps("value")}
                className='rounded'
              />
              <input
                type='submit'
                value='Submit'
                className='bg-palette_blue text-palette_white rounded py-1'
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
