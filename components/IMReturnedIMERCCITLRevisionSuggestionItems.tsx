import useReturnedIMERCCITLRevisionSuggestionItemActionTakenReturnedIMERCCITLRevisionSuggestionItem from "@/hooks/useReturnedIMERCCITLRevisionSuggestionItemActionTakenReturnedIMERCCITLRevisionSuggestionItem";
import useReturnedIMERCCITLRevisionSuggestionItemsIM from "@/hooks/useReturnedIMERCCITLRevisionSuggestionItemsIM";
import { ReturnedIMERCCITLRevisionSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import { DateTime } from "luxon";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import Modal from "./Modal";

export interface IMReturnedIMERCCITLRevisionSuggestionItemsProps {
  id: string;
  editable?: boolean;
}

export default function IMReturnedIMERCCITLRevisionSuggestionItems({
  id,
  editable = true,
}: IMReturnedIMERCCITLRevisionSuggestionItemsProps) {
  const [state, setState] = useState({
    skip: 0,
    take: 10,
    id,
  });

  const returnedIMERCCITLRevisionSuggestionItems =
    useReturnedIMERCCITLRevisionSuggestionItemsIM(state);

  useEffect(() => {
    setState((prev) => ({ ...prev, id }));
  }, [id]);

  const handleNext = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return {
        ...prev,
        skip:
          nextVal <= returnedIMERCCITLRevisionSuggestionItems.count
            ? nextVal
            : prev.skip,
      };
    });
  };

  const handlePrev = () => {
    setState((prev) => {
      const nextVal = prev.skip - prev.take;
      return { ...prev, skip: nextVal >= 0 ? nextVal : prev.skip };
    });
  };

  return (
    <div>
      <table className='w-full text-sm'>
        <caption>ReturnedIMERCCITLRevision Suggestions</caption>
        <thead>
          <tr>
            <th>LAST ACTIVITY</th>
            <th>SUGGESTION</th>
            <th>PAGE NUMBER</th>
            <th>ACTION TAKEN</th>
            <th>REMARKS</th>
            {editable && <th>ACTIONS</th>}
          </tr>
        </thead>
        <tbody>
          {returnedIMERCCITLRevisionSuggestionItems.returnedIMERCCITLRevisionSuggestionItems.map(
            (returnedIMERCCITLRevisionSuggestionItem) => {
              return (
                <Item
                  returnedIMERCCITLRevisionSuggestionItem={
                    returnedIMERCCITLRevisionSuggestionItem
                  }
                  editable={editable}
                  key={returnedIMERCCITLRevisionSuggestionItem.id}
                />
              );
            }
          )}
        </tbody>
      </table>
      <div className='flex justify-end space-x-1'>
        <p>
          {state.skip} - {state.skip + state.take} of{" "}
          {returnedIMERCCITLRevisionSuggestionItems.count}
        </p>
        <button className='border rounded' onClick={handlePrev}>
          prev
        </button>
        <button className='border rounded' onClick={handleNext}>
          next
        </button>
      </div>
    </div>
  );
}

function Item({
  returnedIMERCCITLRevisionSuggestionItem,
  editable,
}: {
  returnedIMERCCITLRevisionSuggestionItem: ReturnedIMERCCITLRevisionSuggestionItem;
  editable: boolean;
}) {
  const returnedIMERCCITLRevisionSuggestionItemActionTaken =
    useReturnedIMERCCITLRevisionSuggestionItemActionTakenReturnedIMERCCITLRevisionSuggestionItem(
      {
        id: returnedIMERCCITLRevisionSuggestionItem.id,
      }
    );

  return (
    <tr>
      <td>
        {DateTime.fromJSDate(
          new Date(returnedIMERCCITLRevisionSuggestionItem.updatedAt)
        ).toRelative()}
      </td>
      <td>{returnedIMERCCITLRevisionSuggestionItem.suggestion}</td>
      <td className='text-center'>
        {returnedIMERCCITLRevisionSuggestionItem.pageNumber}
      </td>
      <td>{returnedIMERCCITLRevisionSuggestionItemActionTaken?.value}</td>
      <td>{returnedIMERCCITLRevisionSuggestionItem.remarks}</td>
      {editable && (
        <td>
          <EditSuggestionItemActionTaken
            returnedIMERCCITLRevisionSuggestionItem={
              returnedIMERCCITLRevisionSuggestionItem
            }
          />
        </td>
      )}
    </tr>
  );
}

interface EditSuggestionItemActionTakenProps {
  returnedIMERCCITLRevisionSuggestionItem: ReturnedIMERCCITLRevisionSuggestionItem;
}

function EditSuggestionItemActionTaken({
  returnedIMERCCITLRevisionSuggestionItem,
}: EditSuggestionItemActionTakenProps) {
  const router = useRouter();
  const [openEdit, setOpenEdit] = useState(false);
  const returnedIMERCCITLRevisionSuggestionItemActionTaken =
    useReturnedIMERCCITLRevisionSuggestionItemActionTakenReturnedIMERCCITLRevisionSuggestionItem(
      {
        id: returnedIMERCCITLRevisionSuggestionItem.id as string,
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
      if (returnedIMERCCITLRevisionSuggestionItemActionTaken) {
        axios
          .put(
            `/api/returned_imerc_citl_revision_suggestion_item_action_taken/${returnedIMERCCITLRevisionSuggestionItemActionTaken.id}`,
            values
          )
          .then(() => {
            alert("Suggestion updated successfully");
            router.reload();
          });
      } else {
        axios
          .post(
            `/api/returned_imerc_citl_revision_suggestion_item_action_taken`,
            {
              returnedIMERCCITLRevisionSuggestionItemId:
                returnedIMERCCITLRevisionSuggestionItem.id,
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
    if (!returnedIMERCCITLRevisionSuggestionItemActionTaken) return;
    formik.setValues({
      value: returnedIMERCCITLRevisionSuggestionItemActionTaken.value ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returnedIMERCCITLRevisionSuggestionItemActionTaken]);

  return (
    <div>
      <button
        className='bg-palette_blue text-palette_white rounded w-full'
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
                className='bg-palette_blue text-palette_white py-1 rounded'
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
