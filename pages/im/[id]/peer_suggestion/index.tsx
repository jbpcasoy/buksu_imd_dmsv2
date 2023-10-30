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
import PeerSuggestionItem from "@/components/PeerSuggestionItem";
import usePeerSuggestionItemsOwn, {
  usePeerSuggestionItemsOwnParams,
} from "@/hooks/usePeerSuggestionItemsOwn";
import MainLayout from "@/components/MainLayout";
import { PeerSuggestion } from "@prisma/client";
import Link from "next/link";
import IMChairpersonSuggestionItems from "@/components/IMChairpersonSuggestionItems";
import IMCoordinatorSuggestionItems from "@/components/IMCoordinatorSuggestionItems";
import useSubmittedPeerSuggestionIM from "@/hooks/useSubmittedPeerSuggestionIM";

export default function PeerSuggestionPage() {
  const router = useRouter();
  const iMId = router.query.id;
  const peerSuggestion = usePeerSuggestionMe({ id: iMId as string });
  const peerReview = usePeerReviewMe({ id: iMId as string });
  const [state, setState] = useState<usePeerSuggestionItemsOwnParams>({
    skip: 0,
    take: 10,
  });
  const peerSuggestionItems = usePeerSuggestionItemsOwn(state);
  const submittedPeerSuggestion = useSubmittedPeerSuggestionIM({
    id: iMId as string,
  });
  const handleNext = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return {
        ...prev,
        skip: nextVal <= peerSuggestionItems.count ? nextVal : prev.skip,
      };
    });
  };

  const handlePrev = () => {
    setState((prev) => {
      const nextVal = prev.skip - prev.take;
      return { ...prev, skip: nextVal >= 0 ? nextVal : prev.skip };
    });
  };

  const handleSubmitReview = () => {
    if (!peerSuggestion) return;
    axios
      .post(`/api/submitted_peer_suggestion`, {
        peerSuggestionId: peerSuggestion.id,
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
    if (!peerSuggestion) return;

    setState((prev) => ({
      ...prev,
      id: peerSuggestion.id,
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
      pageNumber: Yup.number().min(0).required(),
    }),
    onSubmit: (values) => {
      const submitSuggestionItem = async (peerSuggestionId: string) => {
        return axios
          .post(`/api/peer_suggestion_item`, {
            ...values,
            peerSuggestionId,
          })
          .then(() => {
            alert("Suggestion added successfully.");
            router.reload();
          });
      };

      if (!peerSuggestion) {
        if (!peerReview) {
          return;
        }
        return axios
          .post<PeerSuggestion>(`/api/peer_suggestion/`, {
            peerReviewId: peerReview.id,
          })
          .then((res) => {
            const createdPeerSuggestion = res.data;

            return submitSuggestionItem(createdPeerSuggestion.id);
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        return submitSuggestionItem(peerSuggestion.id);
      }
    },
  });

  useEffect(() => {
    if (submittedPeerSuggestion) {
      router.push(`/im/${iMId}`);
    }
  }, [submittedPeerSuggestion]);

  return (
    <MainLayout>
      <div>
        <div className='flex justify-between'>
          <h2 className='inline'>Peer Review</h2>
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
            <caption>Peer Suggestions</caption>
            <thead>
              <tr>
                <th>id</th>
                <th>createdAt</th>
                <th>updatedAt</th>
                <th>suggestion</th>
                <th>pageNumber</th>
                <th>actionTaken</th>
                <th>remarks</th>
                <th>peerSuggestionId</th>
                <th>actions</th>
              </tr>
            </thead>
            <tbody>
              {peerSuggestionItems.peerSuggestionItems.map(
                (peerSuggestionItem) => {
                  return (
                    <PeerSuggestionItem
                      peerSuggestionItem={peerSuggestionItem}
                      key={peerSuggestionItem.id}
                    />
                  );
                }
              )}
            </tbody>
          </table>

          <div className='flex justify-end space-x-1'>
            <p>
              {state.skip} - {state.skip + state.take} of{" "}
              {peerSuggestionItems.count}
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
          <IMChairpersonSuggestionItems id={iMId as string} editable={false} />
          <IMCoordinatorSuggestionItems id={iMId as string} editable={false} />
        </div>
        <button className='rounded border' onClick={handleSubmitReview}>
          Submit Review
        </button>
      </div>
    </MainLayout>
  );
}
