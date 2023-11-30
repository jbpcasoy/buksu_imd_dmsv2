import Confirmation from "@/components/Confirmation";
import CoordinatorSuggestionItem from "@/components/CoordinatorSuggestionItem";
import IMChairpersonSuggestionItems from "@/components/IMChairpersonSuggestionItems";
import IMPeerSuggestionItems from "@/components/IMPeerSuggestionItems";
import Loading from "@/components/Loading";
import MainLayout from "@/components/MainLayout";
import Modal from "@/components/Modal";
import { SnackbarContext } from "@/components/SnackbarProvider";
import useActiveCoordinatorMe from "@/hooks/useActiveCoordinatorMe";
import useCoordinatorReviewMe from "@/hooks/useCoordinatorReviewMe";
import useCoordinatorSuggestionItemsOwn, {
  useCoordinatorSuggestionItemsOwnParams,
} from "@/hooks/useCoordinatorSuggestionItemsOwn";
import useCoordinatorSuggestionMe from "@/hooks/useCoordinatorSuggestionMe";
import useDepartmentIM from "@/hooks/useDepartmentIM";
import useDepartmentMe from "@/hooks/useDepartmentMe";
import useDepartmentRevisionIM from "@/hooks/useDepartmentRevisionIM";
import useIM from "@/hooks/useIM";
import useSubmittedCoordinatorSuggestionIM from "@/hooks/useSubmittedCoordinatorSuggestionIM";
import { CoordinatorSuggestion } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import Error from "next/error";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import * as Yup from "yup";

