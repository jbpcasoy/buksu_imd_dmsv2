import useIDDCoordinatorSuggestionItemActionTakenIDDCoordinatorSuggestionItem from "@/hooks/useIDDCoordinatorSuggestionItemActionTakenIDDCoordinatorSuggestionItem";
import useIDDCoordinatorSuggestionItemsIM from "@/hooks/useIDDCoordinatorSuggestionItemsIM";
import { IDDCoordinatorSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import { DateTime } from "luxon";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import Modal from "./Modal";

export interface IMIDDCoordinatorSuggestionItemsProps {
  id: string;
  editable?: boolean;
}

export default function IMIDDCoordinatorSuggestionItems({
  id,
  editable = true,
}: IMIDDCoordinatorSuggestionItemsProps) {
  const [state, setState] = useState({
    skip: 0,
    take: 999,
    id,
  });

  const iDDCoordinatorSuggestionItems =
    useIDDCoordinatorSuggestionItemsIM(state);

  useEffect(() => {
    setState((prev) => ({ ...prev, id }));
  }, [id]);

  return (
    <div className='border border-palette_orange rounded'>
      <table className='text-sm w-full'>
        <caption className='text-left font-bold bg-palette_grey bg-opacity-10 p-2'>
          IDD COORDINATOR SUGGESTIONS
        </caption>
        <thead className='bg-palette_grey bg-opacity-10 p-1 text-palette_grey'>
          <tr>
            <th className='font-normal pl-2'>SUGGESTION</th>
            <th className='font-normal'>PAGE NUMBER</th>
            <th className='font-normal'>ACTION TAKEN</th>
            <th className={`font-normal ${editable ? "" : "pr-2"}`}>REMARKS</th>
            {editable && <th className='font-normal pr-2'>ACTIONS</th>}
          </tr>
        </thead>
        <tbody className='text-palette_grey'>
          {iDDCoordinatorSuggestionItems.iDDCoordinatorSuggestionItems.map(
            (iDDCoordinatorSuggestionItem) => {
              return (
                <Item
                  iDDCoordinatorSuggestionItem={iDDCoordinatorSuggestionItem}
                  editable={editable}
                  key={iDDCoordinatorSuggestionItem.id}
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
  iDDCoordinatorSuggestionItem,
  editable,
}: {
  iDDCoordinatorSuggestionItem: IDDCoordinatorSuggestionItem;
  editable: boolean;
}) {
  const iDDCoordinatorSuggestionItemActionTaken =
    useIDDCoordinatorSuggestionItemActionTakenIDDCoordinatorSuggestionItem({
      id: iDDCoordinatorSuggestionItem.id,
    });

  return (
    <tr>
      <td className={`pl-2 ${editable ? "w-1/4" : "w-3/10"}`}>
        {iDDCoordinatorSuggestionItem.suggestion}
      </td>
      <td className={`text-center ${editable ? "w-1/8" : "w-1/10"}`}>
        {iDDCoordinatorSuggestionItem.pageNumber}
      </td>
      <td className={`${editable ? "w-1/4" : "w-3/10"}`}>
        {iDDCoordinatorSuggestionItemActionTaken?.value}
      </td>
      <td className={`${editable ? "w-1/4" : "w-3/10 pr-2"}`}>
        {iDDCoordinatorSuggestionItem.remarks}
      </td>
      {editable && (
        <td className='w-1/8 pr-2'>
          <EditSuggestionItemActionTaken
            iDDCoordinatorSuggestionItem={iDDCoordinatorSuggestionItem}
          />
        </td>
      )}
    </tr>
  );
}

interface EditSuggestionItemActionTakenProps {
  iDDCoordinatorSuggestionItem: IDDCoordinatorSuggestionItem;
}
function EditSuggestionItemActionTaken({
  iDDCoordinatorSuggestionItem,
}: EditSuggestionItemActionTakenProps) {
  const router = useRouter();
  const [openEditActionTaken, setOpenEditActionTaken] = useState(false);
  const iDDCoordinatorSuggestionItemActionTaken =
    useIDDCoordinatorSuggestionItemActionTakenIDDCoordinatorSuggestionItem({
      id: iDDCoordinatorSuggestionItem.id,
    });
  const formik = useFormik({
    initialValues: {
      value: "",
    },
    validationSchema: Yup.object({
      value: Yup.string().required(),
    }),
    onSubmit: (values) => {
      if (iDDCoordinatorSuggestionItemActionTaken) {
        axios
          .put(
            `/api/idd_coordinator_suggestion_item_action_taken/${iDDCoordinatorSuggestionItemActionTaken.id}`,
            values
          )
          .then(() => {
            alert("Suggestion updated successfully");
            router.reload();
          });
      } else {
        axios
          .post(`/api/idd_coordinator_suggestion_item_action_taken`, {
            iDDCoordinatorSuggestionItemId: iDDCoordinatorSuggestionItem.id,
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
    if (!iDDCoordinatorSuggestionItemActionTaken) return;
    formik.setValues({
      value: iDDCoordinatorSuggestionItemActionTaken.value ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iDDCoordinatorSuggestionItemActionTaken]);

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
                className='bg-palette_blue text-palette_white px-2 py-1 rounded'
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
