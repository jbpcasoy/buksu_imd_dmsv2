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
    take: 10,
    id,
  });

  const returnedDepartmentRevisionSuggestionItems =
    useReturnedDepartmentRevisionSuggestionItemsIM(state);

  useEffect(() => {
    setState((prev) => ({ ...prev, id }));
  }, [id]);

  const handleNext = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return {
        ...prev,
        skip:
          nextVal <= returnedDepartmentRevisionSuggestionItems.count
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
      <table className='text-sm w-full'>
        <caption className='text-xs'>
          RETURNED DEPARTMENT REVISION SUGGESTIONS
        </caption>
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
      <div className='flex justify-end space-x-1 text-sm'>
        <p>
          {state.skip} - {state.skip + state.take} of{" "}
          {returnedDepartmentRevisionSuggestionItems.count}
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
    <tr>
      <td>
        {DateTime.fromJSDate(
          new Date(returnedDepartmentRevisionSuggestionItem.updatedAt)
        ).toRelative()}
      </td>
      <td>{returnedDepartmentRevisionSuggestionItem.suggestion}</td>
      <td className='text-center'>
        {returnedDepartmentRevisionSuggestionItem.pageNumber}
      </td>
      <td>{returnedDepartmentRevisionSuggestionItemActionTaken?.value}</td>
      <td>{returnedDepartmentRevisionSuggestionItem.remarks}</td>
      {editable && (
        <td>
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
