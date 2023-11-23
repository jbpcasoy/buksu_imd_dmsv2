import useIDDCoordinatorSuggestionItem from "@/hooks/useIDDCoordinatorSuggestionItem";
import { IDDCoordinatorSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import { DateTime } from "luxon";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import Modal from "./Modal";

export interface IDDCoordinatorSuggestionItemProps {
  iDDCoordinatorSuggestionItem: IDDCoordinatorSuggestionItem;
}
export default function IDDCoordinatorSuggestionItem({
  iDDCoordinatorSuggestionItem,
}: IDDCoordinatorSuggestionItemProps) {
  const router = useRouter();
  const handleDelete = () => {
    if (confirm("Are you sure? This action cannot be undone.")) {
      axios
        .delete(
          `/api/idd_coordinator_suggestion_item/${iDDCoordinatorSuggestionItem.id}`
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
      <td className='w-1/4'>{iDDCoordinatorSuggestionItem.suggestion}</td>
      <td className='text-center w-1/8'>
        {iDDCoordinatorSuggestionItem.pageNumber}
      </td>
      <td className='w-1/4'>{iDDCoordinatorSuggestionItem.actionTaken}</td>
      <td className='w-1/4'>{iDDCoordinatorSuggestionItem.remarks}</td>
      <td className='w-1/8'>
        <div className='flex flex-col space-y-1'>
          <EditSuggestionItem
            iDDCoordinatorSuggestionItem={iDDCoordinatorSuggestionItem}
          />
          <button
            className='bg-palette_blue text-palette_white rounded px-1 text-sm'
            onClick={handleDelete}
          >
            delete
          </button>
        </div>
      </td>
    </tr>
  );
}

interface EditSuggestionItemProps {
  iDDCoordinatorSuggestionItem: IDDCoordinatorSuggestionItem;
}
function EditSuggestionItem({
  iDDCoordinatorSuggestionItem,
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
          `/api/idd_coordinator_suggestion_item/${iDDCoordinatorSuggestionItem.id}`,
          values
        )
        .then(() => {
          alert("Suggestion updated successfully");
          router.reload();
        });
    },
  });

  useEffect(() => {
    if (!iDDCoordinatorSuggestionItem) return;
    formik.setValues({
      pageNumber: iDDCoordinatorSuggestionItem.pageNumber,
      remarks: iDDCoordinatorSuggestionItem?.remarks ?? "",
      suggestion: iDDCoordinatorSuggestionItem.suggestion,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iDDCoordinatorSuggestionItem]);

  return (
    <div>
      <button
        className='bg-palette_blue text-palette_white px-1 rounded text-sm w-full'
        onClick={() => setOpenEdit(true)}
      >
        Edit
      </button>
      {openEdit && (
        <Modal title='Coordinator Review' onClose={() => setOpenEdit(false)}>
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
                className='bg-palette_blue text-palette_white rounded px-2 py-1'
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
