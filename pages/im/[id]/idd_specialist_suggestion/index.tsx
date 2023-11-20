import IDDSpecialistSuggestionItem from "@/components/IDDSpecialistSuggestionItem";
import IMContentEditorSuggestionItems from "@/components/IMContentEditorSuggestionItems";
import IMContentSpecialistSuggestionItems from "@/components/IMContentSpecialistSuggestionItems";
import IMQAMISSuggestionItems from "@/components/IMQAMISSuggestionItems";
import MainLayout from "@/components/MainLayout";
import Modal from "@/components/Modal";
import useIDDSpecialistReviewMe from "@/hooks/useIDDSpecialistReviewMe";
import useIDDSpecialistSuggestionItemsOwn, {
  useIDDSpecialistSuggestionItemsOwnParams,
} from "@/hooks/useIDDSpecialistSuggestionItemsOwn";
import useIDDSpecialistSuggestionMe from "@/hooks/useIDDSpecialistSuggestionMe";
import useIMERCCITLRevisionIM from "@/hooks/useIMERCCITLRevisionIM";
import useSubmittedIDDSpecialistSuggestionIM from "@/hooks/useSubmittedIDDSpecialistSuggestionIM";
import { IDDSpecialistSuggestion } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";

export default function IDDSpecialistSuggestionPage() {
  const router = useRouter();
  const iMId = router.query.id;
  const iDDSpecialistSuggestion = useIDDSpecialistSuggestionMe({
    id: iMId as string,
  });
  const iDDSpecialistReview = useIDDSpecialistReviewMe({ id: iMId as string });
  const iMERCCITLRevision = useIMERCCITLRevisionIM({ id: iMId as string });
  const submittedIDDSpecialistSuggestion =
    useSubmittedIDDSpecialistSuggestionIM({ id: iMId as string });
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

  const handleNext = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return {
        ...prev,
        skip:
          nextVal <= iDDSpecialistSuggestionItems.count ? nextVal : prev.skip,
      };
    });
  };

  const handlePrev = () => {
    setState((prev) => {
      const nextVal = prev.skip - prev.take;
      return { ...prev, skip: nextVal >= 0 ? nextVal : prev.skip };
    });
  };

  useEffect(() => {
    if (submittedIDDSpecialistSuggestion && iMERCCITLRevision) {
      router.push(`/im/${iMId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submittedIDDSpecialistSuggestion, iMERCCITLRevision, iMId]);

  const AddSuggestionItem = () => {
    const [openAdd, setOpenAdd] = useState(false);
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
      <>
        <button
          onClick={() => setOpenAdd(true)}
          className='bg-palette_blue text-palette_white px-2 py-1 rounded'
        >
          Add
        </button>
        {openAdd && (
          <Modal title='Add Suggestion' onClose={() => setOpenAdd(false)}>
            <form noValidate onSubmit={formik.handleSubmit}>
              <div className='flex flex-col space-y-1'>
                <textarea
                  placeholder='Suggestion'
                  {...formik.getFieldProps("suggestion")}
                  className='rounded'
                />
                <input
                  type='number'
                  placeholder='Page No.'
                  {...formik.getFieldProps("pageNumber")}
                  className='rounded'
                />
                <textarea
                  placeholder='Remarks'
                  {...formik.getFieldProps("remarks")}
                  className='rounded'
                />
                <input
                  type='submit'
                  value='Submit'
                  className='bg-palette_blue text-palette_white py-1 rounded'
                />
              </div>
            </form>
          </Modal>
        )}
      </>
    );
  };

  return (
    <MainLayout>
      <div className="space-y-1 px-1">
        <div className='flex justify-between'>
          <div>
            <h2 className='inline text-lg font-bold'>
              Instructional Material Review{" "}
              <span className='bg-palette_orange text-palette_white p-1 rounded'>
                IDD Specialist Specialist
              </span>
            </h2>
            <p className='text-sm'>IMERC Phase</p>
          </div>
          <div>
            <AddSuggestionItem />
          </div>
        </div>
        <div>
          <table className='w-full text-sm'>
            <caption>IDD Specialist Suggestions</caption>
            <thead>
              <tr>
                <th>LAST ACTIVITY</th>
                <th>SUGGESTION</th>
                <th>PAGE NUMBER</th>
                <th>ACTION TAKEN</th>
                <th>REMARKS</th>
                <th>ACTIONS</th>
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
          <div className='flex justify-end space-x-1'>
            <p>
              {state.skip} - {state.skip + state.take} of{" "}
              {iDDSpecialistSuggestionItems.count}
            </p>
            <button className='border rounded' onClick={handlePrev}>
              prev
            </button>
            <button className='border rounded' onClick={handleNext}>
              next
            </button>
          </div>
        </div>
        <div className="space-y-1">
          <IMQAMISSuggestionItems id={iMId as string} editable={false} />
          <IMContentSpecialistSuggestionItems
            id={iMId as string}
            editable={false}
          />
          <IMContentEditorSuggestionItems
            id={iMId as string}
            editable={false}
          />
        </div>
          <button className='bg-palette_blue text-palette_white px-2 py-1 rounded' onClick={handleSubmitReview}>
            Submit Review
          </button>
      </div>
    </MainLayout>
  );
}
