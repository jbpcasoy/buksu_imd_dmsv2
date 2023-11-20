import useIDDCoordinatorSuggestionItemActionTakenIDDCoordinatorSuggestionItem from "@/hooks/useIDDCoordinatorSuggestionItemActionTakenIDDCoordinatorSuggestionItem";
import useIDDCoordinatorSuggestionItemsIM from "@/hooks/useIDDCoordinatorSuggestionItemsIM";
import { IDDCoordinatorSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import { DateTime } from "luxon";
import Link from "next/link";
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
    take: 10,
    id,
  });

  const iDDCoordinatorSuggestionItems =
    useIDDCoordinatorSuggestionItemsIM(state);

  useEffect(() => {
    setState((prev) => ({ ...prev, id }));
  }, [id]);

  const handleNext = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return {
        ...prev,
        skip:
          nextVal <= iDDCoordinatorSuggestionItems.count ? nextVal : prev.skip,
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
    <div className='border border-palette_orange rounded'>
      <table className='text-sm w-full'>
        <caption className='text-left font-bold bg-palette_grey bg-opacity-10 p-1'>
          IDD COORDINATOR SUGGESTIONS
        </caption>
        <thead className='bg-palette_grey bg-opacity-10 p-1 text-palette_grey'>
          <tr>
            <th className='font-normal'>LAST ACTIVITY</th>
            <th className='font-normal'>SUGGESTION</th>
            <th className='font-normal'>PAGE NUMBER</th>
            <th className='font-normal'>ACTION TAKEN</th>
            <th className='font-normal'>REMARKS</th>
            {editable && <th className='font-normal'>ACTIONS</th>}
          </tr>
        </thead>
        <tbody className="text-palette_grey">
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
      <div className='flex justify-end space-x-1 p-1'>
        <p>
          {state.skip} - {state.skip + state.take} of{" "}
          {iDDCoordinatorSuggestionItems.count}
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
      <td>
        {DateTime.fromJSDate(
          new Date(iDDCoordinatorSuggestionItem.updatedAt)
        ).toRelative()}
      </td>
      <td>{iDDCoordinatorSuggestionItem.suggestion}</td>
      <td className='text-center'>{iDDCoordinatorSuggestionItem.pageNumber}</td>
      <td>{iDDCoordinatorSuggestionItemActionTaken?.value}</td>
      <td>{iDDCoordinatorSuggestionItem.remarks}</td>
      {editable && (
        <td>
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
