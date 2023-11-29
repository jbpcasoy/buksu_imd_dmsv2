import { ReturnedCITLRevisionSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import { DateTime } from "luxon";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import Modal from "./Modal";
import { SnackbarContext } from "./SnackbarProvider";
import Confirmation from "./Confirmation";

export interface ReturnedCITLRevisionSuggestionItemProps {
  returnedCITLRevisionSuggestionItem: ReturnedCITLRevisionSuggestionItem;
}
export default function ReturnedCITLRevisionSuggestionItem({
  returnedCITLRevisionSuggestionItem,
}: ReturnedCITLRevisionSuggestionItemProps) {
  const router = useRouter();
  const { addSnackbar } = useContext(SnackbarContext);
  const [state, setState] = useState({
    openConfirmation: false,
  });
  const handleDelete = () => {
    axios
      .delete(
        `/api/returned_citl_revision_suggestion_item/${returnedCITLRevisionSuggestionItem.id}`
      )
      .then(() => {
        addSnackbar("Suggestion deleted successfully");
      })
      .catch((error) => {
        addSnackbar(
          error.response.data?.error?.message ?? "Failed to delete suggestion",
          "error"
        );
      })
      .finally(() => {
        router.reload();
      });
  };
  return (
    <tr className=''>
      <td className='w-1/4'>{returnedCITLRevisionSuggestionItem.suggestion}</td>
      <td className='text-center w-1/8'>
        {returnedCITLRevisionSuggestionItem.pageNumber}
      </td>
      <td className='w-1/4'>
        {returnedCITLRevisionSuggestionItem.actionTaken}
      </td>
      <td className='w-1/4'>{returnedCITLRevisionSuggestionItem.remarks}</td>
      <td className='w-1/8'>
        <div className='flex flex-col space-y-1'>
          <EditSuggestionItem
            returnedCITLRevisionSuggestionItem={
              returnedCITLRevisionSuggestionItem
            }
          />
          <>
            <button
              className='bg-palette_blue text-palette_white rounded py-1 text-sm flex justify-center hover:bg-opacity-90'
              onClick={() => {
                setState((prev) => ({ ...prev, openConfirmation: true }));
              }}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                height='1em'
                viewBox='0 0 448 512'
                className='fill-palette_white'
              >
                <path d='M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z' />
              </svg>
            </button>
            {state.openConfirmation && (
              <Confirmation
                onClose={() => {
                  setState((prev) => ({ ...prev, openConfirmation: false }));
                }}
                onConfirm={handleDelete}
              />
            )}
          </>
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
  const { addSnackbar } = useContext(SnackbarContext);
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
          addSnackbar("Suggestion updated successfully");
        })
        .catch((error) => {
          addSnackbar(
            error.response.data?.error?.message ??
              "Failed to update suggestion",
            "error"
          );
        })
        .finally(() => {
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
        className='bg-palette_blue text-palette_white px-1 rounded text-sm w-full py-1 flex justify-center hover:bg-opacity-90'
        onClick={() => setOpenEdit(true)}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          height='1em'
          viewBox='0 0 512 512'
          className='fill-palette_white'
        >
          <path d='M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z' />
        </svg>
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
              <button
                type='submit'
                className='bg-palette_blue text-white rounded inline-flex items-center justify-center py-1 space-x-2 hover:bg-opacity-90'
              >
                <span>Submit</span>
                <span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    height='1em'
                    viewBox='0 0 448 512'
                    className='fill-palette_white'
                  >
                    <path d='M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z' />
                  </svg>
                </span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
