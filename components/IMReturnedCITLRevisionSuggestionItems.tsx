import useReturnedCITLRevisionSuggestionItemActionTakenReturnedCITLRevisionSuggestionItem from "@/hooks/useReturnedCITLRevisionSuggestionItemActionTakenReturnedCITLRevisionSuggestionItem";
import useReturnedCITLRevisionSuggestionItemsIM from "@/hooks/useReturnedCITLRevisionSuggestionItemsIM";
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

export interface IMReturnedCITLRevisionSuggestionItemsProps {
  id: string;
  editable?: boolean;
}

export default function IMReturnedCITLRevisionSuggestionItems({
  id,
  editable = true,
}: IMReturnedCITLRevisionSuggestionItemsProps) {
  const [state, setState] = useState({
    skip: 0,
    take: 999,
    id,
  });

  const returnedCITLRevisionSuggestionItems =
    useReturnedCITLRevisionSuggestionItemsIM(state);

  useEffect(() => {
    setState((prev) => ({ ...prev, id }));
  }, [id]);

  return (
    <div className='border border-palette_orange rounded overflow-auto'>
      <table className='w-full text-sm'>
        <caption className='bg-palette_grey bg-opacity-10 text-left font-bold p-1'>
          RETURNED CITL REVISION SUGGESTIONS
        </caption>
        <thead className='bg-palette_grey bg-opacity-10 text-palette_grey'>
          <tr>
            <th className='font-normal'>SUGGESTION</th>
            <th className='font-normal'>PAGE NUMBER</th>
            <th className='font-normal'>ACTION TAKEN</th>
            <th className='font-normal'>REMARKS</th>
            {editable && <th className='font-normal'>ACTIONS</th>}
          </tr>
        </thead>
        <tbody className='text-palette_grey'>
          {returnedCITLRevisionSuggestionItems.returnedCITLRevisionSuggestionItems.map(
            (returnedCITLRevisionSuggestionItem) => {
              return (
                <Item
                  returnedCITLRevisionSuggestionItem={
                    returnedCITLRevisionSuggestionItem
                  }
                  editable={editable}
                  key={returnedCITLRevisionSuggestionItem.id}
                />
              );
            }
          )}
        </tbody>
      </table>
    </div>
  );
}

function Item({
  returnedCITLRevisionSuggestionItem,
  editable,
}: {
  returnedCITLRevisionSuggestionItem: ReturnedCITLRevisionSuggestionItem;
  editable: boolean;
}) {
  const returnedCITLRevisionSuggestionItemActionTaken =
    useReturnedCITLRevisionSuggestionItemActionTakenReturnedCITLRevisionSuggestionItem(
      {
        id: returnedCITLRevisionSuggestionItem.id,
      }
    );

  return (
    <tr className='border-t border-b last:border-b-0'>
      <td className={`pl-2 ${editable ? "w-1/4" : "w-3/10"}`}>
        {returnedCITLRevisionSuggestionItem.suggestion}
      </td>
      <td className={`text-center ${editable ? "w-1/8" : "w-1/10"}`}>
        {returnedCITLRevisionSuggestionItem.pageNumber}
      </td>
      <td className={`${editable ? "w-1/4" : "w-3/10"}`}>
        {returnedCITLRevisionSuggestionItemActionTaken?.value ?? (
          <>
            {editable && (
              <p className='text-palette_error text-xs'>Required *</p>
            )}
          </>
        )}
      </td>
      <td className={`${editable ? "w-1/4" : "w-3/10 pr-2"}`}>
        {returnedCITLRevisionSuggestionItem.remarks}
      </td>
      {editable && (
        <td className='w-1/8 pr-2'>
          <EditSuggestionItemActionTaken
            returnedCITLRevisionSuggestionItem={
              returnedCITLRevisionSuggestionItem
            }
          />
        </td>
      )}
    </tr>
  );
}

interface EditSuggestionItemActionTakenProps {
  returnedCITLRevisionSuggestionItem: ReturnedCITLRevisionSuggestionItem;
}
function EditSuggestionItemActionTaken({
  returnedCITLRevisionSuggestionItem,
}: EditSuggestionItemActionTakenProps) {
  const { addSnackbar } = useContext(SnackbarContext);
  const [openEditActionTaken, setOpenEditActionTaken] = useState(false);
  const router = useRouter();
  const returnedCITLRevisionSuggestionItemActionTaken =
    useReturnedCITLRevisionSuggestionItemActionTakenReturnedCITLRevisionSuggestionItem(
      {
        id: returnedCITLRevisionSuggestionItem.id as string,
      }
    );
  const formik = useFormik({
    initialValues: {
      value: "",
    },
    validationSchema: Yup.object({
      value: Yup.string().required(),
    }),
    onSubmit: (values) => {
      if (returnedCITLRevisionSuggestionItemActionTaken) {
        axios
          .put(
            `/api/returned_citl_revision_suggestion_item_action_taken/${returnedCITLRevisionSuggestionItemActionTaken.id}`,
            values
          )
          .then(() => {
            addSnackbar("Suggestion has been updated successfully");
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
      } else {
        axios
          .post(`/api/returned_citl_revision_suggestion_item_action_taken`, {
            returnedCITLRevisionSuggestionItemId:
              returnedCITLRevisionSuggestionItem.id,
            value: values.value,
          })
          .then(() => {
            addSnackbar("Suggestion has been updated successfully");
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
      }
    },
  });

  useEffect(() => {
    if (!returnedCITLRevisionSuggestionItemActionTaken) return;
    formik.setValues({
      value: returnedCITLRevisionSuggestionItemActionTaken.value ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returnedCITLRevisionSuggestionItemActionTaken]);

  return (
    <div>
      <button
        className='bg-palette_blue text-palette_white px-1 rounded text-sm w-full py-1 inline-flex justify-center hover:bg-opacity-90'
        onClick={() => setOpenEditActionTaken(true)}
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
      {openEditActionTaken && (
        <Modal
          title='Edit Action Taken'
          onClose={() => setOpenEditActionTaken(false)}
        >
          <form noValidate onSubmit={formik.handleSubmit}>
            <div className='flex flex-col space-y-1'>
              <textarea
                placeholder='Action Taken'
                {...formik.getFieldProps("value")}
                className='rounded'
              />
              <button
                type='submit'
                className='bg-palette_blue text-palette_white rounded px-2 py-1 flex items-center space-x-2 justify-center hover:bg-opacity-90'
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
