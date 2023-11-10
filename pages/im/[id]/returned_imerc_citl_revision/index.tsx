import IMChairpersonSuggestionItems from "@/components/IMChairpersonSuggestionItems";
import IMCoordinatorSuggestionItems from "@/components/IMCoordinatorSuggestionItems";
import IMPeerSuggestionItems from "@/components/IMPeerSuggestionItems";
import IMReturnedIMERCCITLRevisionSuggestionItems from "@/components/IMReturnedIMERCCITLRevisionSuggestionItems";
import MainLayout from "@/components/MainLayout";
import ReturnedIMERCCITLRevisionItem from "@/components/ReturnedIMERCCITLRevisionItem";
import useActiveIDDCoordinatorMe from "@/hooks/useActiveIDDCoordinatorMe";
import useIMERCCITLRevisionIM from "@/hooks/useIMERCCITLRevisionIM";
import useReturnedIMERCCITLRevisionMe from "@/hooks/useReturnedIMERCCITLRevisionMe";
import { useReturnedIMERCCITLRevisionSuggestionItemsIMParams } from "@/hooks/useReturnedIMERCCITLRevisionSuggestionItemsIM";
import useReturnedIMERCCITLRevisionSuggestionItemsOwn from "@/hooks/useReturnedIMERCCITLRevisionSuggestionItemsOwn";
import useSubmittedReturnedIMERCCITLRevisionReturnedIMERCCITLRevision from "@/hooks/useSubmittedReturnedIMERCCITLRevisionReturnedIMERCCITLRevision";
import { ReturnedIMERCCITLRevision } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";

export default function ReturnedIMERCCITLRevisionPage() {
  const router = useRouter();
  const iMId = router.query.id;
  const returnedIMERCCITLRevision = useReturnedIMERCCITLRevisionMe({
    id: iMId as string,
  });
  const activeIDDCoordinator = useActiveIDDCoordinatorMe();
  const [state, setState] =
    useState<useReturnedIMERCCITLRevisionSuggestionItemsIMParams>({
      skip: 0,
      take: 10,
    });
  const iMERCCITLRevision = useIMERCCITLRevisionIM({ id: iMId as string });
  const submittedReturnedIMERCCITLRevision =
    useSubmittedReturnedIMERCCITLRevisionReturnedIMERCCITLRevision({
      id: returnedIMERCCITLRevision?.id,
    });
  const returnedIMERCCITLRevisionSuggestionItems =
    useReturnedIMERCCITLRevisionSuggestionItemsOwn({
      ...state,
      id: returnedIMERCCITLRevision?.id,
    });
  const handleNext = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return {
        ...prev,
        skip:
          nextVal <= returnedIMERCCITLRevisionSuggestionItems.count
            ? nextVal
            : prev.skip,
      };
    });
  };

  const handlePrev = () => {
    setState((prev) => {
      const nextVal = prev.skip - prev.take;
      return { ...prev, skip: nextVal >= 0 ? nextVal : prev.skip };
    });
  };
  const handleSubmitSuggestions = () => {
    if (!returnedIMERCCITLRevision) return;
    axios
      .post(`/api/submitted_returned_imerc_citl_revision`, {
        returnedIMERCCITLRevisionId: returnedIMERCCITLRevision.id,
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
    if (!returnedIMERCCITLRevision) return;

    setState((prev) => ({
      ...prev,
      id: returnedIMERCCITLRevision.id,
    }));
  }, [returnedIMERCCITLRevision]);

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
      const submitSuggestionItem = async (returnedIMERCCITLRevisionId: string) => {
        return axios
          .post(`/api/returned_imerc_citl_revision_suggestion_item`, {
            ...values,
            returnedIMERCCITLRevisionId,
          })
          .then(() => {
            alert("Suggestion added successfully.");
            router.reload();
          });
      };

      if (!returnedIMERCCITLRevision) {
        if (!activeIDDCoordinator || !iMERCCITLRevision) {
          return;
        }
        return axios
          .post<ReturnedIMERCCITLRevision>(`/api/returned_imerc_citl_revision/`, {
            activeIDDCoordinatorId: activeIDDCoordinator.id,
            iMERCCITLRevisionId: iMERCCITLRevision.id,
          })
          .then((res) => {
            const createdCoordinatorSuggestion = res.data;

            return submitSuggestionItem(createdCoordinatorSuggestion.id);
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        return submitSuggestionItem(returnedIMERCCITLRevision.id);
      }
    },
  });

  useEffect(() => {
    if (submittedReturnedIMERCCITLRevision && iMERCCITLRevision) {
      router.push(`/im/${iMId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submittedReturnedIMERCCITLRevision, iMERCCITLRevision, iMId]);

  return (
    <MainLayout>
      <div>
        <div className='flex justify-between'>
          <h2 className='inline'>Return CITL Revision</h2>
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
            <caption>Suggestions</caption>
            <thead>
              <tr>
                <th>id</th>
                <th>createdAt</th>
                <th>updatedAt</th>
                <th>suggestion</th>
                <th>pageNumber</th>
                <th>actionTaken</th>
                <th>remarks</th>
                <th>returnedIMERCCITLRevisionId</th>
                <th>actions</th>
              </tr>
            </thead>
            <tbody>
              {returnedIMERCCITLRevisionSuggestionItems.returnedIMERCCITLRevisionSuggestionItems.map(
                (returnedIMERCCITLRevisionSuggestionItem) => {
                  return (
                    <ReturnedIMERCCITLRevisionItem
                      returnedIMERCCITLRevisionSuggestionItem={
                        returnedIMERCCITLRevisionSuggestionItem
                      }
                      key={returnedIMERCCITLRevisionSuggestionItem.id}
                    />
                  );
                }
              )}
            </tbody>
          </table>
          <div className='flex justify-end space-x-1'>
            <p>
              {state.skip} - {state.skip + state.take} of{" "}
              {returnedIMERCCITLRevisionSuggestionItems.count}
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
          <IMCoordinatorSuggestionItems id={iMId as string} editable={false} />
          <IMPeerSuggestionItems id={iMId as string} editable={false} />
          <IMChairpersonSuggestionItems id={iMId as string} editable={false} />
          <IMReturnedIMERCCITLRevisionSuggestionItems
            id={iMId as string}
            editable={false}
          />
        </div>
        <button className='rounded border' onClick={handleSubmitSuggestions}>
          Submit Review
        </button>
      </div>
    </MainLayout>
  );
}
