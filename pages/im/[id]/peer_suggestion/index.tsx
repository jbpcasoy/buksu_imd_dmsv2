import usePeerReviewMe from "@/hooks/usePeerReviewMe";
import usePeerSuggestionItems, {
  usePeerSuggestionItemsParams,
} from "@/hooks/usePeerSuggestionItems";
import usePeerSuggestionMe from "@/hooks/usePeerSuggestionMe";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";

export default function PeerSuggestionPage() {
  const router = useRouter();
  const iMId = router.query.id;
  const peerSuggestion = usePeerSuggestionMe({ id: iMId as string });
  const peerReview = usePeerReviewMe({ id: iMId as string });
  const [state, setState] = useState<usePeerSuggestionItemsParams>({
    skip: 0,
    take: 10,
  });
  const peerSuggestionItems = usePeerSuggestionItems(state);
  const handleSubmitReview = () => {
    if (!peerSuggestion) return;
    axios
      .post(`/api/submitted_peer_suggestion`, {
        peerSuggestionId: peerSuggestion.id,
      })
      .then(() => {
        alert("Review Submitted Successfully");
      })
      .catch((error: any) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  useEffect(() => {
    if (!peerSuggestion) return;

    setState((prev) => ({
      ...prev,
      filter: {
        peerSuggestionId: peerSuggestion.id,
      },
    }));
  }, [peerSuggestion]);

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
      if (!peerSuggestion) {
        return;
      }

      axios
        .post(`/api/peer_suggestion_item`, {
          ...values,
          peerSuggestionId: peerSuggestion.id,
        })
        .then(() => {
          alert("Suggestion added successfully.");
          router.reload();
        });
    },
  });

  useEffect(() => {
    if (!peerReview) {
      return;
    }
    if (!peerSuggestion) {
      axios
        .post(`/api/peer_suggestion/`, {
          peerReviewId: peerReview.id,
        })
        .then((res) => {
          router.reload();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [peerReview, peerSuggestion]);

  return (
    <div>
      <h2>Peer Review</h2>
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
        {peerSuggestionItems.peerSuggestionItems.map((peerSuggestionItem) => {
          return (
            <div className='border rounded'>
              <p>suggestion: {peerSuggestionItem.suggestion}</p>
              <p>pageNumber: {peerSuggestionItem.pageNumber}</p>
              <p>remarks: {peerSuggestionItem.remarks}</p>
            </div>
          );
        })}
      </div>
      <button className='rounded border' onClick={handleSubmitReview}>Submit Review</button>
    </div>
  );
}
