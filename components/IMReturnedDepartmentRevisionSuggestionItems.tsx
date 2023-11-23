import useReturnedDepartmentRevisionSuggestionItemActionTakenReturnedDepartmentRevisionSuggestionItem from "@/hooks/useReturnedDepartmentRevisionSuggestionItemActionTakenReturnedDepartmentRevisionSuggestionItem";
import useReturnedDepartmentRevisionSuggestionItemsIM from "@/hooks/useReturnedDepartmentRevisionSuggestionItemsIM";
import { ReturnedDepartmentRevisionSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import { DateTime } from "luxon";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import Modal from "./Modal";

export interface IMReturnedDepartmentRevisionSuggestionItemsProps {
  id: string;
  editable?: boolean;
}

export default function IMReturnedDepartmentRevisionSuggestionItems({
  id,
  editable = true,
}: IMReturnedDepartmentRevisionSuggestionItemsProps) {
  const [state, setState] = useState({
    skip: 0,
    take: 999,
    id,
  });

  const returnedDepartmentRevisionSuggestionItems =
    useReturnedDepartmentRevisionSuggestionItemsIM(state);

  useEffect(() => {
    setState((prev) => ({ ...prev, id }));
  }, [id]);

  return (
    <div className='border border-palette_orange rounded'>
      <table className='text-sm w-full'>
        <caption className='text-left font-bold bg-palette_grey bg-opacity-10 p-2'>
          RETURNED DEPARTMENT REVISION SUGGESTIONS
        </caption>
        <thead className='bg-palette_grey bg-opacity-10 text-palette_grey'>
          <tr>
            <th className='font-normal pl-2'>SUGGESTION</th>
            <th className='font-normal'>PAGE NUMBER</th>
            <th className='font-normal'>ACTION TAKEN</th>
            <th className={`font-normal ${editable ? "" : "pr-2"}`}>REMARKS</th>
            {editable && <th className='font-normal pr-2'>ACTIONS</th>}
          </tr>
        </thead>
        <tbody className='text-palette_grey'>
          {returnedDepartmentRevisionSuggestionItems.returnedDepartmentRevisionSuggestionItems.map(
            (returnedDepartmentRevisionSuggestionItem) => {
              return (
                <Item
                  returnedDepartmentRevisionSuggestionItem={
                    returnedDepartmentRevisionSuggestionItem
                  }
                  editable={editable}
                  key={returnedDepartmentRevisionSuggestionItem.id}
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
  returnedDepartmentRevisionSuggestionItem,
  editable,
}: {
  returnedDepartmentRevisionSuggestionItem: ReturnedDepartmentRevisionSuggestionItem;
  editable: boolean;
}) {
  const returnedDepartmentRevisionSuggestionItemActionTaken =
    useReturnedDepartmentRevisionSuggestionItemActionTakenReturnedDepartmentRevisionSuggestionItem(
      {
        id: returnedDepartmentRevisionSuggestionItem.id,
      }
    );

  return (
    <tr className='border-t border-b last:border-b-0'>
      <td className={`pl-2 ${editable ? "w-1/4" : "w-3/10"}`}>
        {returnedDepartmentRevisionSuggestionItem.suggestion}
      </td>
      <td className={`text-center ${editable ? "w-1/8" : "w-1/10"}`}>
        {returnedDepartmentRevisionSuggestionItem.pageNumber}
      </td>
      <td className={`${editable ? "w-1/4" : "w-3/10"}`}>
        {returnedDepartmentRevisionSuggestionItemActionTaken?.value}
      </td>
      <td className={`${editable ? "w-1/4" : "w-3/10 pr-2"}`}>
        {returnedDepartmentRevisionSuggestionItem.remarks}
      </td>
      {editable && (
        <td className='w-1/8 pr-2'>
          <EditSuggestionItemActionTaken
            returnedDepartmentRevisionSuggestionItem={
              returnedDepartmentRevisionSuggestionItem
            }
          />
        </td>
      )}
    </tr>
  );
}

interface EditSuggestionItemActionTakenProps {
  returnedDepartmentRevisionSuggestionItem: ReturnedDepartmentRevisionSuggestionItem;
}
function EditSuggestionItemActionTaken({
  returnedDepartmentRevisionSuggestionItem,
}: EditSuggestionItemActionTakenProps) {
  const router = useRouter();
  const [openEditActionTaken, setOpenEditActionTaken] = useState(false);
  const returnedDepartmentRevisionSuggestionItemActionTaken =
    useReturnedDepartmentRevisionSuggestionItemActionTakenReturnedDepartmentRevisionSuggestionItem(
      {
        id: returnedDepartmentRevisionSuggestionItem.id,
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
      if (returnedDepartmentRevisionSuggestionItemActionTaken) {
        axios
          .put(
            `/api/returned_department_revision_suggestion_item_action_taken/${returnedDepartmentRevisionSuggestionItemActionTaken.id}`,
            values
          )
          .then(() => {
            alert("Suggestion updated successfully");
            router.reload();
          });
      } else {
        axios
          .post(
            `/api/returned_department_revision_suggestion_item_action_taken`,
            {
              returnedDepartmentRevisionSuggestionItemId:
                returnedDepartmentRevisionSuggestionItem.id,
              value: values.value,
            }
          )
          .then(() => {
            alert("Suggestion updated successfully");
            router.reload();
          });
      }
    },
  });

  useEffect(() => {
    if (!returnedDepartmentRevisionSuggestionItemActionTaken) return;
    formik.setValues({
      value: returnedDepartmentRevisionSuggestionItemActionTaken.value ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returnedDepartmentRevisionSuggestionItemActionTaken]);

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
                className='bg-palette_blue text-palette_white rounded py-1'
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
