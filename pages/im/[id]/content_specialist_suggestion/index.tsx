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
import { ContentSpecialistSuggestion } from "@prisma/client";
import Link from "next/link";
import IMIDDSpecialistSuggestionItems from "@/components/IMIDDSpecialistSuggestionItems";
import IMContentEditorSuggestionItems from "@/components/IMContentEditorSuggestionItems";

export default function ContentSpecialistSuggestionPage() {
  const router = useRouter();
  const iMId = router.query.id;
  const contentSpecialistSuggestion = useContentSpecialistSuggestionMe({
    id: iMId as string,
  });
  const contentSpecialistReview = useContentSpecialistReviewMe({
    id: iMId as string,
  });
  const [state, setState] =
    useState<useContentSpecialistSuggestionItemsOwnParams>({
      skip: 0,
      take: 10,
    });
  const contentSpecialistSuggestionItems =
    useContentSpecialistSuggestionItemsOwn(state);
  const handleSubmitReview = () => {
    if (!contentSpecialistSuggestion) return;
    axios
      .post(`/api/submitted_content_specialist_suggestion`, {
        contentSpecialistSuggestionId: contentSpecialistSuggestion.id,
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
      const submitSuggestionItem = async (
        contentSpecialistSuggestionId: string
      ) => {
        return axios
          .post(`/api/content_specialist_suggestion_item`, {
            ...values,
            contentSpecialistSuggestionId,
          })
          .then(() => {
            alert("Suggestion added successfully.");
            router.reload();
          });
      };

      if (!contentSpecialistSuggestion) {
        if (!contentSpecialistReview) {
          return;
        }
        return axios
          .post<ContentSpecialistSuggestion>(
            `/api/content_specialist_suggestion/`,
            {
              contentSpecialistReviewId: contentSpecialistReview.id,
            }
          )
          .then((res) => {
            const createdContentSpecialistSuggestion = res.data;

            return submitSuggestionItem(createdContentSpecialistSuggestion.id);
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        return submitSuggestionItem(contentSpecialistSuggestion.id);
      }
    },
  });

  return (
    <MainLayout>
      <div>
        <div className='flex justify-between'>
          <h2 className='inline'>Content Specialist Review</h2>
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
            <caption>Content Specialist Suggestions</caption>
            <thead>
              <tr>
                <th>id</th>
                <th>createdAt</th>
                <th>updatedAt</th>
                <th>suggestion</th>
                <th>pageNumber</th>
                <th>actionTaken</th>
                <th>remarks</th>
                <th>contentSpecialistSuggestionId</th>
                <th>actions</th>
              </tr>
            </thead>
            <tbody>
              {contentSpecialistSuggestionItems.contentSpecialistSuggestionItems.map(
                (contentSpecialistSuggestionItem) => {
                  return (
                    <ContentSpecialistSuggestionItem
                      contentSpecialistSuggestionItem={
                        contentSpecialistSuggestionItem
                      }
                      key={contentSpecialistSuggestionItem.id}
                    />
                  );
                }
              )}
            </tbody>
          </table>
        </div>
        <div>
          {/* TODO add qamis suggestions */}
          <IMIDDSpecialistSuggestionItems
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
