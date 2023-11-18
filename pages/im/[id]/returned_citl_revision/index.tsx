import IMChairpersonSuggestionItems from "@/components/IMChairpersonSuggestionItems";
import IMCoordinatorSuggestionItems from "@/components/IMCoordinatorSuggestionItems";
import IMPeerSuggestionItems from "@/components/IMPeerSuggestionItems";
import IMReturnedCITLRevisionSuggestionItems from "@/components/IMReturnedCITLRevisionSuggestionItems";
import MainLayout from "@/components/MainLayout";
import Modal from "@/components/Modal";
import ReturnedCITLRevisionItem from "@/components/ReturnedCITLRevisionItem";
import useActiveIDDCoordinatorMe from "@/hooks/useActiveIDDCoordinatorMe";
import useCITLRevisionIM from "@/hooks/useCITLRevisionIM";
import useReturnedCITLRevisionMe from "@/hooks/useReturnedCITLRevisionMe";
import { useReturnedCITLRevisionSuggestionItemsIMParams } from "@/hooks/useReturnedCITLRevisionSuggestionItemsIM";
import useReturnedCITLRevisionSuggestionItemsOwn from "@/hooks/useReturnedCITLRevisionSuggestionItemsOwn";
import useSubmittedReturnedCITLRevisionReturnedCITLRevision from "@/hooks/useSubmittedReturnedCITLRevisionReturnedCITLRevision";
import { ReturnedCITLRevision } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as Yup from "yup";

export default function ReturnedCITLRevisionPage() {
  const router = useRouter();
  const iMId = router.query.id;
  const returnedCITLRevision = useReturnedCITLRevisionMe({
    id: iMId as string,
  });
  const activeIDDCoordinator = useActiveIDDCoordinatorMe();
  const [state, setState] =
    useState<useReturnedCITLRevisionSuggestionItemsIMParams>({
      skip: 0,
      take: 10,
    });
  const cITLRevision = useCITLRevisionIM({ id: iMId as string });
  const submittedReturnedCITLRevision =
    useSubmittedReturnedCITLRevisionReturnedCITLRevision({
      id: returnedCITLRevision?.id,
    });
  const returnedCITLRevisionSuggestionItems =
    useReturnedCITLRevisionSuggestionItemsOwn({
      ...state,
      id: returnedCITLRevision?.id,
    });
  const handleNext = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return {
        ...prev,
        skip:
          nextVal <= returnedCITLRevisionSuggestionItems.count
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
    if (!returnedCITLRevision) return;
    axios
      .post(`/api/submitted_returned_citl_revision`, {
        returnedCITLRevisionId: returnedCITLRevision.id,
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
    if (!returnedCITLRevision) return;

    setState((prev) => ({
      ...prev,
      id: returnedCITLRevision.id,
    }));
  }, [returnedCITLRevision]);

  useEffect(() => {
    if (submittedReturnedCITLRevision && cITLRevision) {
      router.push(`/im/${iMId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submittedReturnedCITLRevision, cITLRevision, iMId]);

  const AddSuggestion = () => {
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
        const submitSuggestionItem = async (returnedCITLRevisionId: string) => {
          return axios
            .post(`/api/returned_citl_revision_suggestion_item`, {
              ...values,
              returnedCITLRevisionId,
            })
            .then(() => {
              alert("Suggestion added successfully.");
              router.reload();
            });
        };

        if (!returnedCITLRevision) {
          if (!activeIDDCoordinator || !cITLRevision) {
            return;
          }
          return axios
            .post<ReturnedCITLRevision>(`/api/returned_citl_revision/`, {
              activeIDDCoordinatorId: activeIDDCoordinator.id,
              cITLRevisionId: cITLRevision.id,
            })
            .then((res) => {
              const createdCoordinatorSuggestion = res.data;

              return submitSuggestionItem(createdCoordinatorSuggestion.id);
            })
            .catch((error) => {
              console.error(error);
            });
        } else {
          return submitSuggestionItem(returnedCITLRevision.id);
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
          <Modal onClose={() => setOpenAdd(false)} title='Add Suggestion'>
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
                  className='bg-palette_blue text-palette_white border rounded py-1'
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
              Instructional Material Review{" "}
              <span className='bg-palette_orange text-palette_white p-1 rounded'>
                Returned CITL Revision
              </span>
            </h2>
            <p className='text-sm'>Implementation Phase</p>
          </div>

          <div>
            <AddSuggestion />
          </div>
        </div>

        <div>
          <table className='text-sm w-full'>
            <caption>SUGGESTIONS</caption>
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
              {returnedCITLRevisionSuggestionItems.returnedCITLRevisionSuggestionItems.map(
                (returnedCITLRevisionSuggestionItem) => {
                  return (
                    <ReturnedCITLRevisionItem
                      returnedCITLRevisionSuggestionItem={
                        returnedCITLRevisionSuggestionItem
                      }
                      key={returnedCITLRevisionSuggestionItem.id}
                    />
                  );
                }
              )}
            </tbody>
          </table>
          <div className='flex justify-end space-x-1'>
            <p>
              {state.skip} - {state.skip + state.take} of{" "}
              {returnedCITLRevisionSuggestionItems.count}
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
          <IMReturnedCITLRevisionSuggestionItems
            id={iMId as string}
            editable={false}
          />
        </div>
        <button
          className='rounded bg-palette_blue text-palette_white px-2 py-1'
          onClick={handleSubmitSuggestions}
        >
          Submit Review
        </button>
      </div>
    </MainLayout>
  );
}
