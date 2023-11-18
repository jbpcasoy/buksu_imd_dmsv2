import { ReturnedCITLRevisionSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import { DateTime } from "luxon";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import Modal from "./Modal";

export interface ReturnedCITLRevisionSuggestionItemProps {
  returnedCITLRevisionSuggestionItem: ReturnedCITLRevisionSuggestionItem;
}
export default function ReturnedCITLRevisionSuggestionItem({
  returnedCITLRevisionSuggestionItem,
}: ReturnedCITLRevisionSuggestionItemProps) {
  const router = useRouter();
  const handleDelete = () => {
    if (confirm("Are you sure? This action cannot be undone.")) {
      axios
        .delete(
          `/api/returned_citl_revision_suggestion_item/${returnedCITLRevisionSuggestionItem.id}`
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
          new Date(returnedCITLRevisionSuggestionItem.updatedAt)
        ).toRelative()}
      </td>
      <td>{returnedCITLRevisionSuggestionItem.suggestion}</td>
      <td className='text-center'>
        {returnedCITLRevisionSuggestionItem.pageNumber}
      </td>
      <td>{returnedCITLRevisionSuggestionItem.actionTaken}</td>
      <td>{returnedCITLRevisionSuggestionItem.remarks}</td>
      <td className=''>
        <div className='flex flex-col space-y-1'>
          <EditSuggestionItem
            returnedCITLRevisionSuggestionItem={
              returnedCITLRevisionSuggestionItem
            }
          />
          <button
            className='bg-palette_blue text-palette_white rounded px-1 text-sm'
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
  returnedCITLRevisionSuggestionItem: ReturnedCITLRevisionSuggestionItem;
}
function EditSuggestionItem({
  returnedCITLRevisionSuggestionItem,
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
          `/api/returned_citl_revision_suggestion_item/${returnedCITLRevisionSuggestionItem.id}`,
          values
        )
        .then(() => {
          alert("Suggestion updated successfully");
          router.reload();
        });
    },
  });

  useEffect(() => {
    if (!returnedCITLRevisionSuggestionItem) return;
    formik.setValues({
      pageNumber: returnedCITLRevisionSuggestionItem.pageNumber,
      remarks: returnedCITLRevisionSuggestionItem?.remarks ?? "",
      suggestion: returnedCITLRevisionSuggestionItem.suggestion,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returnedCITLRevisionSuggestionItem]);

  return (
    <div>
      <button
        className='bg-palette_blue text-palette_white px-1 rounded text-sm w-full'
        onClick={() => setOpenEdit(true)}
      >
        Edit
      </button>
      {openEdit && (
        <Modal title='Edit Suggestion Item' onClose={() => setOpenEdit(false)}>
          <form noValidate onSubmit={formik.handleSubmit}>
            <div className='flex flex-col space-y-1'>
              <textarea
                placeholder='suggestion'
                {...formik.getFieldProps("suggestion")}
                className='rounded'
              />
              <input
                type='number'
                placeholder='pageNumber'
                {...formik.getFieldProps("pageNumber")}
                className='rounded'
              />
              <textarea
                placeholder='remarks'
                {...formik.getFieldProps("remarks")}
                className='rounded'
              />
              <input
                type='submit'
                value='Submit'
                className='bg-palette_blue text-white rounded py-1'
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
