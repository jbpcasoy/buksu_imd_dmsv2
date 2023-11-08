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

  return (
    <MainLayout>
      <div>
        <div className='flex justify-between'>
          <h2 className='inline'>Content Editor Review</h2>
          <Link
            href={`/api/im_file/im/${iMId}/pdf`}
            className='underline'
            target='_blank'
          >
            View PDF
          </Link>
        </div>
        <form noValidate onSubmit={formik.handleSubmit}>
          <textarea
            placeholder='suggestion'
            {...formik.getFieldProps("suggestion")}
          />
          <br />
          <input
            type='number'
            placeholder='pageNumber'
            {...formik.getFieldProps("pageNumber")}
          />
          <br />
          <textarea
            placeholder='remarks'
            {...formik.getFieldProps("remarks")}
          />
          <br />
          <input type='submit' value='Submit' className='border rounded' />
        </form>

        <div>
          <table>
            <caption>Content Editor Suggestions</caption>
            <thead>
              <tr>
                <th>id</th>
                <th>createdAt</th>
                <th>updatedAt</th>
                <th>suggestion</th>
                <th>pageNumber</th>
                <th>actionTaken</th>
                <th>remarks</th>
                <th>contentEditorSuggestionId</th>
                <th>actions</th>
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
        <button className='rounded border' onClick={handleSubmitReview}>
          Submit Review
        </button>
      </div>
    </MainLayout>
  );
}
