import { ReturnedIMERCCITLRevisionSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import { DateTime } from "luxon";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import Modal from "./Modal";

export interface ReturnedIMERCCITLRevisionSuggestionItemProps {
  returnedIMERCCITLRevisionSuggestionItem: ReturnedIMERCCITLRevisionSuggestionItem;
}
export default function ReturnedIMERCCITLRevisionSuggestionItem({
  returnedIMERCCITLRevisionSuggestionItem,
}: ReturnedIMERCCITLRevisionSuggestionItemProps) {
  const router = useRouter();
  const handleDelete = () => {
    if (confirm("Are you sure? This action cannot be undone.")) {
      axios
        .delete(
          `/api/returned_imerc_citl_revision_suggestion_item/${returnedIMERCCITLRevisionSuggestionItem.id}`
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
      <td className='w-1/4'>
        {returnedIMERCCITLRevisionSuggestionItem.suggestion}
      </td>
      <td className='text-center w-1/8'>
        {returnedIMERCCITLRevisionSuggestionItem.pageNumber}
      </td>
      <td className='w-1/4'>
        {returnedIMERCCITLRevisionSuggestionItem.actionTaken}
      </td>
      <td className='w-1/4'>
        {returnedIMERCCITLRevisionSuggestionItem.remarks}
      </td>
      <td className='w-1/8'>
        <div className='flex flex-col space-y-1'>
          <EditSuggestionItem
            returnedIMERCCITLRevisionSuggestionItem={
              returnedIMERCCITLRevisionSuggestionItem
            }
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
  returnedIMERCCITLRevisionSuggestionItem: ReturnedIMERCCITLRevisionSuggestionItem;
}

function EditSuggestionItem({
  returnedIMERCCITLRevisionSuggestionItem,
}: EditSuggestionItemProps) {
  const router = useRouter();
  const [openEdit, setOpenEdit] = useState(false);
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
          `/api/returned_imerc_citl_revision_suggestion_item/${returnedIMERCCITLRevisionSuggestionItem.id}`,
          values
        )
        .then(() => {
          alert("Suggestion updated successfully");
          router.reload();
        });
    },
  });

  useEffect(() => {
    if (!returnedIMERCCITLRevisionSuggestionItem) return;
    formik.setValues({
      pageNumber: returnedIMERCCITLRevisionSuggestionItem.pageNumber,
      remarks: returnedIMERCCITLRevisionSuggestionItem?.remarks ?? "",
      suggestion: returnedIMERCCITLRevisionSuggestionItem.suggestion,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returnedIMERCCITLRevisionSuggestionItem]);

  return (
    <div>
      <button
        className='bg-palette_blue text-palette_white rounded w-full'
        onClick={() => setOpenEdit(true)}
      >
        Edit
      </button>

      {openEdit && (
        <Modal title='Edit Suggestion Item' onClose={() => setOpenEdit(false)}>
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
