import useReturnedDepartmentRevisionSuggestionItemActionTakenReturnedDepartmentRevisionSuggestionItem from "@/hooks/useReturnedDepartmentRevisionSuggestionItemActionTakenReturnedDepartmentRevisionSuggestionItem";
import { ReturnedDepartmentRevisionSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import { DateTime } from "luxon";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import Modal from "./Modal";

export interface ReturnedDepartmentRevisionSuggestionItemProps {
  returnedDepartmentRevisionSuggestionItem: ReturnedDepartmentRevisionSuggestionItem;
}
export default function ReturnedDepartmentRevisionSuggestionItem({
  returnedDepartmentRevisionSuggestionItem,
}: ReturnedDepartmentRevisionSuggestionItemProps) {
  const router = useRouter();
  const handleDelete = () => {
    if (confirm("Are you sure? This action cannot be undone.")) {
      axios
        .delete(
          `/api/returned_department_revision_suggestion_item/${returnedDepartmentRevisionSuggestionItem.id}`
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
          new Date(returnedDepartmentRevisionSuggestionItem.updatedAt)
        ).toRelative()}
      </td>
      <td>{returnedDepartmentRevisionSuggestionItem.suggestion}</td>
      <td>{returnedDepartmentRevisionSuggestionItem.pageNumber}</td>
      <td>{returnedDepartmentRevisionSuggestionItem.actionTaken}</td>
      <td>{returnedDepartmentRevisionSuggestionItem.remarks}</td>
      <td className=''>
        <div className='flex flex-col space-y-1'>
          <EditSuggestionItem
            returnedDepartmentRevisionSuggestionItem={
              returnedDepartmentRevisionSuggestionItem
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
  returnedDepartmentRevisionSuggestionItem: ReturnedDepartmentRevisionSuggestionItem;
}
function EditSuggestionItem({
  returnedDepartmentRevisionSuggestionItem,
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
          `/api/returned_department_revision_suggestion_item/${returnedDepartmentRevisionSuggestionItem.id}`,
          values
        )
        .then(() => {
          alert("Suggestion updated successfully");
          router.reload();
        });
    },
  });

  useEffect(() => {
    if (!returnedDepartmentRevisionSuggestionItem) return;
    formik.setValues({
      pageNumber: returnedDepartmentRevisionSuggestionItem.pageNumber,
      remarks: returnedDepartmentRevisionSuggestionItem?.remarks ?? "",
      suggestion: returnedDepartmentRevisionSuggestionItem.suggestion,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returnedDepartmentRevisionSuggestionItem, openEdit]);

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
                className='bg-palette_blue text-white rounded py-1'
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
