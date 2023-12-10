import Confirmation from "@/components/Confirmation";
import ContentEditorSuggestionItem from "@/components/ContentEditorSuggestionItem";
import IMContentSpecialistSuggestionItems from "@/components/IMContentSpecialistSuggestionItems";
import IMIDDSpecialistSuggestionItems from "@/components/IMIDDSpecialistSuggestionItems";
import IMQAMISSuggestionItems from "@/components/IMQAMISSuggestionItems";
import Loading from "@/components/Loading";
import MainLayout from "@/components/MainLayout";
import Modal from "@/components/Modal";
import { SnackbarContext } from "@/components/SnackbarProvider";
import useActiveCITLDirector from "@/hooks/useActiveCITLDirector";
import useActiveCITLDirectorMe from "@/hooks/useActiveCITLDirectorMe";
import useContentEditorReviewMe from "@/hooks/useContentEditorReviewMe";
import useContentEditorSuggestionItemsOwn, {
  useContentEditorSuggestionItemsOwnParams,
} from "@/hooks/useContentEditorSuggestionItemsOwn";
import useContentEditorSuggestionMe from "@/hooks/useContentEditorSuggestionMe";
import useIM from "@/hooks/useIM";
import useSubmittedContentEditorSuggestionIM from "@/hooks/useSubmittedContentEditorSuggestionIM";
import { ContentEditorSuggestion } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import Error from "next/error";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import * as Yup from "yup";

