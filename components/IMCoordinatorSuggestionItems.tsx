import useCoordinatorSuggestionItemActionTakenCoordinatorSuggestionItem from "@/hooks/useCoordinatorSuggestionItemActionTakenCoordinatorSuggestionItem";
import useCoordinatorSuggestionItemsIM from "@/hooks/useCoordinatorSuggestionItemsIM";
import { CoordinatorSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import { DateTime } from "luxon";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import Modal from "./Modal";

export interface IMCoordinatorSuggestionItemsProps {
  id: string;
  editable?: boolean;
}

export default function IMCoordinatorSuggestionItems({
  id,
  editable = true,
}: IMCoordinatorSuggestionItemsProps) {
  const [state, setState] = useState({
    skip: 0,
    take: 999,
    id,
  });

  const coordinatorSuggestionItems = useCoordinatorSuggestionItemsIM(state);

  useEffect(() => {
    setState((prev) => ({ ...prev, id }));
  }, [id]);

  return (
    <div className='border border-palette_orange rounded'>
      <table className='text-sm w-full'>
        <caption className='text-left font-bold bg-palette_grey bg-opacity-10 p-2'>
          COORDINATOR SUGGESTIONS
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
          {coordinatorSuggestionItems.coordinatorSuggestionItems.map(
            (coordinatorSuggestionItem) => {
              return (
                <Item
                  coordinatorSuggestionItem={coordinatorSuggestionItem}
                  editable={editable}
                  key={coordinatorSuggestionItem.id}
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
  coordinatorSuggestionItem,
  editable,
}: {
  coordinatorSuggestionItem: CoordinatorSuggestionItem;
  editable: boolean;
}) {
  const coordinatorSuggestionItemActionTaken =
    useCoordinatorSuggestionItemActionTakenCoordinatorSuggestionItem({
      id: coordinatorSuggestionItem.id,
    });

  return (
    <tr>
      <td className={`pl-2 ${editable ? "w-1/4" : "w-3/10"}`}>
        {coordinatorSuggestionItem.suggestion}
      </td>
      <td className={`text-center ${editable ? "w-1/8" : "w-1/10"}`}>
        {coordinatorSuggestionItem.pageNumber}
      </td>
      <td className={`${editable ? "w-1/4" : "w-3/10"}`}>
        {coordinatorSuggestionItemActionTaken?.value}
      </td>
      <td className={`${editable ? "w-1/4" : "w-3/10 pr-2"}`}>
        {coordinatorSuggestionItem.remarks}
      </td>
      {editable && (
        <td className='w-1/8 pr-2'>
          <EditSuggestionItemActionTaken
            coordinatorSuggestionItem={coordinatorSuggestionItem}
          />
        </td>
      )}
    </tr>
  );
}

interface EditSuggestionItemActionTakenProps {
  coordinatorSuggestionItem: CoordinatorSuggestionItem;
}
function EditSuggestionItemActionTaken({
  coordinatorSuggestionItem,
}: EditSuggestionItemActionTakenProps) {
  const router = useRouter();
  const [openEditActionTaken, setOpenEditActionTaken] = useState(false);
  const coordinatorSuggestionItemActionTaken =
    useCoordinatorSuggestionItemActionTakenCoordinatorSuggestionItem({
      id: coordinatorSuggestionItem.id,
    });
  const formik = useFormik({
    initialValues: {
      value: "",
    },
    validationSchema: Yup.object({
      value: Yup.string().required(),
    }),
    onSubmit: (values) => {
      if (coordinatorSuggestionItemActionTaken) {
        axios
          .put(
            `/api/coordinator_suggestion_item_action_taken/${coordinatorSuggestionItemActionTaken.id}`,
            values
          )
          .then(() => {
            alert("Suggestion updated successfully");
            router.reload();
          });
      } else {
        axios
          .post(`/api/coordinator_suggestion_item_action_taken`, {
            coordinatorSuggestionItemId: coordinatorSuggestionItem.id,
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
    if (!coordinatorSuggestionItemActionTaken) return;
    formik.setValues({
      value: coordinatorSuggestionItemActionTaken.value ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinatorSuggestionItemActionTaken]);

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
