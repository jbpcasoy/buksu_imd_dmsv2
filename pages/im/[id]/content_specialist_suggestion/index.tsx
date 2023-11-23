import MainLayout from "@/components/MainLayout";
import ContentSpecialistSuggestionItem from "@/components/ContentSpecialistSuggestionItem";
import useContentSpecialistReviewMe from "@/hooks/useContentSpecialistReviewMe";
import useContentSpecialistSuggestionItemsOwn, {
  useContentSpecialistSuggestionItemsOwnParams,
} from "@/hooks/useContentSpecialistSuggestionItemsOwn";
import useContentSpecialistSuggestionMe from "@/hooks/useContentSpecialistSuggestionMe";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { ContentSpecialistSuggestion } from "@prisma/client";
import Link from "next/link";
import IMIDDSpecialistSuggestionItems from "@/components/IMIDDSpecialistSuggestionItems";
import IMContentEditorSuggestionItems from "@/components/IMContentEditorSuggestionItems";
import IMQAMISSuggestionItems from "@/components/IMQAMISSuggestionItems";
import useSubmittedContentSpecialistSuggestionIM from "@/hooks/useSubmittedContentSpecialistSuggestionIM";
import Modal from "@/components/Modal";

export default function ContentSpecialistSuggestionPage() {
  const router = useRouter();
  const iMId = router.query.id;
  const contentSpecialistSuggestion = useContentSpecialistSuggestionMe({
    id: iMId as string,
  });
  const contentSpecialistReview = useContentSpecialistReviewMe({
    id: iMId as string,
  });
  const [state, setState] =
    useState<useContentSpecialistSuggestionItemsOwnParams>({
      skip: 0,
      take: 999,
    });
  const submittedContentSpecialistSuggestion =
    useSubmittedContentSpecialistSuggestionIM({ id: iMId as string });
  const contentSpecialistSuggestionItems =
    useContentSpecialistSuggestionItemsOwn(state);
  const handleSubmitReview = () => {
    if (!contentSpecialistSuggestion) return;
    axios
      .post(`/api/submitted_content_specialist_suggestion`, {
        contentSpecialistSuggestionId: contentSpecialistSuggestion.id,
      })
      .then(() => {
        alert("Review Submitted Successfully");
        router.push(`/im/${iMId}`);
      })
      .catch((error: any) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  useEffect(() => {
    if (!contentSpecialistSuggestion) return;

    setState((prev) => ({
      ...prev,
      id: contentSpecialistSuggestion.id,
    }));
  }, [contentSpecialistSuggestion]);

  useEffect(() => {
    if (submittedContentSpecialistSuggestion) {
      router.push(`/im/${iMId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submittedContentSpecialistSuggestion, iMId]);

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
          contentSpecialistSuggestionId: string
        ) => {
          return axios
            .post(`/api/content_specialist_suggestion_item`, {
              ...values,
              contentSpecialistSuggestionId,
            })
            .then(() => {
              alert("Suggestion added successfully.");
              router.reload();
            });
        };

        if (!contentSpecialistSuggestion) {
          if (!contentSpecialistReview) {
            return;
          }
          return axios
            .post<ContentSpecialistSuggestion>(
              `/api/content_specialist_suggestion/`,
              {
                contentSpecialistReviewId: contentSpecialistReview.id,
              }
            )
            .then((res) => {
              const createdContentSpecialistSuggestion = res.data;

              return submitSuggestionItem(
                createdContentSpecialistSuggestion.id
              );
            })
            .catch((error) => {
              console.error(error);
            });
        } else {
          return submitSuggestionItem(contentSpecialistSuggestion.id);
        }
      },
    });

    return (
      <div>
        <button
          onClick={() => setOpenAdd(true)}
          className='bg-palette_blue text-palette_white px-2 py-1 rounded'
        >
          Add
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
                  placeholder='Remarks'
                  {...formik.getFieldProps("remarks")}
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
  };

  return (
    <MainLayout>
      <div className='flex space-x-1 h-full overflow-auto'>
        <div className='space-y-1 flex-1 flex flex-col h-full overflow-auto'>
          <div className='flex justify-between pb-2'>
            <div>
              <h2 className='inline text-lg font-bold'>
                Instructional Material Review{" "}
                <span className='bg-palette_orange text-palette_white p-1 rounded'>
                  Content Specialist
                </span>
              </h2>
              <p className='text-sm'>IMERC Phase</p>
            </div>
            <div>
              <AddSuggestionItem />
            </div>
          </div>

          <div className='flex-1 h-full overflow-auto space-y-1'>
            <div>
              <table className='w-full text-sm'>
                <caption>Content Specialist Suggestions</caption>
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
                  {contentSpecialistSuggestionItems.contentSpecialistSuggestionItems.map(
                    (contentSpecialistSuggestionItem) => {
                      return (
                        <ContentSpecialistSuggestionItem
                          contentSpecialistSuggestionItem={
                            contentSpecialistSuggestionItem
                          }
                          key={contentSpecialistSuggestionItem.id}
                        />
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
            <div className='space-y-1'>
              <IMQAMISSuggestionItems id={iMId as string} editable={false} />
              <IMIDDSpecialistSuggestionItems
                id={iMId as string}
                editable={false}
              />
              <IMContentEditorSuggestionItems
                id={iMId as string}
                editable={false}
              />
            </div>
            <button
              className='rounded bg-palette_blue text-palette_white px-2 py-1'
              onClick={handleSubmitReview}
            >
              Submit Review
            </button>
          </div>
        </div>
        <div className='flex-1'>
          <iframe
            src={`/api/im_file/im/${iMId}/pdf`}
            className='w-full h-full rounded'
          />
        </div>
      </div>
    </MainLayout>
  );
}
