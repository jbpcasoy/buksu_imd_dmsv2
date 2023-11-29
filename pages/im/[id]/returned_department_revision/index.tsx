import Confirmation from "@/components/Confirmation";
import IMChairpersonSuggestionItems from "@/components/IMChairpersonSuggestionItems";
import IMCoordinatorSuggestionItems from "@/components/IMCoordinatorSuggestionItems";
import IMPeerSuggestionItems from "@/components/IMPeerSuggestionItems";
import IMReturnedDepartmentRevisionSuggestionItems from "@/components/IMReturnedDepartmentRevisionSuggestionItems";
import MainLayout from "@/components/MainLayout";
import Modal from "@/components/Modal";
import ReturnedDepartmentRevisionItem from "@/components/ReturnedDepartmentRevisionItem";
import { SnackbarContext } from "@/components/SnackbarProvider";
import useActiveCoordinatorMe from "@/hooks/useActiveCoordinatorMe";
import useDepartmentRevisionIM from "@/hooks/useDepartmentRevisionIM";
import useReturnedDepartmentRevisionMe from "@/hooks/useReturnedDepartmentRevisionMe";
import { useReturnedDepartmentRevisionSuggestionItemsIMParams } from "@/hooks/useReturnedDepartmentRevisionSuggestionItemsIM";
import useReturnedDepartmentRevisionSuggestionItemsOwn from "@/hooks/useReturnedDepartmentRevisionSuggestionItemsOwn";
import useSubmittedReturnedDepartmentRevisionReturnedDepartmentRevision from "@/hooks/useSubmittedReturnedDepartmentRevisionReturnedDepartmentRevision";
import { ReturnedDepartmentRevision } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import * as Yup from "yup";

// TODO continue implementing icons, animation, confirmation and snackbar
export default function ReturnedDepartmentRevisionPage() {
  const router = useRouter();
  const iMId = router.query.id;
  const returnedDepartmentRevision = useReturnedDepartmentRevisionMe({
    id: iMId as string,
  });
  const activeCoordinator = useActiveCoordinatorMe();
  const [state, setState] =
    useState<useReturnedDepartmentRevisionSuggestionItemsIMParams>({
      skip: 0,
      take: 999,
    });
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const departmentRevision = useDepartmentRevisionIM({ id: iMId as string });
  const submittedReturnedDepartmentRevision =
    useSubmittedReturnedDepartmentRevisionReturnedDepartmentRevision({
      id: returnedDepartmentRevision?.id,
    });
  const returnedDepartmentRevisionSuggestionItems =
    useReturnedDepartmentRevisionSuggestionItemsOwn({
      ...state,
      id: returnedDepartmentRevision?.id,
    });
  const { addSnackbar } = useContext(SnackbarContext);

  const handleSubmitSuggestions = () => {
    if (!returnedDepartmentRevision) return;
    axios
      .post(`/api/submitted_returned_department_revision`, {
        returnedDepartmentRevisionId: returnedDepartmentRevision.id,
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
    if (!returnedDepartmentRevision) return;

    setState((prev) => ({
      ...prev,
      id: returnedDepartmentRevision.id,
    }));
  }, [returnedDepartmentRevision]);

  useEffect(() => {
    if (submittedReturnedDepartmentRevision && departmentRevision) {
      router.push(`/im/${iMId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submittedReturnedDepartmentRevision, departmentRevision, iMId]);

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
          returnedDepartmentRevisionId: string
        ) => {
          return axios
            .post(`/api/returned_department_revision_suggestion_item`, {
              ...values,
              returnedDepartmentRevisionId,
            })
            .then(() => {
              addSnackbar("Suggestion added successfully.");
            })
            .catch(() => {
              addSnackbar("Failed to add suggestion", "error");
            })
            .finally(() => {
              router.reload();
            });
        };

        if (!returnedDepartmentRevision) {
          if (!activeCoordinator || !departmentRevision) {
            return;
          }
          return axios
            .post<ReturnedDepartmentRevision>(
              `/api/returned_department_revision/`,
              {
                activeCoordinatorId: activeCoordinator.id,
                departmentRevisionId: departmentRevision.id,
              }
            )
            .then((res) => {
              const createdCoordinatorSuggestion = res.data;

              return submitSuggestionItem(createdCoordinatorSuggestion.id);
            })
            .catch((error) => {
              console.error(error);
            });
        } else {
          return submitSuggestionItem(returnedDepartmentRevision.id);
        }
      },
    });

    return (
      <>
        <button
          onClick={() => setOpenAdd(true)}
          className='rounded bg-palette_blue text-palette_white px-2 py-1 inline-flex items-center space-x-2 hover:bg-opacity-90'
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
          <Modal onClose={() => setOpenAdd(false)} title='Add Suggestion'>
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
                  placeholder='Remarks'
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

  return (
    <MainLayout>
      <div className='flex space-x-1 h-full overflow-auto'>
        <div className='space-y-1 flex-1 flex flex-col h-full overflow-auto'>
          <div className='flex justify-between'>
            <div>
              <h2 className='inline text-lg font-bold'>
                Instructional Material Review{" "}
                <span className='bg-palette_orange text-palette_white p-1 rounded'>
                  Returned Department Revision
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
                <caption>SUGGESTIONS</caption>
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
                  {returnedDepartmentRevisionSuggestionItems.returnedDepartmentRevisionSuggestionItems.map(
                    (returnedDepartmentRevisionSuggestionItem) => {
                      return (
                        <ReturnedDepartmentRevisionItem
                          returnedDepartmentRevisionSuggestionItem={
                            returnedDepartmentRevisionSuggestionItem
                          }
                          key={returnedDepartmentRevisionSuggestionItem.id}
                        />
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
            <div className='space-y-1'>
              <IMCoordinatorSuggestionItems
                id={iMId as string}
                editable={false}
              />
              <IMPeerSuggestionItems id={iMId as string} editable={false} />
              <IMChairpersonSuggestionItems
                id={iMId as string}
                editable={false}
              />
              <IMReturnedDepartmentRevisionSuggestionItems
                id={iMId as string}
                editable={false}
              />
            </div>
            <>
              <button
                className='rounded bg-palette_blue text-palette_white px-2 py-1 inline-flex space-x-2 items-center hover:bg-opacity-90'
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
                  onConfirm={handleSubmitSuggestions}
                />
              )}
            </>
          </div>
        </div>
        <div className='flex-1'>
          <iframe
            src={`/api/im_file/im/${iMId}/pdf`}
            className='w-full h-full rounded'
          />
        </div>
      </div>
    </MainLayout>
  );
}
