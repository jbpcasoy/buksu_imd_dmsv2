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

export default function ContentSpecialistSuggestionPage() {
  const router = useRouter();
  const iMId = router.query.id;
  const contentSpecialistSuggestion = useContentSpecialistSuggestionMe({ id: iMId as string });
  const contentSpecialistReview = useContentSpecialistReviewMe({ id: iMId as string });
  const [state, setState] = useState<useContentSpecialistSuggestionItemsOwnParams>({
    skip: 0,
    take: 10,
  });
  const contentSpecialistSuggestionItems = useContentSpecialistSuggestionItemsOwn(state);
  const handleSubmitReview = () => {
    if (!contentSpecialistSuggestion) return;
    axios
      .post(`/api/submitted_content_specialist_suggestion`, {
        contentSpecialistSuggestionId: contentSpecialistSuggestion.id,
      })
      .then(() => {
        alert("Review Submitted Successfully");
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
      if (!contentSpecialistSuggestion) {
        return;
      }

      axios
        .post(`/api/content_specialist_suggestion_item`, {
          ...values,
          contentSpecialistSuggestionId: contentSpecialistSuggestion.id,
        })
        .then(() => {
          alert("Suggestion added successfully.");
          router.reload();
        });
    },
  });

  useEffect(() => {
    if (!contentSpecialistReview) {
      return;
    }
    if (!contentSpecialistSuggestion) {
      axios
        .post(`/api/content_specialist_suggestion/`, {
          contentSpecialistReviewId: contentSpecialistReview.id,
        })
        .then((res) => {
          router.reload();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [contentSpecialistReview, contentSpecialistSuggestion]);

  return (
    <MainLayout>
      <div>
        <h2>Content Specialist Review</h2>
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
          {contentSpecialistSuggestionItems.contentSpecialistSuggestionItems.map((contentSpecialistSuggestionItem) => {
            return (
              <ContentSpecialistSuggestionItem
                contentSpecialistSuggestionItem={contentSpecialistSuggestionItem}
                key={contentSpecialistSuggestionItem.id}
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
