import CoordinatorSuggestionItem from "@/components/CoordinatorSuggestionItem";
import MainLayout from "@/components/MainLayout";
import useCoordinatorReviewMe from "@/hooks/useCoordinatorReviewMe";
import useCoordinatorSuggestionItemsOwn, {
  useCoordinatorSuggestionItemsOwnParams,
} from "@/hooks/useCoordinatorSuggestionItemsOwn";
import useCoordinatorSuggestionMe from "@/hooks/useCoordinatorSuggestionMe";
import { CoordinatorSuggestion } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import Link from "next/link";
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
  const [state, setState] = useState<useCoordinatorSuggestionItemsOwnParams>({
    skip: 0,
    take: 10,
  });
  const coordinatorSuggestionItems = useCoordinatorSuggestionItemsOwn(state);
  const handleSubmitReview = () => {
    if (!coordinatorSuggestion) return;
    axios
      .post(`/api/submitted_coordinator_suggestion`, {
        coordinatorSuggestionId: coordinatorSuggestion.id,
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
    if (!coordinatorSuggestion) return;

    setState((prev) => ({
      ...prev,
      id: coordinatorSuggestion.id,
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
      pageNumber: Yup.number().min(0).required(),
    }),
    onSubmit: (values) => {
      const submitSuggestionItem = async (coordinatorSuggestionId: string) => {
        return axios
          .post(`/api/coordinator_suggestion_item`, {
            ...values,
            coordinatorSuggestionId,
          })
          .then(() => {
            alert("Suggestion added successfully.");
            router.reload();
          });
      };

      if (!coordinatorSuggestion) {
        if (!coordinatorReview) {
          return;
        }
        return axios
          .post<CoordinatorSuggestion>(`/api/coordinator_suggestion/`, {
            coordinatorReviewId: coordinatorReview.id,
          })
          .then((res) => {
            const createdCoordinatorSuggestion = res.data;

            return submitSuggestionItem(createdCoordinatorSuggestion.id);
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        return submitSuggestionItem(coordinatorSuggestion.id);
      }
    },
  });

  return (
    <MainLayout>
      <div>
        <div className='flex justify-between'>
          <h2 className='inline'>Coordinator Review</h2>
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
          <h3>Suggestions</h3>
          {coordinatorSuggestionItems.coordinatorSuggestionItems.map(
            (coordinatorSuggestionItem) => {
              return (
                <CoordinatorSuggestionItem
                  coordinatorSuggestionItem={coordinatorSuggestionItem}
                  key={coordinatorSuggestionItem.id}
                />
              );
            }
          )}
        </div>
        <button className='rounded border' onClick={handleSubmitReview}>
          Submit Review
        </button>
      </div>
    </MainLayout>
  );
}
