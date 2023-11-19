import useIDDSpecialistSuggestionItemActionTakenIDDSpecialistSuggestionItem from "@/hooks/useIDDSpecialistSuggestionItemActionTakenIDDSpecialistSuggestionItem";
import useIDDSpecialistSuggestionItemsIM from "@/hooks/useIDDSpecialistSuggestionItemsIM";
import { IDDSpecialistSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import { DateTime } from "luxon";
import Link from "next/link";
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
    take: 10,
    id,
  });

  const iDDSpecialistSuggestionItems = useIDDSpecialistSuggestionItemsIM(state);

  useEffect(() => {
    setState((prev) => ({ ...prev, id }));
  }, [id]);

  const handleNext = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return {
        ...prev,
        skip:
          nextVal <= iDDSpecialistSuggestionItems.count ? nextVal : prev.skip,
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
        <caption>IDDSpecialist Suggestions</caption>
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
      <div className='flex justify-end space-x-1'>
        <p>
          {state.skip} - {state.skip + state.take} of{" "}
          {iDDSpecialistSuggestionItems.count}
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
      <td>
        {DateTime.fromJSDate(
          new Date(iDDSpecialistSuggestionItem.updatedAt)
        ).toRelative()}
      </td>
      <td>{iDDSpecialistSuggestionItem.suggestion}</td>
      <td className="text-center">{iDDSpecialistSuggestionItem.pageNumber}</td>
      <td>{iDDSpecialistSuggestionItemActionTaken?.value}</td>
      <td>{iDDSpecialistSuggestionItem.remarks}</td>
      {editable && (
        <td>
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
