import useCoordinatorReviewMe from "@/hooks/useCoordinatorReviewMe";
import useCoordinatorSuggestionItems, {
  useCoordinatorSuggestionItemsParams,
} from "@/hooks/useCoordinatorSuggestionItems";
import useCoordinatorSuggestionMe from "@/hooks/useCoordinatorSuggestionMe";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";

export default function CoordinatorSuggestionPage() {
  const router = useRouter();
  const iMId = router.query.id;
  const coordinatorSuggestion = useCoordinatorSuggestionMe({
    id: iMId as string,
  });
  const coordinatorReview = useCoordinatorReviewMe({ id: iMId as string });
  const [state, setState] = useState<useCoordinatorSuggestionItemsParams>({
    skip: 0,
    take: 10,
  });
  const coordinatorSuggestionItems = useCoordinatorSuggestionItems(state);
  const handleSubmitReview = () => {
    if (!coordinatorSuggestion) return;
    axios
      .post(`/api/submitted_coordinator_suggestion`, {
        coordinatorSuggestionId: coordinatorSuggestion.id,
      })
      .then(() => {
        alert("Review Submitted Successfully");
      })
      .catch((error: any) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  useEffect(() => {
    if (!coordinatorSuggestion) return;

    setState((prev) => ({
      ...prev,
      filter: {
        coordinatorSuggestionId: coordinatorSuggestion.id,
      },
    }));
  }, [coordinatorSuggestion]);

  const formik = useFormik({
    initialValues: {
      suggestion: "",
      remarks: "",
      pageNumber: 0,
    },
    validationSchema: Yup.object({
      suggestion: Yup.string().required(),
      remarks: Yup.string(),
      pageNumber: Yup.number().required(),
    }),
    onSubmit: (values) => {
      if (!coordinatorSuggestion) {
        return;
      }

      axios
        .post(`/api/coordinator_suggestion_item`, {
          ...values,
          coordinatorSuggestionId: coordinatorSuggestion.id,
        })
        .then(() => {
          alert("Suggestion added successfully.");
          router.reload();
        });
    },
  });

  useEffect(() => {
    if (!coordinatorReview) {
      return;
    }
    if (!coordinatorSuggestion) {
      axios
        .post(`/api/coordinator_suggestion/`, {
          coordinatorReviewId: coordinatorReview.id,
        })
        .then((res) => {
          router.reload();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [coordinatorReview, coordinatorSuggestion]);

  return (
    <div>
      <h2>Coordinator Review</h2>
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
        <textarea placeholder='remarks' {...formik.getFieldProps("remarks")} />
        <br />
        <input type='submit' value='Submit' className='border rounded' />
      </form>
      <div>
        <h3>Suggestions</h3>
        {coordinatorSuggestionItems.coordinatorSuggestionItems.map(
          (coordinatorSuggestionItem) => {
            return (
              <div className='border rounded'>
                <p>suggestion: {coordinatorSuggestionItem.suggestion}</p>
                <p>pageNumber: {coordinatorSuggestionItem.pageNumber}</p>
                <p>remarks: {coordinatorSuggestionItem.remarks}</p>
              </div>
            );
          }
        )}
      </div>
      <button className='rounded border' onClick={handleSubmitReview}>
        Submit Review
      </button>
    </div>
  );
}
