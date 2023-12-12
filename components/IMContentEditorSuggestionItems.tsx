import useContentEditorSuggestionItemActionTakenContentEditorSuggestionItem from "@/hooks/useContentEditorSuggestionItemActionTakenContentEditorSuggestionItem";
import useContentEditorSuggestionItemsIM from "@/hooks/useContentEditorSuggestionItemsIM";
import { ContentEditorSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import Modal from "./Modal";
import { SnackbarContext } from "./SnackbarProvider";
import useSubmittedContentEditorSuggestionIM from "@/hooks/useSubmittedContentEditorSuggestionIM";
import useContentEditorSuggestion from "@/hooks/useContentEditorSuggestion";
import useContentEditorReview from "@/hooks/useContentEditorReview";
import useCITLDirector from "@/hooks/useCITLDirector";
import useUser from "@/hooks/useUser";
import { DateTime } from "luxon";

export interface IMContentEditorSuggestionItemsProps {
  id: string;
  editable?: boolean;
}

export default function IMContentEditorSuggestionItems({
  id,
  editable = true,
}: IMContentEditorSuggestionItemsProps) {
  const [state, setState] = useState({
    skip: 0,
    take: 999,
    id,
  });

  const contentEditorSuggestionItems = useContentEditorSuggestionItemsIM(state);
  const submittedContentEditorSuggestion =
    useSubmittedContentEditorSuggestionIM({
      id,
    });
  const contentEditorSuggestion = useContentEditorSuggestion({
    id: submittedContentEditorSuggestion?.contentEditorSuggestionId,
  });
  const contentEditorReview = useContentEditorReview({
    id: contentEditorSuggestion?.contentEditorReviewId,
  });
  const cITLDirector = useCITLDirector({
    id: contentEditorReview?.cITLDirectorId,
  });
  const user = useUser({
    id: cITLDirector?.userId,
  });

  useEffect(() => {
    setState((prev) => ({ ...prev, id }));
  }, [id]);
  return (
    <div className='border border-palette_orange rounded text-sm'>
      <div className='p-2 bg-palette_grey bg-opacity-10'>
        <p className='text-left font-bold'>CONTENT EDITOR SUGGESTIONS</p>
        {submittedContentEditorSuggestion && (
          <div className='flex flex-row items-center space-x-2'>
            <img
              src={user?.image ?? ""}
              alt='User profile picture'
              className='h-8 w-8 rounded-full object-cover'
            />
            <div className='flex flex-col justify-between'>
              <p>{user?.name}</p>
              <p className='text-xs'>
                {DateTime.fromJSDate(
                  new Date(submittedContentEditorSuggestion?.updatedAt ?? "")
                ).toRelative()}
              </p>
            </div>
          </div>
        )}
      </div>
      <hr />
      {contentEditorSuggestionItems.contentEditorSuggestionItems.map(
        (contentEditorSuggestionItem) => {
          return (
            <Item
              contentEditorSuggestionItem={contentEditorSuggestionItem}
              key={contentEditorSuggestionItem.id}
              editable={editable}
            />
          );
        }
      )}
    </div>
  );
}

function Item({
  contentEditorSuggestionItem,
  editable,
}: {
  contentEditorSuggestionItem: ContentEditorSuggestionItem;
  editable: boolean;
}) {
  const contentEditorSuggestionItemActionTaken =
    useContentEditorSuggestionItemActionTakenContentEditorSuggestionItem({
      id: contentEditorSuggestionItem.id,
    });

  return (
    <div className='px-1 py-2'>
      {editable && (
        <div className='flex justify-end'>
          <EditSuggestionItemActionTaken
            contentEditorSuggestionItem={contentEditorSuggestionItem}
          />
        </div>
      )}
      <div className='grid grid-cols-5'>
        <p className='px-5 py-1 border-r border-palette_grey col-span-2 sm:col-span-1'>Page No.</p>
        <p className='px-5 flex-1 col-span-2 sm:col-span-4'>
          {contentEditorSuggestionItem.pageNumber}
        </p>
        <p className='px-5 py-1 border-r border-palette_grey col-span-2 sm:col-span-1'>Suggestion</p>
        <p className='px-5 flex-1 col-span-2 sm:col-span-4'>
          {contentEditorSuggestionItem.suggestion}
        </p>
        <p className='px-5 py-1 border-r border-palette_grey col-span-2 sm:col-span-1'>Remarks</p>
        <p className='px-5 flex-1 col-span-2 sm:col-span-4'>
          {contentEditorSuggestionItem.remarks}
        </p>
        <p className='px-5 py-1 border-r border-palette_grey col-span-2 sm:col-span-1'>Action Taken</p>
        <p className='px-5 flex-1 col-span-2 sm:col-span-4'>
          {contentEditorSuggestionItemActionTaken?.value ?? (
            <>
              {editable && (
                <p className='text-palette_error text-xs'>Required *</p>
              )}
            </>
          )}
        </p>
      </div>
    </div>
  );
}

interface EditSuggestionItemActionProps {
  contentEditorSuggestionItem: ContentEditorSuggestionItem;
}

function EditSuggestionItemActionTaken({
  contentEditorSuggestionItem,
}: EditSuggestionItemActionProps) {
  const [openEdit, setOpenEdit] = useState(false);
  const { addSnackbar } = useContext(SnackbarContext);
  const router = useRouter();
  const contentEditorSuggestionItemActionTaken =
    useContentEditorSuggestionItemActionTakenContentEditorSuggestionItem({
      id: contentEditorSuggestionItem.id as string,
    });
  const formik = useFormik({
    initialValues: {
      value: "",
    },
    validationSchema: Yup.object({
      value: Yup.string().required(),
    }),
    onSubmit: (values) => {
      if (contentEditorSuggestionItemActionTaken) {
        axios
          .put(
            `/api/content_editor_suggestion_item_action_taken/${contentEditorSuggestionItemActionTaken.id}`,
            values
          )
          .then(() => {
            addSnackbar("Suggestion has been updated successfully");
          })
          .catch((error) => {
            addSnackbar(
              error.response.data?.error?.message ??
                "Failed to update suggestion",
              "error"
            );
          })
          .finally(() => {
            router.reload();
          });
      } else {
        axios
          .post(`/api/content_editor_suggestion_item_action_taken`, {
            contentEditorSuggestionItemId: contentEditorSuggestionItem.id,
            value: values.value,
          })
          .then(() => {
            addSnackbar("Suggestion has been updated successfully");
          })
          .catch((error) => {
            addSnackbar(
              error.response.data?.error?.message ??
                "Failed to update suggestion",
              "error"
            );
          })
          .finally(() => {
            router.reload();
          });
      }
    },
  });

  useEffect(() => {
    if (!contentEditorSuggestionItemActionTaken) return;
    formik.setValues({
      value: contentEditorSuggestionItemActionTaken.value ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentEditorSuggestionItemActionTaken]);

  return (
    <div>
      <button
        className='bg-palette_blue text-palette_white px-1 rounded text-sm inline-flex items-center space-x-1 justify-center hover:bg-opacity-90'
        onClick={() => setOpenEdit(true)}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          height='1em'
          viewBox='0 0 512 512'
          className='fill-palette_white'
        >
          <path d='M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z' />
        </svg>
        <span>Edit</span>
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
              <button
                type='submit'
                className='bg-palette_blue text-palette_white rounded px-2 py-1 flex items-center space-x-2 justify-center hover:bg-opacity-90'
              >
                <span>Submit</span>
                <span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    height='1em'
                    viewBox='0 0 448 512'
                    className='fill-palette_white'
                  >
                    <path d='M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z' />
                  </svg>
                </span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
