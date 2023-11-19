import { ContentSpecialistSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import Modal from "./Modal";
import { DateTime } from "luxon";

export interface ContentSpecialistSuggestionItemProps {
  contentSpecialistSuggestionItem: ContentSpecialistSuggestionItem;
}
export default function ContentSpecialistSuggestionItem({
  contentSpecialistSuggestionItem,
}: ContentSpecialistSuggestionItemProps) {
  const router = useRouter();
  const handleDelete = () => {
    if (confirm("Are you sure? This action cannot be undone.")) {
      axios
        .delete(
          `/api/content_specialist_suggestion_item/${contentSpecialistSuggestionItem.id}`
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
      <td>
        {DateTime.fromJSDate(
          new Date(contentSpecialistSuggestionItem.updatedAt)
        ).toRelative()}
      </td>
      <td>{contentSpecialistSuggestionItem.suggestion}</td>
      <td>{contentSpecialistSuggestionItem.pageNumber}</td>
      <td>{contentSpecialistSuggestionItem.actionTaken}</td>
      <td>{contentSpecialistSuggestionItem.remarks}</td>
      <td className=''>
        <div className='flex flex-col space-y-1'>
          <EditSuggestionItem
            contentSpecialistSuggestionItem={contentSpecialistSuggestionItem}
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
  contentSpecialistSuggestionItem: ContentSpecialistSuggestionItem;
}

function EditSuggestionItem({
  contentSpecialistSuggestionItem,
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
          `/api/content_specialist_suggestion_item/${contentSpecialistSuggestionItem.id}`,
          values
        )
        .then(() => {
          alert("Suggestion updated successfully");
          router.reload();
        });
    },
  });

  useEffect(() => {
    if (!contentSpecialistSuggestionItem) return;
    formik.setValues({
      pageNumber: contentSpecialistSuggestionItem.pageNumber,
      remarks: contentSpecialistSuggestionItem?.remarks ?? "",
      suggestion: contentSpecialistSuggestionItem.suggestion,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentSpecialistSuggestionItem]);

  return (
    <div>
      <button
        className='bg-palette_blue text-palette_white w-full rounded'
        onClick={() => setOpenEdit(true)}
      >
        Edit
      </button>
      {openEdit && (
        <Modal title='EditSuggestion' onClose={() => setOpenEdit(false)}>
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