export default function ContentEditorSuggestionPage() {
  const router = useRouter();
  const iMId = router.query.id;
  const iM = useIM({ id: iMId as string });
  const contentEditorSuggestion = useContentEditorSuggestionMe({
    id: iMId as string,
  });
  const submittedContentEditorSuggestion =
    useSubmittedContentEditorSuggestionIM({ id: iMId as string });
  const contentEditorReview = useContentEditorReviewMe({ id: iMId as string });
  const { addSnackbar } = useContext(SnackbarContext);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [state, setState] = useState<useContentEditorSuggestionItemsOwnParams>({
    skip: 0,
    take: 999,
  });
  const contentEditorSuggestionItems =
    useContentEditorSuggestionItemsOwn(state);
  const activeCITLDirector = useActiveCITLDirectorMe();
  const handleSubmitReview = () => {
    if (!contentEditorSuggestion) return;
    axios
      .post(`/api/submitted_content_editor_suggestion`, {
        contentEditorSuggestionId: contentEditorSuggestion.id,
      })
      .then(() => {
        addSnackbar("Review Submitted Successfully");
        router.push(`/im/${iMId}`);
      })
      .catch((error: any) => {
        addSnackbar(
          error.response.data?.error?.message ?? "Failed to submit review",
          "error"
        );
      });
  };

  useEffect(() => {
    if (!contentEditorSuggestion) return;

    setState((prev) => ({
      ...prev,
      id: contentEditorSuggestion.id,
    }));
  }, [contentEditorSuggestion]);

  useEffect(() => {
    if (submittedContentEditorSuggestion) {
      router.push(`/im/${iMId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submittedContentEditorSuggestion, iMId]);

  const AddSuggestionItem = () => {
    const [openAdd, setOpenAdd] = useState(false);
    const formik = useFormik({
      initialValues: {
        suggestion: "",
        remarks: "",
        pageNumber: 0,
      },
      validationSchema: Yup.object({
        suggestion: Yup.string().required(),
        remarks: Yup.string(),
        pageNumber: Yup.number().min(0).required(),
      }),

      onSubmit: (values) => {
        const submitSuggestionItem = async (
          contentEditorSuggestionId: string
        ) => {
          return axios
            .post(`/api/content_editor_suggestion_item`, {
              ...values,
              contentEditorSuggestionId,
            })
            .then(() => {
              addSnackbar("Suggestion has been added successfully");
            })
            .catch((error) => {
              addSnackbar(
                error.response.data?.error?.message ??
                  "Suggestion has been added successfully",
                "error"
              );
            })
            .finally(() => {
              router.reload();
            });
        };

        if (!contentEditorSuggestion) {
          if (!contentEditorReview) {
            return;
          }
          return axios
            .post<ContentEditorSuggestion>(`/api/content_editor_suggestion/`, {
              contentEditorReviewId: contentEditorReview.id,
            })
            .then((res) => {
              const createdContentEditorSuggestion = res.data;

              return submitSuggestionItem(createdContentEditorSuggestion.id);
            })
            .catch((error) => {
              console.error(error);
            });
        } else {
          return submitSuggestionItem(contentEditorSuggestion.id);
        }
      },
    });

    return (
      <>
        <button
          onClick={() => setOpenAdd(true)}
          className='rounded bg-palette_blue text-palette_white px-2 py-1 inline-flex space-x-2 items-center hover:bg-opacity-90'
        >
          <span>Add</span>
          <span>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              height='1em'
              viewBox='0 0 448 512'
              className='fill-palette_white'
            >
              <path d='M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z' />
            </svg>
          </span>
        </button>
        {openAdd && (
          <Modal title='Add Suggestion' onClose={() => setOpenAdd(false)}>
            <form noValidate onSubmit={formik.handleSubmit}>
              <div className='flex flex-col space-y-1'>
                <textarea
                  placeholder='Suggestion'
                  {...formik.getFieldProps("suggestion")}
                  className='rounded'
                />
                <input
                  type='number'
                  placeholder='Page No.'
                  {...formik.getFieldProps("pageNumber")}
                  className='rounded'
                />
                <textarea
                  placeholder='Remarks (optional)'
                  {...formik.getFieldProps("remarks")}
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
      </>
    );
  };

  useEffect(() => {
    if (activeCITLDirector === undefined) {
      return;
    }

    if (activeCITLDirector === null) {
      addSnackbar("Only the CITL director is allowed for this action", "error");
      router.replace(`/im/${iMId}`);
    }
  }, [activeCITLDirector]);

  if (iM === null) {
    return (
      <MainLayout>
        <Error statusCode={404} title='IM Not Found' />
      </MainLayout>
    );
  }
  if (iM === undefined) {
    return (
      <MainLayout>
        <Loading />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className='flex flex-col sm:flex-row space-x-1 h-full overflow-auto'>
        <div className='space-y-1 sm:flex-1 flex flex-col sm:h-full overflow-auto'>
          <div className='flex justify-between'>
            <div>
              <h2 className='inline text-lg font-bold'>
                Instructional Material Review{" "}
                <span className='bg-palette_orange text-palette_white p-1 rounded'>
                  Content Editor
                </span>
              </h2>
              <p className='text-sm'>IMERC Phase</p>
            </div>
            <div>
              <AddSuggestionItem />
            </div>
          </div>

          <div className='flex-1 h-full overflow-auto space-y-1'>
            <div className="overflow-auto">
              <table className='w-full text-sm overflow-auto'>
                <caption>Content Editor Suggestions</caption>
                <thead>
                  <tr>
                    <th>SUGGESTION</th>
                    <th>PAGE NUMBER</th>
                    <th>ACTION TAKEN</th>
                    <th>REMARKS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {contentEditorSuggestionItems.contentEditorSuggestionItems.map(
                    (contentEditorSuggestionItem) => {
                      return (
                        <ContentEditorSuggestionItem
                          contentEditorSuggestionItem={
                            contentEditorSuggestionItem
                          }
                          key={contentEditorSuggestionItem.id}
                        />
                      );
                    }
                  )}
                </tbody>
              </table>

              {contentEditorSuggestionItems.count < 1 && (
                <p className='text-center text-xs text-palette_error w-full'>
                  Suggestions are required
                </p>
              )}
            </div>
            <div className='space-y-1'>
              <IMQAMISSuggestionItems id={iMId as string} editable={false} />
              <IMIDDSpecialistSuggestionItems
                id={iMId as string}
                editable={false}
              />
              <IMContentSpecialistSuggestionItems
                id={iMId as string}
                editable={false}
              />
            </div>
            <>
              <button
                className='rounded bg-palette_blue text-palette_white px-2 py-1 inline-flex space-x-2 items-center hover:bg-opacity-90 disabled:bg-palette_grey'
                disabled={!Boolean(contentEditorSuggestion)}
                onClick={() => setOpenConfirmation(true)}
              >
                <span>Submit Review</span>
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
              {openConfirmation && (
                <Confirmation
                  onClose={() => setOpenConfirmation(false)}
                  onConfirm={handleSubmitReview}
                />
              )}
            </>
          </div>
        </div>
        <div className='sm:flex-1 h-screen-3/4 sm:h-auto'>
          <iframe
            loading='lazy'
            src={`/api/im_file/im/${iMId}/pdf`}
            className='w-full h-full rounded'
          />
        </div>
      </div>
    </MainLayout>
  );
}
