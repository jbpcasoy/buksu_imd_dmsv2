import useChairpersonReviewMe from "@/hooks/useChairpersonReviewMe";
import useChairpersonSuggestionItems, {
  useChairpersonSuggestionItemsParams,
} from "@/hooks/useChairpersonSuggestionItems";
import useChairpersonSuggestionMe from "@/hooks/useChairpersonSuggestionMe";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import ChairpersonSuggestionItem from "@/components/ChairpersonSuggestionItem";

export default function ChairpersonSuggestionPage() {
  const router = useRouter();
  const iMId = router.query.id;
  const chairpersonSuggestion = useChairpersonSuggestionMe({
    id: iMId as string,
  });
  const chairpersonReview = useChairpersonReviewMe({ id: iMId as string });
  const [state, setState] = useState<useChairpersonSuggestionItemsParams>({
    skip: 0,
    take: 10,
  });
  const chairpersonSuggestionItems = useChairpersonSuggestionItems(state);
  const handleSubmitReview = () => {
    if (!chairpersonSuggestion) return;
    axios
      .post(`/api/submitted_chairperson_suggestion`, {
        chairpersonSuggestionId: chairpersonSuggestion.id,
      })
      .then(() => {
        alert("Review Submitted Successfully");
      })
      .catch((error: any) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  useEffect(() => {
    if (!chairpersonSuggestion) return;

    setState((prev) => ({
      ...prev,
      filter: {
        chairpersonSuggestionId: chairpersonSuggestion.id,
      },
    }));
  }, [chairpersonSuggestion]);

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
      if (!chairpersonSuggestion) {
        return;
      }

      axios
        .post(`/api/chairperson_suggestion_item`, {
          ...values,
          chairpersonSuggestionId: chairpersonSuggestion.id,
        })
        .then(() => {
          alert("Suggestion added successfully.");
          router.reload();
        });
    },
  });

  useEffect(() => {
    if (!chairpersonReview) {
      return;
    }
    if (!chairpersonSuggestion) {
      axios
        .post(`/api/chairperson_suggestion/`, {
          chairpersonReviewId: chairpersonReview.id,
        })
        .then((res) => {
          router.reload();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [chairpersonReview, chairpersonSuggestion]);

  return (
    <div>
      <h2>Chairperson Review</h2>
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
        {chairpersonSuggestionItems.chairpersonSuggestionItems.map(
          (chairpersonSuggestionItem) => {
            return (
              <ChairpersonSuggestionItem
                chairpersonSuggestionItem={chairpersonSuggestionItem}
                key={chairpersonSuggestionItem.id}
              />
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
