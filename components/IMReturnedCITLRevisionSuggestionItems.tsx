import useReturnedCITLRevisionSuggestionItemActionTakenReturnedCITLRevisionSuggestionItem from "@/hooks/useReturnedCITLRevisionSuggestionItemActionTakenReturnedCITLRevisionSuggestionItem";
import useReturnedCITLRevisionSuggestionItemsIM from "@/hooks/useReturnedCITLRevisionSuggestionItemsIM";
import { ReturnedCITLRevisionSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import { DateTime } from "luxon";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import Modal from "./Modal";

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
    <div className='border border-palette_orange rounded'>
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
        {returnedCITLRevisionSuggestionItemActionTaken?.value}
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
            alert("Suggestion updated successfully");
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
            alert("Suggestion updated successfully");
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
        className='bg-palette_blue text-palette_white rounded px-1 text-sm w-full'
        onClick={() => setOpenEditActionTaken(true)}
      >
        Edit
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
