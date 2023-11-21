import useIDDSpecialistSuggestionItemActionTakenIDDSpecialistSuggestionItem from "@/hooks/useIDDSpecialistSuggestionItemActionTakenIDDSpecialistSuggestionItem";
import useIDDSpecialistSuggestionItemsIM from "@/hooks/useIDDSpecialistSuggestionItemsIM";
import { IDDSpecialistSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import { DateTime } from "luxon";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import Modal from "./Modal";

export interface IMIDDSpecialistSuggestionItemsProps {
  id: string;
  editable?: boolean;
}

export default function IMIDDSpecialistSuggestionItems({
  id,
  editable = true,
}: IMIDDSpecialistSuggestionItemsProps) {
  const [state, setState] = useState({
    skip: 0,
    take: 999,
    id,
  });

  const iDDSpecialistSuggestionItems = useIDDSpecialistSuggestionItemsIM(state);

  useEffect(() => {
    setState((prev) => ({ ...prev, id }));
  }, [id]);

  return (
    <div className='border border-palette_orange rounded'>
      <table className='w-full text-sm'>
        <caption className='text-left font-bold bg-palette_grey bg-opacity-10 p-2'>
          IDD SPECIALIST SUGGESTIONS
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
          {iDDSpecialistSuggestionItems.iDDSpecialistSuggestionItems.map(
            (iDDSpecialistSuggestionItem) => {
              return (
                <Item
                  iDDSpecialistSuggestionItem={iDDSpecialistSuggestionItem}
                  editable={editable}
                  key={iDDSpecialistSuggestionItem.id}
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
  iDDSpecialistSuggestionItem,
  editable,
}: {
  iDDSpecialistSuggestionItem: IDDSpecialistSuggestionItem;
  editable: boolean;
}) {
  const iDDSpecialistSuggestionItemActionTaken =
    useIDDSpecialistSuggestionItemActionTakenIDDSpecialistSuggestionItem({
      id: iDDSpecialistSuggestionItem.id,
    });

  return (
    <tr>
      <td className={`pl-2 ${editable ? "w-1/4" : "w-3/10"}`}>
        {iDDSpecialistSuggestionItem.suggestion}
      </td>
      <td className={`text-center ${editable ? "w-1/8" : "w-1/10"}`}>
        {iDDSpecialistSuggestionItem.pageNumber}
      </td>
      <td className={`${editable ? "w-1/4" : "w-3/10"}`}>
        {iDDSpecialistSuggestionItemActionTaken?.value}
      </td>
      <td className={`${editable ? "w-1/4" : "w-3/10 pr-2"}`}>
        {iDDSpecialistSuggestionItem.remarks}
      </td>
      {editable && (
        <td className='w-1/8 pr-2'>
          <EditSuggestionItemActionTaken
            iDDSpecialistSuggestionItem={iDDSpecialistSuggestionItem}
          />
        </td>
      )}
    </tr>
  );
}

interface EditSuggestionItemActionTakenProps {
  iDDSpecialistSuggestionItem: IDDSpecialistSuggestionItem;
}

function EditSuggestionItemActionTaken({
  iDDSpecialistSuggestionItem,
}: EditSuggestionItemActionTakenProps) {
  const [openEdit, setOpenEdit] = useState(false);
  const router = useRouter();
  const iDDSpecialistSuggestionItemActionTaken =
    useIDDSpecialistSuggestionItemActionTakenIDDSpecialistSuggestionItem({
      id: iDDSpecialistSuggestionItem.id as string,
    });
  const formik = useFormik({
    initialValues: {
      value: "",
    },
    validationSchema: Yup.object({
      value: Yup.string().required(),
    }),
    onSubmit: (values) => {
      if (iDDSpecialistSuggestionItemActionTaken) {
        axios
          .put(
            `/api/idd_specialist_suggestion_item_action_taken/${iDDSpecialistSuggestionItemActionTaken.id}`,
            values
          )
          .then(() => {
            alert("Suggestion updated successfully");
            router.reload();
          });
      } else {
        axios
          .post(`/api/idd_specialist_suggestion_item_action_taken`, {
            iDDSpecialistSuggestionItemId: iDDSpecialistSuggestionItem.id,
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
    if (!iDDSpecialistSuggestionItemActionTaken) return;
    formik.setValues({
      value: iDDSpecialistSuggestionItemActionTaken.value ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iDDSpecialistSuggestionItemActionTaken]);

  return (
    <div>
      <button
        className='w-full bg-palette_blue text-palette_white rounded'
        onClick={() => setOpenEdit(true)}
      >
        Edit
      </button>

      {openEdit && (
        <Modal title='Edit Action Taken' onClose={() => setOpenEdit(false)}>
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
                className='rounded bg-palette_blue text-palette_white py-1'
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
