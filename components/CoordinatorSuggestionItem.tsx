import { CoordinatorSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import Modal from "./Modal";
import { DateTime } from "luxon";

export interface CoordinatorSuggestionItemProps {
  coordinatorSuggestionItem: CoordinatorSuggestionItem;
}
export default function CoordinatorSuggestionItem({
  coordinatorSuggestionItem,
}: CoordinatorSuggestionItemProps) {
  const router = useRouter();
  const handleDelete = () => {
    if (confirm("Are you sure? This action cannot be undone.")) {
      axios
        .delete(
          `/api/coordinator_suggestion_item/${coordinatorSuggestionItem.id}`
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
          new Date(coordinatorSuggestionItem.updatedAt)
        ).toRelative()}
      </td>
      <td>{coordinatorSuggestionItem.suggestion}</td>
      <td className="text-center">{coordinatorSuggestionItem.pageNumber}</td>
      <td>{coordinatorSuggestionItem.actionTaken}</td>
      <td>{coordinatorSuggestionItem.remarks}</td>
      <td className=''>
        <div className='flex flex-col space-y-1'>
          <EditSuggestionItem
            coordinatorSuggestionItem={coordinatorSuggestionItem}
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
  coordinatorSuggestionItem: CoordinatorSuggestionItem;
}
function EditSuggestionItem({
  coordinatorSuggestionItem,
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
          `/api/coordinator_suggestion_item/${coordinatorSuggestionItem.id}`,
          values
        )
        .then(() => {
          alert("Suggestion updated successfully");
          router.reload();
        });
    },
  });

  useEffect(() => {
    if (!coordinatorSuggestionItem) return;
    formik.setValues({
      pageNumber: coordinatorSuggestionItem.pageNumber,
      remarks: coordinatorSuggestionItem?.remarks ?? "",
      suggestion: coordinatorSuggestionItem.suggestion,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinatorSuggestionItem]);

  return (
    <div>
      <button
        className='bg-palette_blue text-palette_white px-1 rounded text-sm w-full'
        onClick={() => setOpenEdit(true)}
      >
        Edit
      </button>
      {openEdit && (
        <Modal
          title='Edit Coordinator Suggestion Item'
          onClose={() => setOpenEdit(false)}
        >
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
                className='bg-palette_blue text-white rounded'
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
