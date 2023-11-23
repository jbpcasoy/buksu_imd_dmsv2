import { ContentEditorSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import { DateTime } from "luxon";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import Modal from "./Modal";

export interface ContentEditorSuggestionItemProps {
  contentEditorSuggestionItem: ContentEditorSuggestionItem;
}
export default function ContentEditorSuggestionItem({
  contentEditorSuggestionItem,
}: ContentEditorSuggestionItemProps) {
  const router = useRouter();
  const handleDelete = () => {
    if (confirm("Are you sure? This action cannot be undone.")) {
      axios
        .delete(
          `/api/content_editor_suggestion_item/${contentEditorSuggestionItem.id}`
        )
        .then(() => {
          alert("Suggestion deleted successfully");
          router.reload();
        })
        .catch((error) => {
          console.error(error);
          alert("Failed to delete suggestion");
        });
    }
  };
  return (
    <tr className=''>
      <td className='w-1/4'>{contentEditorSuggestionItem.suggestion}</td>
      <td className='text-center w-1/8'>
        {contentEditorSuggestionItem.pageNumber}
      </td>
      <td className='w-1/4'>{contentEditorSuggestionItem.actionTaken}</td>
      <td className='w-1/4'>{contentEditorSuggestionItem.remarks}</td>
      <td className='w-1/8'>
        <div className='flex flex-col space-y-1'>
          <EditSuggestionItem
            contentEditorSuggestionItem={contentEditorSuggestionItem}
          />
          <button
            className='bg-palette_blue text-palette_white rounded'
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

interface EditSuggestionItemProps {
  contentEditorSuggestionItem: ContentEditorSuggestionItem;
}

function EditSuggestionItem({
  contentEditorSuggestionItem,
}: EditSuggestionItemProps) {
  const [openEdit, setOpenEdit] = useState(false);
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      suggestion: "",
      pageNumber: 0,
      remarks: "",
    },
    validationSchema: Yup.object({
      suggestion: Yup.string().required(),
      pageNumber: Yup.number().min(0).required(),
      remarks: Yup.string(),
    }),
    onSubmit: (values) => {
      axios
        .put(
          `/api/content_editor_suggestion_item/${contentEditorSuggestionItem.id}`,
          values
        )
        .then(() => {
          alert("Suggestion updated successfully");
          router.reload();
        });
    },
  });

  useEffect(() => {
    if (!contentEditorSuggestionItem) return;
    formik.setValues({
      pageNumber: contentEditorSuggestionItem.pageNumber,
      remarks: contentEditorSuggestionItem?.remarks ?? "",
      suggestion: contentEditorSuggestionItem.suggestion,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentEditorSuggestionItem]);

  return (
    <div>
      <button
        className='bg-palette_blue text-palette_white rounded w-full'
        onClick={() => setOpenEdit(true)}
      >
        Edit
      </button>
      {openEdit && (
        <Modal title='Edit Suggestion' onClose={() => setOpenEdit(false)}>
          <form noValidate onSubmit={formik.handleSubmit}>
            <div className='flex flex-col space-y-1'>
              <textarea
                placeholder='Suggestion'
                {...formik.getFieldProps("suggestion")}
                className='rounded'
              />
              <input
                type='number'
                placeholder='Page No.'
                {...formik.getFieldProps("pageNumber")}
                className='rounded'
              />
              <textarea
                placeholder='Remarks'
                {...formik.getFieldProps("remarks")}
                className='rounded'
              />
              <input
                type='submit'
                value='Submit'
                className='bg-palette_blue text-palette_white py-1 rounded'
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
