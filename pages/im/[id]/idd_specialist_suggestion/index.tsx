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
import { IDDSpecialistSuggestion } from "@prisma/client";
import Link from "next/link";
import IMContentEditorSuggestionItems from "@/components/IMContentEditorSuggestionItems";
import IMContentSpecialistSuggestionItems from "@/components/IMContentSpecialistSuggestionItems";

export default function IDDSpecialistSuggestionPage() {
  const router = useRouter();
  const iMId = router.query.id;
  const iDDSpecialistSuggestion = useIDDSpecialistSuggestionMe({
    id: iMId as string,
  });
  const iDDSpecialistReview = useIDDSpecialistReviewMe({ id: iMId as string });
  const [state, setState] = useState<useIDDSpecialistSuggestionItemsOwnParams>({
    skip: 0,
    take: 10,
  });
  const iDDSpecialistSuggestionItems =
    useIDDSpecialistSuggestionItemsOwn(state);
  const handleSubmitReview = () => {
    if (!iDDSpecialistSuggestion) return;
    axios
      .post(`/api/submitted_idd_specialist_suggestion`, {
        iDDSpecialistSuggestionId: iDDSpecialistSuggestion.id,
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
      const submitSuggestionItem = async (
        iDDSpecialistSuggestionId: string
      ) => {
        return axios
          .post(`/api/idd_specialist_suggestion_item`, {
            ...values,
            iDDSpecialistSuggestionId,
          })
          .then(() => {
            alert("Suggestion added successfully.");
            router.reload();
          });
      };

      if (!iDDSpecialistSuggestion) {
        if (!iDDSpecialistReview) {
          return;
        }
        return axios
          .post<IDDSpecialistSuggestion>(`/api/idd_specialist_suggestion/`, {
            iDDSpecialistReviewId: iDDSpecialistReview.id,
          })
          .then((res) => {
            const createdIDDSpecialistSuggestion = res.data;

            return submitSuggestionItem(createdIDDSpecialistSuggestion.id);
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        return submitSuggestionItem(iDDSpecialistSuggestion.id);
      }
    },
  });

  return (
    <MainLayout>
      <div>
        <div className='flex justify-between'>
          <h2 className='inline'>IDD Specialist Review</h2>
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
            <caption>IDD Specialist Suggestions</caption>
            <thead>
              <tr>
                <th>id</th>
                <th>createdAt</th>
                <th>updatedAt</th>
                <th>suggestion</th>
                <th>pageNumber</th>
                <th>actionTaken</th>
                <th>remarks</th>
                <th>iDDSpecialistSuggestionId</th>
                <th>actions</th>
              </tr>
            </thead>
            <tbody>
              {iDDSpecialistSuggestionItems.iDDSpecialistSuggestionItems.map(
                (iDDSpecialistSuggestionItem) => {
                  return (
                    <IDDSpecialistSuggestionItem
                      iDDSpecialistSuggestionItem={iDDSpecialistSuggestionItem}
                      key={iDDSpecialistSuggestionItem.id}
                    />
                  );
                }
              )}
            </tbody>
          </table>
        </div>
        <div>
          <IMContentSpecialistSuggestionItems
            id={iMId as string}
            editable={false}
          />
          <IMContentEditorSuggestionItems
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
