import ChairpersonSuggestionItemComponent from "@/components/ChairpersonSuggestionItem";
import IMChairpersonSuggestionItems from "@/components/IMChairpersonSuggestionItems";
import IMPeerSuggestionItems from "@/components/IMPeerSuggestionItems";
import MainLayout from "@/components/MainLayout";
import Modal from "@/components/Modal";
import useChairpersonReviewMe from "@/hooks/useChairpersonReviewMe";
import useChairpersonSuggestionItemsOwn, {
  useChairpersonSuggestionItemsOwnParams,
} from "@/hooks/useChairpersonSuggestionItemsOwn";
import useChairpersonSuggestionMe from "@/hooks/useChairpersonSuggestionMe";
import useDepartmentRevisionIM from "@/hooks/useDepartmentRevisionIM";
import useSubmittedChairpersonSuggestionIM from "@/hooks/useSubmittedChairpersonSuggestionIM";
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
  const departmentRevision = useDepartmentRevisionIM({ id: iMId as string });
  const submittedChairpersonSuggestion = useSubmittedChairpersonSuggestionIM({
    id: iMId as string,
  });
  const chairpersonSuggestionItems = useChairpersonSuggestionItemsOwn(state);
  const handleNext = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return {
        ...prev,
        skip: nextVal <= chairpersonSuggestionItems.count ? nextVal : prev.skip,
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

  useEffect(() => {
    if (submittedChairpersonSuggestion && departmentRevision) {
      router.push(`/im/${iMId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submittedChairpersonSuggestion, departmentRevision, iMId]);

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
          chairpersonSuggestionId: string
        ) => {
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
      <>
        <button
          onClick={() => setOpenAdd(true)}
          className='rounded bg-palette_blue text-palette_white px-2 py-1'
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
                  className='w-full rounded'
                />
                <input
                  type='number'
                  placeholder='pageNumber'
                  {...formik.getFieldProps("pageNumber")}
                  className='w-full rounded'
                />
                <textarea
                  placeholder='Remarks'
                  {...formik.getFieldProps("remarks")}
                  className='w-full rounded'
                />
                <input
                  type='submit'
                  value='Submit'
                  className='bg-palette_blue text-palette_white rounded px-2 py-1'
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
      <div>
        <div className='flex justify-between'>
          <div>
            <h2 className='inline text-lg font-bold'>
              Instructional Material Review Form{" "}
              <span className='bg-palette_orange text-palette_white p-1 rounded'>
                Chairperson
              </span>
            </h2>
            <p className='text-sm'>Implementation Phase</p>
          </div>
          <div>
            <AddSuggestionItem />
          </div>
        </div>

        <div>
          <table className='text-sm w-full'>
            <caption className='text-xs'>CHAIRPERSON SUGGESTIONS</caption>
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
              {chairpersonSuggestionItems.chairpersonSuggestionItems.map(
                (chairpersonSuggestionItem) => {
                  return (
                    <ChairpersonSuggestionItemComponent
                      chairpersonSuggestionItem={chairpersonSuggestionItem}
                      key={chairpersonSuggestionItem.id}
                    />
                  );
                }
              )}
            </tbody>
          </table>
          <div className='flex justify-end space-x-1'>
            <p>
              {state.skip} - {state.skip + state.take} of{" "}
              {chairpersonSuggestionItems.count}
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
        {!submittedChairpersonSuggestion && (
          <button className='rounded border' onClick={handleSubmitReview}>
            Submit Review
          </button>
        )}
        {submittedChairpersonSuggestion && (
          <Link className='rounded border' href={`/im/${iMId}`}>
            Finish
          </Link>
        )}
      </div>
    </MainLayout>
  );
}
