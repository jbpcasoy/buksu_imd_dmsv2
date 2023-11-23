import { ChairpersonSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import Modal from "./Modal";

export interface ChairpersonSuggestionItemProps {
  chairpersonSuggestionItem: ChairpersonSuggestionItem;
}
export default function ChairpersonSuggestionItem({
  chairpersonSuggestionItem,
}: ChairpersonSuggestionItemProps) {
  const router = useRouter();
  const handleDelete = () => {
    if (confirm("Are you sure? This action cannot be undone.")) {
      axios
        .delete(
          `/api/chairperson_suggestion_item/${chairpersonSuggestionItem.id}`
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
      <td className='w-1/4'>{chairpersonSuggestionItem.suggestion}</td>
      <td className='text-center w-1/8'>
        {chairpersonSuggestionItem.pageNumber}
      </td>
      <td className='w-1/4'>{chairpersonSuggestionItem.actionTaken}</td>
      <td className='w-1/4'>{chairpersonSuggestionItem.remarks}</td>
      <td className='w-1/8'>
        <div className='flex flex-col space-y-1'>
          <EditSuggestionItem
            chairpersonSuggestionItem={chairpersonSuggestionItem}
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
  chairpersonSuggestionItem: ChairpersonSuggestionItem;
}
function EditSuggestionItem({
  chairpersonSuggestionItem,
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
          `/api/chairperson_suggestion_item/${chairpersonSuggestionItem.id}`,
          values
        )
        .then(() => {
          alert("Suggestion updated successfully");
          router.reload();
        });
    },
  });

  useEffect(() => {
    if (!chairpersonSuggestionItem) return;
    formik.setValues({
      pageNumber: chairpersonSuggestionItem.pageNumber,
      remarks: chairpersonSuggestionItem?.remarks ?? "",
      suggestion: chairpersonSuggestionItem.suggestion,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chairpersonSuggestionItem]);

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
                className='bg-palette_blue text-white rounded'
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
