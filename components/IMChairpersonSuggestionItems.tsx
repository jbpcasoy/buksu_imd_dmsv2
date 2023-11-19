import useChairpersonSuggestionItemActionTakenChairpersonSuggestionItem from "@/hooks/useChairpersonSuggestionItemActionTakenChairpersonSuggestionItem";
import useChairpersonSuggestionItemsIM from "@/hooks/useChairpersonSuggestionItemsIM";
import { ChairpersonSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import { DateTime } from "luxon";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import Modal from "./Modal";

export interface IMChairpersonSuggestionItemsProps {
  id: string;
  editable?: boolean;
}

export default function IMChairpersonSuggestionItems({
  id,
  editable = true,
}: IMChairpersonSuggestionItemsProps) {
  const [state, setState] = useState({
    skip: 0,
    take: 10,
    id,
  });

  const chairpersonSuggestionItems = useChairpersonSuggestionItemsIM(state);

  useEffect(() => {
    setState((prev) => ({ ...prev, id }));
  }, [id]);

  const handleNext = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return {
        ...prev,
        skip: nextVal <= chairpersonSuggestionItems.count ? nextVal : prev.skip,
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
        <caption className='text-xs'>CHAIRPERSON SUGGESTIONS</caption>
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
          {chairpersonSuggestionItems.chairpersonSuggestionItems.map(
            (chairpersonSuggestionItem) => {
              return (
                <Item
                  chairpersonSuggestionItem={chairpersonSuggestionItem}
                  editable={editable}
                  key={chairpersonSuggestionItem.id}
                />
              );
            }
          )}
        </tbody>
      </table>
      <div className='flex justify-end space-x-1 text-sm'>
        <p>
          {state.skip} - {state.skip + state.take} of{" "}
          {chairpersonSuggestionItems.count}
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
  chairpersonSuggestionItem,
  editable,
}: {
  chairpersonSuggestionItem: ChairpersonSuggestionItem;
  editable: boolean;
}) {
  const chairpersonSuggestionItemActionTaken =
    useChairpersonSuggestionItemActionTakenChairpersonSuggestionItem({
      id: chairpersonSuggestionItem.id,
    });

  return (
    <tr>
      <td>
        {DateTime.fromJSDate(
          new Date(chairpersonSuggestionItem.updatedAt)
        ).toRelative()}
      </td>
      <td>{chairpersonSuggestionItem.suggestion}</td>
      <td className="text-center">{chairpersonSuggestionItem.pageNumber}</td>
      <td>{chairpersonSuggestionItemActionTaken?.value}</td>
      <td>{chairpersonSuggestionItem.remarks}</td>
      {editable && (
        <td>
          <EditSuggestionItemActionTaken
            chairpersonSuggestionItem={chairpersonSuggestionItem}
          />
        </td>
      )}
    </tr>
  );
}

interface EditSuggestionItemActionTakenProps {
  chairpersonSuggestionItem: ChairpersonSuggestionItem;
}
function EditSuggestionItemActionTaken({
  chairpersonSuggestionItem,
}: EditSuggestionItemActionTakenProps) {
  const router = useRouter();
  const [openEditActionTaken, setOpenEditActionTaken] = useState(false);
  const chairpersonSuggestionItemActionTaken =
    useChairpersonSuggestionItemActionTakenChairpersonSuggestionItem({
      id: chairpersonSuggestionItem.id,
    });
  const formik = useFormik({
    initialValues: {
      value: "",
    },
    validationSchema: Yup.object({
      value: Yup.string().required(),
    }),
    onSubmit: (values) => {
      if (chairpersonSuggestionItemActionTaken) {
        axios
          .put(
            `/api/chairperson_suggestion_item_action_taken/${chairpersonSuggestionItemActionTaken.id}`,
            values
          )
          .then(() => {
            alert("Suggestion updated successfully");
            router.reload();
          });
      } else {
        axios
          .post(`/api/chairperson_suggestion_item_action_taken`, {
            chairpersonSuggestionItemId: chairpersonSuggestionItem.id,
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
    if (!chairpersonSuggestionItemActionTaken) return;
    formik.setValues({
      value: chairpersonSuggestionItemActionTaken.value ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chairpersonSuggestionItemActionTaken]);

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
            <div className="flex flex-col space-y-1">
              <textarea
                placeholder='Action Taken'
                {...formik.getFieldProps("value")}
                className="rounded"
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
