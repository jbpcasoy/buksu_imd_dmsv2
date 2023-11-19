import MainLayout from "@/components/MainLayout";
import ContentEditorSuggestionItem from "@/components/ContentEditorSuggestionItem";
import useContentEditorReviewMe from "@/hooks/useContentEditorReviewMe";
import useContentEditorSuggestionItemsOwn, {
  useContentEditorSuggestionItemsOwnParams,
} from "@/hooks/useContentEditorSuggestionItemsOwn";
import useContentEditorSuggestionMe from "@/hooks/useContentEditorSuggestionMe";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { ContentEditorSuggestion } from "@prisma/client";
import Link from "next/link";
import IMIDDSpecialistSuggestionItems from "@/components/IMIDDSpecialistSuggestionItems";
import IMContentSpecialistSuggestionItems from "@/components/IMContentSpecialistSuggestionItems";
import IMQAMISSuggestionItems from "@/components/IMQAMISSuggestionItems";
import useSubmittedContentEditorSuggestionIM from "@/hooks/useSubmittedContentEditorSuggestionIM";
import Modal from "@/components/Modal";

export default function ContentEditorSuggestionPage() {
  const router = useRouter();
  const iMId = router.query.id;
  const contentEditorSuggestion = useContentEditorSuggestionMe({
    id: iMId as string,
  });
  const submittedContentEditorSuggestion =
    useSubmittedContentEditorSuggestionIM({ id: iMId as string });
  const contentEditorReview = useContentEditorReviewMe({ id: iMId as string });
  const [state, setState] = useState<useContentEditorSuggestionItemsOwnParams>({
    skip: 0,
    take: 10,
  });
  const contentEditorSuggestionItems =
    useContentEditorSuggestionItemsOwn(state);
  const handleSubmitReview = () => {
    if (!contentEditorSuggestion) return;
    axios
      .post(`/api/submitted_content_editor_suggestion`, {
        contentEditorSuggestionId: contentEditorSuggestion.id,
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
    if (!contentEditorSuggestion) return;

    setState((prev) => ({
      ...prev,
      id: contentEditorSuggestion.id,
    }));
  }, [contentEditorSuggestion]);

  const handleNext = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return {
        ...prev,
        skip:
          nextVal <= contentEditorSuggestionItems.count ? nextVal : prev.skip,
      };
    });
  };

  const handlePrev = () => {
    setState((prev) => {
      const nextVal = prev.skip - prev.take;
      return { ...prev, skip: nextVal >= 0 ? nextVal : prev.skip };
    });
  };

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
              alert("Suggestion added successfully.");
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
          className='bg-palette_blue text-palette_white px-2 py-1 rounded'
          onClick={() => setOpenAdd(true)}
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
      </>
    );
  };

  return (
    <MainLayout>
      <div>
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

        <div>
          <table className='w-full text-sm'>
            <caption>Content Editor Suggestions</caption>
            <thead>
              <tr>
                <th>LAST ACTIVITY</th>
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
                      contentEditorSuggestionItem={contentEditorSuggestionItem}
                      key={contentEditorSuggestionItem.id}
                    />
                  );
                }
              )}
            </tbody>
          </table>
          <div className='flex justify-end space-x-1'>
            <p>
              {state.skip} - {state.skip + state.take} of{" "}
              {contentEditorSuggestionItems.count}
            </p>
            <button className='border rounded' onClick={handlePrev}>
              prev
            </button>
            <button className='border rounded' onClick={handleNext}>
              next
            </button>
          </div>
        </div>
        <div>
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
        <button
          className='rounded bg-palette_blue text-palette_white px-2 py-1'
          onClick={handleSubmitReview}
        >
          Submit Review
        </button>
      </div>
    </MainLayout>
  );
}
