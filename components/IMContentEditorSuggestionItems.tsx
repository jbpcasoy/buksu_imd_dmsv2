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
    take: 999,
    id,
  });

  const contentEditorSuggestionItems = useContentEditorSuggestionItemsIM(state);

  useEffect(() => {
    setState((prev) => ({ ...prev, id }));
  }, [id]);
  return (
    <div className='border border-palette_orange rounded'>
      <table className='w-full text-sm'>
        <caption className='font-bold text-left p-2 bg-palette_grey bg-opacity-10'>
          CONTENT EDITOR SUGGESTIONS
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
    <tr className="border-t border-b last:border-b-0">
      <td className={`pl-2 ${editable ? "w-1/4" : "w-3/10"}`}>
        {contentEditorSuggestionItem.suggestion}
      </td>
      <td className={`text-center ${editable ? "w-1/8" : "w-1/10"}`}>
        {contentEditorSuggestionItem.pageNumber}
      </td>
      <td className={`${editable ? "w-1/4" : "w-3/10"}`}>
        {contentEditorSuggestionItemActionTaken?.value}
      </td>
      <td className={`${editable ? "w-1/4" : "w-3/10 pr-2"}`}>
        {contentEditorSuggestionItem.remarks}
      </td>
      {editable && (
        <td className='w-1/8 pr-2'>
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
