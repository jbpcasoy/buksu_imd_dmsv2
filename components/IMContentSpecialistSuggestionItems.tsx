import useContentSpecialistSuggestionItemActionTakenContentSpecialistSuggestionItem from "@/hooks/useContentSpecialistSuggestionItemActionTakenContentSpecialistSuggestionItem";
import useContentSpecialistSuggestionItemsIM from "@/hooks/useContentSpecialistSuggestionItemsIM";
import { ContentSpecialistSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import { DateTime } from "luxon";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import Modal from "./Modal";

export interface IMContentSpecialistSuggestionItemsProps {
  id: string;
  editable?: boolean;
}

export default function IMContentSpecialistSuggestionItems({
  id,
  editable = true,
}: IMContentSpecialistSuggestionItemsProps) {
  const [state, setState] = useState({
    skip: 0,
    take: 10,
    id,
  });

  const contentSpecialistSuggestionItems =
    useContentSpecialistSuggestionItemsIM(state);

  useEffect(() => {
    setState((prev) => ({ ...prev, id }));
  }, [id]);

  const handleNext = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return {
        ...prev,
        skip:
          nextVal <= contentSpecialistSuggestionItems.count
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
    <div className='border border-palette_orange rounded'>
      <table className='w-full text-sm'>
        <caption className='text-left font-bold bg-palette_grey bg-opacity-10 p-1'>
          CONTENT SPECIALIST SUGGESTIONS
        </caption>
        <thead className='bg-palette_grey bg-opacity-10 text-palette_grey'>
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
          {contentSpecialistSuggestionItems.contentSpecialistSuggestionItems.map(
            (contentSpecialistSuggestionItem) => {
              return (
                <Item
                  contentSpecialistSuggestionItem={
                    contentSpecialistSuggestionItem
                  }
                  editable={editable}
                  key={contentSpecialistSuggestionItem.id}
                />
              );
            }
          )}
        </tbody>
      </table>
      <div className='flex justify-end space-x-1 p-1'>
        <p>
          {state.skip} - {state.skip + state.take} of{" "}
          {contentSpecialistSuggestionItems.count}
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
  contentSpecialistSuggestionItem,
  editable,
}: {
  contentSpecialistSuggestionItem: ContentSpecialistSuggestionItem;
  editable: boolean;
}) {
  const contentSpecialistSuggestionItemActionTaken =
    useContentSpecialistSuggestionItemActionTakenContentSpecialistSuggestionItem(
      {
        id: contentSpecialistSuggestionItem.id,
      }
    );

  return (
    <tr>
      <td>
        {DateTime.fromJSDate(
          new Date(contentSpecialistSuggestionItem.updatedAt)
        ).toRelative()}
      </td>
      <td>{contentSpecialistSuggestionItem.suggestion}</td>
      <td className='text-center'>
        {contentSpecialistSuggestionItem.pageNumber}
      </td>
      <td>{contentSpecialistSuggestionItemActionTaken?.value}</td>
      <td>{contentSpecialistSuggestionItem.remarks}</td>
      {editable && (
        <td>
          <EditSuggestionItemActionTaken
            contentSpecialistSuggestionItem={contentSpecialistSuggestionItem}
          />
        </td>
      )}
    </tr>
  );
}

interface EditSuggestionItemActionTakenProps {
  contentSpecialistSuggestionItem: ContentSpecialistSuggestionItem;
}

function EditSuggestionItemActionTaken({
  contentSpecialistSuggestionItem,
}: EditSuggestionItemActionTakenProps) {
  const router = useRouter();
  const [openEdit, setOpenEdit] = useState(false);
  const contentSpecialistSuggestionItemActionTaken =
    useContentSpecialistSuggestionItemActionTakenContentSpecialistSuggestionItem(
      {
        id: contentSpecialistSuggestionItem.id as string,
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
      if (contentSpecialistSuggestionItemActionTaken) {
        axios
          .put(
            `/api/content_specialist_suggestion_item_action_taken/${contentSpecialistSuggestionItemActionTaken.id}`,
            values
          )
          .then(() => {
            alert("Suggestion updated successfully");
            router.reload();
          });
      } else {
        axios
          .post(`/api/content_specialist_suggestion_item_action_taken`, {
            contentSpecialistSuggestionItemId:
              contentSpecialistSuggestionItem.id,
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
    if (!contentSpecialistSuggestionItemActionTaken) return;
    formik.setValues({
      value: contentSpecialistSuggestionItemActionTaken.value ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentSpecialistSuggestionItemActionTaken]);

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
            <div className='flex  flex-col space-y-1'>
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
