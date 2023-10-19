import ChairpersonSuggestionItem from "@/components/ChairpersonSuggestionItem";
import IMCoordinatorSuggestionItems from "@/components/IMCoordinatorSuggestionItems";
import IMPeerSuggestionItems from "@/components/IMPeerSuggestionItems";
import MainLayout from "@/components/MainLayout";
import useChairpersonReviewMe from "@/hooks/useChairpersonReviewMe";
import useChairpersonSuggestionItemsOwn, {
  useChairpersonSuggestionItemsOwnParams,
} from "@/hooks/useChairpersonSuggestionItemsOwn";
import useChairpersonSuggestionMe from "@/hooks/useChairpersonSuggestionMe";
import { ChairpersonSuggestion } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";

export default function ChairpersonSuggestionPage() {
  const router = useRouter();
  const iMId = router.query.id;
  const chairpersonSuggestion = useChairpersonSuggestionMe({
    id: iMId as string,
  });
  const chairpersonReview = useChairpersonReviewMe({ id: iMId as string });
  const [state, setState] = useState<useChairpersonSuggestionItemsOwnParams>({
    skip: 0,
    take: 10,
  });
  const chairpersonSuggestionItems = useChairpersonSuggestionItemsOwn(state);
  const handleSubmitReview = () => {
    if (!chairpersonSuggestion) return;
    axios
      .post(`/api/submitted_chairperson_suggestion`, {
        chairpersonSuggestionId: chairpersonSuggestion.id,
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
    if (!chairpersonSuggestion) return;

    setState((prev) => ({
      ...prev,
      id: chairpersonSuggestion.id,
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
      const submitSuggestionItem = async (chairpersonSuggestionId: string) => {
        return axios
          .post(`/api/chairperson_suggestion_item`, {
            ...values,
            chairpersonSuggestionId,
          })
          .then(() => {
            alert("Suggestion added successfully.");
            router.reload();
          });
      };

      if (!chairpersonSuggestion) {
        if (!chairpersonReview) {
          return;
        }
        return axios
          .post<ChairpersonSuggestion>(`/api/chairperson_suggestion/`, {
            chairpersonReviewId: chairpersonReview.id,
          })
          .then((res) => {
            const createdChairpersonSuggestion = res.data;

            return submitSuggestionItem(createdChairpersonSuggestion.id);
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        return submitSuggestionItem(chairpersonSuggestion.id);
      }
    },
  });

  return (
    <MainLayout>
      <div>
        <div className='flex justify-between'>
          <h2 className='inline'>Chairperson Review</h2>
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
            <caption>Chairperson Suggestions</caption>
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
            </tbody>
          </table>
        </div>
        <div>
          <IMPeerSuggestionItems id={iMId as string} editable={false} />
          <IMCoordinatorSuggestionItems id={iMId as string} editable={false} />
        </div>
        <button className='rounded border' onClick={handleSubmitReview}>
          Submit Review
        </button>
      </div>
    </MainLayout>
  );
}