export default function CoordinatorSuggestionPage() {
  const router = useRouter();
  const iMId = router.query.id;
  const iM = useIM({ id: iMId as string });
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const coordinatorSuggestion = useCoordinatorSuggestionMe({
    id: iMId as string,
  });
  const coordinatorReview = useCoordinatorReviewMe({ id: iMId as string });
  const [state, setState] = useState<useCoordinatorSuggestionItemsOwnParams>({
    skip: 0,
    take: 999,
  });
  const departmentRevision = useDepartmentRevisionIM({ id: iMId as string });
  const submittedCoordinatorSuggestion = useSubmittedCoordinatorSuggestionIM({
    id: iMId as string,
  });
  const coordinatorSuggestionItems = useCoordinatorSuggestionItemsOwn(state);
  const activeCoordinator = useActiveCoordinatorMe();
  const myDepartment = useDepartmentMe();
  const ownerDepartment = useDepartmentIM({
    id: iMId as string,
  });
  const { addSnackbar } = useContext(SnackbarContext);

  const handleSubmitReview = () => {
    if (!coordinatorSuggestion) return;
    axios
      .post(`/api/submitted_coordinator_suggestion`, {
        coordinatorSuggestionId: coordinatorSuggestion.id,
      })
      .then(() => {
        addSnackbar("Review submitted successfully");
        router.push(`/im/${iMId}`);
      })
      .catch((error: any) => {
        addSnackbar("Failed to submit review", "error");
      });
  };

  useEffect(() => {
    if (!coordinatorSuggestion) return;

    setState((prev) => ({
      ...prev,
      id: coordinatorSuggestion.id,
    }));
  }, [coordinatorSuggestion]);

  useEffect(() => {
    if (submittedCoordinatorSuggestion && departmentRevision) {
      router.push(`/im/${iMId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submittedCoordinatorSuggestion, departmentRevision, iMId]);

  useEffect(() => {
    if (!myDepartment || !ownerDepartment) {
      return;
    }

    if (myDepartment.id !== ownerDepartment.id) {
      addSnackbar("Cannot review IM from other department", "error");
      router.replace(`/im/${iMId}`);
    }
  }, [myDepartment, ownerDepartment]);

  useEffect(() => {
    if (activeCoordinator === undefined) {
      return;
    }

    if (activeCoordinator === null) {
      addSnackbar("Only coordinators are allowed for this action", "error");
      router.replace(`/im/${iMId}`);
    }
  }, [activeCoordinator]);

  const AddSuggestionItem = () => {
    const [openAdd, setOpenAdd] = useState(false);
    const { addSnackbar } = useContext(SnackbarContext);
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
          coordinatorSuggestionId: string
        ) => {
          return axios
            .post(`/api/coordinator_suggestion_item`, {
              ...values,
              coordinatorSuggestionId,
            })
            .then(() => {
              addSnackbar("Suggestion added successfully.");
              router.reload();
            });
        };

        if (!coordinatorSuggestion) {
          if (!coordinatorReview) {
            console.log("No review");
            return;
          }
          return axios
            .post<CoordinatorSuggestion>(`/api/coordinator_suggestion/`, {
              coordinatorReviewId: coordinatorReview.id,
            })
            .then((res) => {
              submitSuggestionItem(res.data.id);
            })
            .catch(() => {
              addSnackbar("Failed to add suggestion", "error");
            })
            .finally(() => {
              router.reload();
            });
        } else {
          return submitSuggestionItem(coordinatorSuggestion.id);
        }
      },
    });
    return (
      <>
        <button
          onClick={() => setOpenAdd(true)}
          className='rounded bg-palette_blue text-palette_white px-2 py-1 inline-flex space-x-2 items-center hover:bg-opacity-90'
        >
          <span>Add</span>
          <span>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              height='1em'
              viewBox='0 0 448 512'
              className='fill-palette_white'
            >
              <path d='M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z' />
            </svg>
          </span>
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
                  placeholder='Page No.'
                  {...formik.getFieldProps("pageNumber")}
                  className='w-full rounded'
                />
                <textarea
                  placeholder='Remarks (optional)'
                  {...formik.getFieldProps("remarks")}
                  className='w-full rounded'
                />
                <button
                  type='submit'
                  className='bg-palette_blue text-palette_white rounded px-2 py-1 flex items-center space-x-2 justify-center hover:bg-opacity-90'
                >
                  <span>Submit</span>
                  <span>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      height='1em'
                      viewBox='0 0 448 512'
                      className='fill-palette_white'
                    >
                      <path d='M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z' />
                    </svg>
                  </span>
                </button>
              </div>
            </form>
          </Modal>
        )}
      </>
    );
  };

  if (iM === null) {
    return (
      <MainLayout>
        <Error statusCode={404} title='IM Not Found' />
      </MainLayout>
    );
  }
  if (iM === undefined) {
    return (
      <MainLayout>
        <Loading />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className='flex space-x-1 h-full overflow-auto'>
        <div className='space-y-1 flex-1 flex flex-col h-full overflow-auto'>
          <div className='flex justify-between'>
            <div>
              <h2 className='inline text-lg font-bold'>
                Instructional Material Review{" "}
                <span className='bg-palette_orange text-palette_white p-1 rounded'>
                  Coordinator
                </span>
              </h2>
              <p className='text-sm'>Implementation Phase</p>
            </div>
            <div>
              <AddSuggestionItem />
            </div>
          </div>

          <div className='flex-1 h-full overflow-auto space-y-1'>
            <div>
              <table className='text-sm w-full'>
                <caption className='text-xs'>COORDINATOR SUGGESTIONS</caption>
                <thead>
                  <tr>
                    <th>SUGGESTION</th>
                    <th>PAGE NUMBER</th>
                    <th>ACTION TAKEN</th>
                    <th>REMARKS</th>
                    <th>ACTIONS</th>
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
            </div>
            <div className='space-y-1'>
              <IMPeerSuggestionItems id={iMId as string} editable={false} />
              <IMChairpersonSuggestionItems
                id={iMId as string}
                editable={false}
              />
            </div>
            <>
              <button
                className='rounded bg-palette_blue text-palette_white px-2 py-1 inline-flex items-center space-x-2 hover:bg-opacity-90'
                onClick={() => setOpenConfirmation(true)}
              >
                <span>Submit Review</span>
                <span>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    height='1em'
                    viewBox='0 0 448 512'
                    className='fill-palette_white'
                  >
                    <path d='M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z' />
                  </svg>
                </span>
              </button>
              {openConfirmation && (
                <Confirmation
                  onClose={() => setOpenConfirmation(false)}
                  onConfirm={handleSubmitReview}
                />
              )}
            </>
          </div>
        </div>
        <div className='flex-1'>
          <iframe
            loading='lazy'
            src={`/api/im_file/im/${iMId}/pdf`}
            className='w-full h-full rounded'
          />
        </div>
      </div>
    </MainLayout>
  );
}
