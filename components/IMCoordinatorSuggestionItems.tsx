import useCoordinatorSuggestionItemActionTakenCoordinatorSuggestionItem from "@/hooks/useCoordinatorSuggestionItemActionTakenCoordinatorSuggestionItem";
import useCoordinatorSuggestionItemsIM from "@/hooks/useCoordinatorSuggestionItemsIM";
import { CoordinatorSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import { DateTime } from "luxon";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CoordinatorSuggestionItemProps } from "./CoordinatorSuggestionItem";
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
    take: 10,
    id,
  });

  const coordinatorSuggestionItems = useCoordinatorSuggestionItemsIM(state);

  useEffect(() => {
    setState((prev) => ({ ...prev, id }));
  }, [id]);

  const handleNext = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return {
        ...prev,
        skip: nextVal <= coordinatorSuggestionItems.count ? nextVal : prev.skip,
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
        <caption className='text-xs'>Coordinator Suggestions</caption>
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
      <div className='flex justify-end space-x-1 text-sm'>
        <p>
          {state.skip} - {state.skip + state.take} of{" "}
          {coordinatorSuggestionItems.count}
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
      <td>
        {DateTime.fromJSDate(
          new Date(coordinatorSuggestionItem.updatedAt)
        ).toRelative()}
      </td>
      <td>{coordinatorSuggestionItem.suggestion}</td>
      <td className='text-center'>{coordinatorSuggestionItem.pageNumber}</td>
      <td>{coordinatorSuggestionItemActionTaken?.value}</td>
      <td>{coordinatorSuggestionItem.remarks}</td>
      {editable && (
        <td>
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
          title='Coordinator Review'
          onClose={() => setOpenEditActionTaken(false)}
        >
          <form noValidate onSubmit={formik.handleSubmit}>
            <div className='flex flex-col'>
              <textarea
                placeholder='value'
                {...formik.getFieldProps("value")}
              />
              <input
                type='submit'
                value='Submit'
                className='bg-palette_blue text-palette_white rounded'
              />
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
