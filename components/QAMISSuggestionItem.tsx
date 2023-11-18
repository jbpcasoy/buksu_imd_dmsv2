import { QAMISSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import { DateTime } from "luxon";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import Modal from "./Modal";

export interface QAMISSuggestionItemProps {
  qAMISSuggestionItem: QAMISSuggestionItem;
}
export default function QAMISSuggestionItem({
  qAMISSuggestionItem,
}: QAMISSuggestionItemProps) {
  const router = useRouter();
  const handleDelete = () => {
    if (confirm("Are you sure? This action cannot be undone.")) {
      axios
        .delete(`/api/qamis_suggestion_item/${qAMISSuggestionItem.id}`)
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
          new Date(qAMISSuggestionItem.updatedAt)
        ).toRelative()}
      </td>
      <td>{qAMISSuggestionItem.suggestion}</td>
      <td>{qAMISSuggestionItem.pageNumber}</td>
      <td>{qAMISSuggestionItem.actionTaken}</td>
      <td className='text-center'>{qAMISSuggestionItem.remarks}</td>
      <td>{qAMISSuggestionItem.qAMISSuggestionId}</td>
      <td className=''>
        <div className='flex flex-col space-y-1'>
          <EditSuggestionItem qAMISSuggestionItem={qAMISSuggestionItem} />
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
  qAMISSuggestionItem: QAMISSuggestionItem;
}
function EditSuggestionItem({ qAMISSuggestionItem }: EditSuggestionItemProps) {
  const router = useRouter();
  const [openEdit, setOpenEdit] = useState(false);
  const formik = useFormik({
    initialValues: {
      suggestion: "",
      actionTaken: "",
      pageNumber: 0,
      remarks: "",
    },
    validationSchema: Yup.object({
      suggestion: Yup.string().required(),
      actionTaken: Yup.string().required(),
      pageNumber: Yup.number().min(0).required(),
      remarks: Yup.string(),
    }),
    onSubmit: (values) => {
      axios
        .put(`/api/qamis_suggestion_item/${qAMISSuggestionItem.id}`, values)
        .then(() => {
          alert("Suggestion updated successfully");
          router.reload();
        });
    },
  });

  useEffect(() => {
    if (!qAMISSuggestionItem) return;
    formik.setValues({
      pageNumber: qAMISSuggestionItem.pageNumber,
      actionTaken: qAMISSuggestionItem.actionTaken ?? "",
      remarks: qAMISSuggestionItem?.remarks ?? "",
      suggestion: qAMISSuggestionItem.suggestion,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qAMISSuggestionItem]);

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
              <textarea
                placeholder='actionTaken'
                {...formik.getFieldProps("actionTaken")}
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
