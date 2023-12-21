import useContentSpecialistSuggestionItemActionTakenContentSpecialistSuggestionItem from "@/hooks/useContentSpecialistSuggestionItemActionTakenContentSpecialistSuggestionItem";
import useContentSpecialistSuggestionItemsIM from "@/hooks/useContentSpecialistSuggestionItemsIM";
import { ContentSpecialistSuggestionItem, SubmittedContentSpecialistSuggestion } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import { DateTime } from "luxon";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import Modal from "./Modal";
import { SnackbarContext } from "./SnackbarProvider";
import useSubmittedContentSpecialistSuggestionIM from "@/hooks/useSubmittedContentSpecialistSuggestionIM";
import useContentSpecialistSuggestion from "@/hooks/useContentSpecialistSuggestion";
import useContentSpecialistReview from "@/hooks/useContentSpecialistReview";
import useContentSpecialist from "@/hooks/useContentSpecialist";
import useFaculty from "@/hooks/useFaculty";
import useUser from "@/hooks/useUser";
import useRefresh from "@/hooks/useRefresh";
import { useSession } from "next-auth/react";

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
    take: 999,
    id,
  });
  const {data: session} = useSession();
  const contentSpecialistSuggestionItems =
    useContentSpecialistSuggestionItemsIM(state);

  const submittedContentSpecialistSuggestion =
    useSubmittedContentSpecialistSuggestionIM({
      id,
    });

  useEffect(() => {
    setState((prev) => ({ ...prev, id }));
  }, [id]);

  return (
    <div className='border border-palette_orange rounded text-sm'>
      <div className='p-2 bg-palette_grey bg-opacity-10'>
        <p className='text-left font-bold'>CONTENT SPECIALIST SUGGESTIONS</p>
        {submittedContentSpecialistSuggestion && session?.user?.isAdmin && 
          <UserInformation 
            submittedContentSpecialistSuggestion={submittedContentSpecialistSuggestion}
          />
        }
      </div>
      <hr />
      {contentSpecialistSuggestionItems.contentSpecialistSuggestionItems.map(
        (contentSpecialistSuggestionItem) => {
          return (
            <Item
              contentSpecialistSuggestionItem={contentSpecialistSuggestionItem}
              key={contentSpecialistSuggestionItem.id}
              editable={editable}
            />
          );
        }
      )}
    </div>
  );
}

interface UserInformationProps {
  submittedContentSpecialistSuggestion: SubmittedContentSpecialistSuggestion;
}
function UserInformation({submittedContentSpecialistSuggestion}: UserInformationProps) {
  const contentSpecialistSuggestion = useContentSpecialistSuggestion({
    id: submittedContentSpecialistSuggestion?.contentSpecialistSuggestionId,
  });
  const contentSpecialistReview = useContentSpecialistReview({
    id: contentSpecialistSuggestion?.contentSpecialistReviewId,
  });
  const contentSpecialist = useContentSpecialist({
    id: contentSpecialistReview?.contentSpecialistId,
  });
  const faculty = useFaculty({
    id: contentSpecialist?.facultyId,
  });
  const user = useUser({
    id: faculty?.userId,
  });
  return <div className='flex flex-row items-center space-x-2'>
    <img
      src={user?.image ?? ""}
      alt='User profile picture'
      className='h-8 w-8 rounded-full object-cover'
    />
    <div className='flex flex-col justify-between'>
      <p>{user?.name}</p>
      <p className='text-xs'>
        {DateTime.fromJSDate(
          new Date(submittedContentSpecialistSuggestion?.updatedAt ?? "")
        ).toRelative()}
      </p>
    </div>
  </div>
}

function Item({
  contentSpecialistSuggestionItem,
  editable,
}: {
  contentSpecialistSuggestionItem: ContentSpecialistSuggestionItem;
  editable: boolean;
}) {
  const {refresh, refreshFlag} = useRefresh();
  const contentSpecialistSuggestionItemActionTaken =
    useContentSpecialistSuggestionItemActionTakenContentSpecialistSuggestionItem(
      {
        id: contentSpecialistSuggestionItem.id,
      },
      refreshFlag
    );

  return (
    <div className='px-1 py-2'>
      {editable && (
        <div className='flex justify-end'>
          <EditSuggestionItemActionTaken
            contentSpecialistSuggestionItem={contentSpecialistSuggestionItem}
            refresh={refresh}
            refreshFlag={refreshFlag}
          />
        </div>
      )}
      <div className='grid grid-cols-5'>
        <p className='px-5 py-1 border-r border-palette_grey col-span-2 sm:col-span-1'>Page No.</p>
        <p className='px-5 flex-1 col-span-2 sm:col-span-4'>
          {contentSpecialistSuggestionItem.pageNumber}
        </p>
        <p className='px-5 py-1 border-r border-palette_grey col-span-2 sm:col-span-1'>Suggestion</p>
        <p className='px-5 flex-1 col-span-2 sm:col-span-4'>
          {contentSpecialistSuggestionItem.suggestion}
        </p>
        <p className='px-5 py-1 border-r border-palette_grey col-span-2 sm:col-span-1'>Remarks</p>
        <p className='px-5 flex-1 col-span-2 sm:col-span-4'>
          {contentSpecialistSuggestionItem.remarks}
        </p>
        <p className='px-5 py-1 border-r border-palette_grey col-span-2 sm:col-span-1'>Action Taken</p>
        <p className='px-5 flex-1 col-span-2 sm:col-span-4'>
          {contentSpecialistSuggestionItemActionTaken?.value ?? (
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

interface EditSuggestionItemActionTakenProps {
  contentSpecialistSuggestionItem: ContentSpecialistSuggestionItem;
  refresh: () => any;
  refreshFlag?: number;
}

function EditSuggestionItemActionTaken({
  contentSpecialistSuggestionItem,
  refresh,
  refreshFlag,
}: EditSuggestionItemActionTakenProps) {
  const router = useRouter();
  const { addSnackbar } = useContext(SnackbarContext);
  const [openEdit, setOpenEdit] = useState(false);
  const contentSpecialistSuggestionItemActionTaken =
    useContentSpecialistSuggestionItemActionTakenContentSpecialistSuggestionItem(
      {
        id: contentSpecialistSuggestionItem.id as string,
      },
      refreshFlag,
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
            refresh();
            setOpenEdit(false);
          });
      } else {
        axios
          .post(`/api/content_specialist_suggestion_item_action_taken`, {
            contentSpecialistSuggestionItemId:
              contentSpecialistSuggestionItem.id,
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
            refresh();
            setOpenEdit(false);
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
            <div className='flex  flex-col space-y-1'>
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
