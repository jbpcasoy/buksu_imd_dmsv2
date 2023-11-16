import CoordinatorSuggestionItem from "@/components/CoordinatorSuggestionItem";
import IMChairpersonSuggestionItems from "@/components/IMChairpersonSuggestionItems";
import IMPeerSuggestionItems from "@/components/IMPeerSuggestionItems";
import MainLayout from "@/components/MainLayout";
import useCoordinatorReviewMe from "@/hooks/useCoordinatorReviewMe";
import useCoordinatorSuggestionItemsOwn, {
  useCoordinatorSuggestionItemsOwnParams,
} from "@/hooks/useCoordinatorSuggestionItemsOwn";
import useCoordinatorSuggestionMe from "@/hooks/useCoordinatorSuggestionMe";
import useDepartmentRevisionIM from "@/hooks/useDepartmentRevisionIM";
import useSubmittedCoordinatorSuggestionIM from "@/hooks/useSubmittedCoordinatorSuggestionIM";
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
  const departmentRevision = useDepartmentRevisionIM({ id: iMId as string });
  const submittedCoordinatorSuggestion = useSubmittedCoordinatorSuggestionIM({
    id: iMId as string,
  });
  const coordinatorSuggestionItems = useCoordinatorSuggestionItemsOwn(state);
  const handleNext = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return {
        ...prev,
        skip: nextVal <= coordinatorSuggestionItems.count ? nextVal : prev.skip,
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

  useEffect(() => {
    if (submittedCoordinatorSuggestion && departmentRevision) {
      router.push(`/im/${iMId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submittedCoordinatorSuggestion, departmentRevision, iMId]);

  return (
    <MainLayout>
      <div>
        <div className='flex justify-between'>
        <div>
          <h2 className='inline text-lg font-bold'>
            Instructional Material Review Form{" "}
            <span className='bg-palette_orange text-palette_white p-1 rounded'>
              Coordinator
            </span>
          </h2>
          <p className='text-sm'>Implementation Phase</p>
        </div>
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
            <caption>Coordinator Suggestions</caption>
            <thead>
              <tr>
                <th>id</th>
                <th>createdAt</th>
                <th>updatedAt</th>
                <th>suggestion</th>
                <th>pageNumber</th>
                <th>actionTaken</th>
                <th>remarks</th>
                <th>coordinatorSuggestionId</th>
                <th>actions</th>
              </tr>
            </thead>
            <tbody>
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
            </tbody>
          </table>
          <div className='flex justify-end space-x-1'>
            <p>
              {state.skip} - {state.skip + state.take} of{" "}
              {coordinatorSuggestionItems.count}
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
          <IMPeerSuggestionItems id={iMId as string} editable={false} />
          <IMChairpersonSuggestionItems id={iMId as string} editable={false} />
        </div>
        {!submittedCoordinatorSuggestion && (
          <button className='rounded border' onClick={handleSubmitReview}>
            Submit Review
          </button>
        )}
        {submittedCoordinatorSuggestion && (
          <Link className='rounded border' href={`/im/${iMId}`}>
            Finish
          </Link>
        )}
      </div>
    </MainLayout>
  );
}
