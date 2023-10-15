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

export default function ContentEditorSuggestionPage() {
  const router = useRouter();
  const iMId = router.query.id;
  const contentEditorSuggestion = useContentEditorSuggestionMe({ id: iMId as string });
  const contentEditorReview = useContentEditorReviewMe({ id: iMId as string });
  const [state, setState] = useState<useContentEditorSuggestionItemsOwnParams>({
    skip: 0,
    take: 10,
  });
  const contentEditorSuggestionItems = useContentEditorSuggestionItemsOwn(state);
  const handleSubmitReview = () => {
    if (!contentEditorSuggestion) return;
    axios
      .post(`/api/submitted_content_editor_suggestion`, {
        contentEditorSuggestionId: contentEditorSuggestion.id,
      })
      .then(() => {
        alert("Review Submitted Successfully");
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
      if (!contentEditorSuggestion) {
        return;
      }

      axios
        .post(`/api/content_editor_suggestion_item`, {
          ...values,
          contentEditorSuggestionId: contentEditorSuggestion.id,
        })
        .then(() => {
          alert("Suggestion added successfully.");
          router.reload();
        });
    },
  });

  useEffect(() => {
    if (!contentEditorReview) {
      return;
    }
    if (!contentEditorSuggestion) {
      axios
        .post(`/api/content_editor_suggestion/`, {
          contentEditorReviewId: contentEditorReview.id,
        })
        .then((res) => {
          router.reload();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [contentEditorReview, contentEditorSuggestion]);

  return (
    <MainLayout>
      <div>
        <h2>Content Editor Review</h2>
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
          <h3>Suggestions</h3>
          {contentEditorSuggestionItems.contentEditorSuggestionItems.map((contentEditorSuggestionItem) => {
            return (
              <ContentEditorSuggestionItem
                contentEditorSuggestionItem={contentEditorSuggestionItem}
                key={contentEditorSuggestionItem.id}
              />
            );
          })}
        </div>
        <button className='rounded border' onClick={handleSubmitReview}>
          Submit Review
        </button>
      </div>
    </MainLayout>
  );
}
