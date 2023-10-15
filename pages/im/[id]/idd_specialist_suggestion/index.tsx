import MainLayout from "@/components/MainLayout";
import IDDSpecialistSuggestionItem from "@/components/IDDSpecialistSuggestionItem";
import useIDDSpecialistReviewMe from "@/hooks/useIDDSpecialistReviewMe";
import useIDDSpecialistSuggestionItemsOwn, {
    useIDDSpecialistSuggestionItemsOwnParams,
} from "@/hooks/useIDDSpecialistSuggestionItemsOwn";
import useIDDSpecialistSuggestionMe from "@/hooks/useIDDSpecialistSuggestionMe";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";

export default function IDDSpecialistSuggestionPage() {
  const router = useRouter();
  const iMId = router.query.id;
  const iDDSpecialistSuggestion = useIDDSpecialistSuggestionMe({ id: iMId as string });
  const iDDSpecialistReview = useIDDSpecialistReviewMe({ id: iMId as string });
  const [state, setState] = useState<useIDDSpecialistSuggestionItemsOwnParams>({
    skip: 0,
    take: 10,
  });
  const iDDSpecialistSuggestionItems = useIDDSpecialistSuggestionItemsOwn(state);
  const handleSubmitReview = () => {
    if (!iDDSpecialistSuggestion) return;
    axios
      .post(`/api/submitted_idd_specialist_suggestion`, {
        iDDSpecialistSuggestionId: iDDSpecialistSuggestion.id,
      })
      .then(() => {
        alert("Review Submitted Successfully");
      })
      .catch((error: any) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  useEffect(() => {
    if (!iDDSpecialistSuggestion) return;

    setState((prev) => ({
      ...prev,
      id: iDDSpecialistSuggestion.id,
    }));
  }, [iDDSpecialistSuggestion]);

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
      if (!iDDSpecialistSuggestion) {
        return;
      }

      axios
        .post(`/api/idd_specialist_suggestion_item`, {
          ...values,
          iDDSpecialistSuggestionId: iDDSpecialistSuggestion.id,
        })
        .then(() => {
          alert("Suggestion added successfully.");
          router.reload();
        });
    },
  });

  useEffect(() => {
    if (!iDDSpecialistReview) {
      return;
    }
    if (!iDDSpecialistSuggestion) {
      axios
        .post(`/api/idd_specialist_suggestion/`, {
          iDDSpecialistReviewId: iDDSpecialistReview.id,
        })
        .then((res) => {
          router.reload();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [iDDSpecialistReview, iDDSpecialistSuggestion]);

  return (
    <MainLayout>
      <div>
        <h2>IDD Specialist Review</h2>
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
          {iDDSpecialistSuggestionItems.iDDSpecialistSuggestionItems.map((iDDSpecialistSuggestionItem) => {
            return (
              <IDDSpecialistSuggestionItem
                iDDSpecialistSuggestionItem={iDDSpecialistSuggestionItem}
                key={iDDSpecialistSuggestionItem.id}
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
