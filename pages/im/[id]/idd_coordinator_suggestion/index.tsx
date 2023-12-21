import Confirmation from "@/components/Confirmation";
import IMChairpersonSuggestionItems from "@/components/IMChairpersonSuggestionItems";
import IMCoordinatorSuggestionItems from "@/components/IMCoordinatorSuggestionItems";
import IMPeerSuggestionItems from "@/components/IMPeerSuggestionItems";
import Loading from "@/components/Loading";
import MainLayout from "@/components/MainLayout";
import Modal from "@/components/Modal";
import { SnackbarContext } from "@/components/SnackbarProvider";
import useActiveIDDCoordinatorMe from "@/hooks/useActiveIDDCoordinatorMe";
import useCITLRevisionIM from "@/hooks/useCITLRevisionIM";
import useDeanEndorsementIM from "@/hooks/useDeanEndorsementIM";
import useIDDCoordinatorSuggestionItemsOwn, {
  useIDDCoordinatorSuggestionItemsOwnParams,
} from "@/hooks/useIDDCoordinatorSuggestionItemsOwn";
import useIDDCoordinatorSuggestionMe from "@/hooks/useIDDCoordinatorSuggestionMe";
import useIM from "@/hooks/useIM";
import useRefresh from "@/hooks/useRefresh";
import useSubmittedIDDCoordinatorSuggestionIM from "@/hooks/useSubmittedIDDCoordinatorSuggestionIM";
import {
  IDDCoordinatorSuggestion,
  IDDCoordinatorSuggestionItem,
} from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import Error from "next/error";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import * as Yup from "yup";

export default function IDDCoordinatorSuggestionPage() {
  const { refresh, refreshFlag } = useRefresh();
  const router = useRouter();
  const iMId = router.query.id;
  const iM = useIM({ id: iMId as string });
  const iDDCoordinatorSuggestion = useIDDCoordinatorSuggestionMe({
    id: iMId as string,
  }, refreshFlag);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const { addSnackbar } = useContext(SnackbarContext);
  const submittedIDDCoordinatorSuggestion =
    useSubmittedIDDCoordinatorSuggestionIM({
      id: iMId as string,
    });
  const deanEndorsement = useDeanEndorsementIM({ id: iMId as string });
  const cITLRevision = useCITLRevisionIM({ id: iMId as string });
  const [state, setState] = useState<useIDDCoordinatorSuggestionItemsOwnParams>(
    {
      skip: 0,
      take: 999,
    }
  );
  const iDDCoordinatorSuggestionItems = useIDDCoordinatorSuggestionItemsOwn(
    state,
    refreshFlag
  );
  const activeIDDCoordinator = useActiveIDDCoordinatorMe();
  const handleSubmitReview = () => {
    if (!iDDCoordinatorSuggestion) return;
    axios
      .post(`/api/submitted_idd_coordinator_suggestion`, {
        iDDCoordinatorSuggestionId: iDDCoordinatorSuggestion.id,
      })
      .then(() => {
        addSnackbar("Review Submitted Successfully");
        router.push(`/im/${iMId}`);
      })
      .catch((error: any) => {
        addSnackbar(
          error.response.data?.error?.message ?? "Failed to submit review",
          "error"
        );
      });
  };

  useEffect(() => {
    if (!iDDCoordinatorSuggestion) return;

    setState((prev) => ({
      ...prev,
      id: iDDCoordinatorSuggestion.id,
    }));
  }, [iDDCoordinatorSuggestion]);

  useEffect(() => {
    if (submittedIDDCoordinatorSuggestion && cITLRevision) {
      router.push(`/im/${iMId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submittedIDDCoordinatorSuggestion, cITLRevision, iMId]);

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
          iDDCoordinatorSuggestionId: string
        ) => {
          return axios
            .post(`/api/idd_coordinator_suggestion_item`, {
              ...values,
              iDDCoordinatorSuggestionId,
            })
            .then(() => {
              addSnackbar("Suggestion has been added successfully");
              refresh();
              setOpenAdd(false);
            })
            .catch((error) => {
              addSnackbar(
                error.response.data?.error?.message ??
                  "Failed to add suggestion",
                "error"
              );
            });
        };

        if (!iDDCoordinatorSuggestion) {
          if (!activeIDDCoordinator || !deanEndorsement) {
            return;
          }
          return axios
            .post<IDDCoordinatorSuggestion>(
              `/api/idd_coordinator_suggestion/`,
              {
                activeIDDCoordinatorId: activeIDDCoordinator.id,
                deanEndorsementId: deanEndorsement.id,
              }
            )
            .then((res) => {
              const createdIDDCoordinatorSuggestion = res.data;

              return submitSuggestionItem(createdIDDCoordinatorSuggestion.id);
            })
            .catch((error) => {
              console.error(error);
            });
        } else {
          return submitSuggestionItem(iDDCoordinatorSuggestion.id);
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
                  className='rounded'
                />
                <input
                  type='number'
                  placeholder='Page No.'
                  {...formik.getFieldProps("pageNumber")}
                  className='rounded'
                />
                <textarea
                  placeholder='Remarks (optional)'
                  {...formik.getFieldProps("remarks")}
                  className='rounded'
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

  useEffect(() => {
    if (activeIDDCoordinator === undefined) {
      return;
    }

    if (activeIDDCoordinator === null) {
      addSnackbar(
        "Only the IDD coordinator is allowed for this action",
        "error"
      );
      router.replace(`/im/${iMId}`);
    }
  }, [activeIDDCoordinator]);

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
      <div className='flex flex-col sm:flex-row space-x-1 h-full overflow-auto'>
        <div className='space-y-1 sm:flex-1 flex flex-col h-full overflow-auto'>
          <div className='flex justify-between'>
            <div>
              <h2 className='inline text-lg font-bold'>
                Instructional Material Review{" "}
                <span className='bg-palette_orange text-palette_white p-1 rounded'>
                  IDD Coordinator
                </span>
              </h2>
              <p className='text-sm'>Implementation Phase</p>
            </div>
            <div>
              <AddSuggestionItem />
            </div>
          </div>

          <div className='flex-1 h-full overflow-auto space-y-1'>
            <div className='overflow-auto'>
              <div className='border border-palette_orange rounded text-sm'>
                <div className='p-2 bg-palette_grey bg-opacity-10'>
                  <p className='text-left font-bold'>
                    IDD COORDINATOR SUGGESTIONS
                  </p>
                </div>
                <hr />
                {iDDCoordinatorSuggestionItems.iDDCoordinatorSuggestionItems.map(
                  (iDDCoordinatorSuggestionItem) => {
                    return (
                      <Item
                        iDDCoordinatorSuggestionItem={
                          iDDCoordinatorSuggestionItem
                        }
                        refresh={refresh}
                        key={iDDCoordinatorSuggestionItem.id}
                      />
                    );
                  }
                )}
                {iDDCoordinatorSuggestionItems.count < 1 && (
                  <p className='text-center text-xs text-palette_error w-full'>
                    Suggestions are required
                  </p>
                )}
              </div>
            </div>
            <div className='space-y-1'>
              <IMPeerSuggestionItems id={iMId as string} editable={false} />
              <IMChairpersonSuggestionItems
                id={iMId as string}
                editable={false}
              />
              <IMCoordinatorSuggestionItems
                id={iMId as string}
                editable={false}
              />
            </div>
            <>
              <button
                className='rounded bg-palette_blue text-palette_white px-2 py-1 inline-flex space-x-2 items-center hover:bg-opacity-90 disabled:bg-palette_grey'
                disabled={!Boolean(iDDCoordinatorSuggestion)}
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
        <div className='sm:flex-1 h-screen-3/4 sm:h-auto'>
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

export interface ItemProps {
  iDDCoordinatorSuggestionItem: IDDCoordinatorSuggestionItem;
  refresh: () => any;
}
export function Item({ iDDCoordinatorSuggestionItem, refresh }: ItemProps) {
  const { addSnackbar } = useContext(SnackbarContext);
  const router = useRouter();
  const [state, setState] = useState({
    openConfirmation: false,
  });
  const handleDelete = () => {
    axios
      .delete(
        `/api/idd_coordinator_suggestion_item/${iDDCoordinatorSuggestionItem.id}`
      )
      .then(() => {
        addSnackbar("Suggestion has been deleted successfully");
        refresh();
        setState((prev) => ({ ...prev, openConfirmation: false }));
      })
      .catch((error) => {
        console.error(error);
        addSnackbar(
          error.response.data?.error?.message ?? "Failed to delete suggestion",
          "error"
        );
      });
  };
  return (
    <div className='px-1 py-2'>
      <div className='flex justify-end items-center space-x-1'>
        <EditSuggestionItem
          iDDCoordinatorSuggestionItem={iDDCoordinatorSuggestionItem}
          refresh={refresh}
        />
        <>
          <button
            className='bg-palette_blue text-palette_white px-1 rounded text-sm inline-flex items-center space-x-1 justify-center hover:bg-opacity-90'
            onClick={() =>
              setState((prev) => ({ ...prev, openConfirmation: true }))
            }
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              height='16'
              width='14'
              viewBox='0 0 448 512'
              className='fill-palette_white'
            >
              <path d='M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z' />
            </svg>
            <span>Delete</span>
          </button>
          {state.openConfirmation && (
            <Confirmation
              onClose={() =>
                setState((prev) => ({ ...prev, openConfirmation: false }))
              }
              onConfirm={handleDelete}
            />
          )}
        </>
      </div>
      <div className='grid grid-cols-5'>
        <p className='px-5 py-1 border-r border-palette_grey col-span-2 sm:col-span-1'>
          Page No.
        </p>
        <p className='px-5 flex-1 col-span-2 sm:col-span-4'>
          {iDDCoordinatorSuggestionItem.pageNumber}
        </p>
        <p className='px-5 py-1 border-r border-palette_grey col-span-2 sm:col-span-1'>
          Suggestion
        </p>
        <p className='px-5 flex-1 col-span-2 sm:col-span-4 whitespace-pre-wrap'>
          {iDDCoordinatorSuggestionItem.suggestion}
        </p>
        <p className='px-5 py-1 border-r border-palette_grey col-span-2 sm:col-span-1'>
          Remarks
        </p>
        <p className='px-5 flex-1 col-span-2 sm:col-span-4 whitespace-pre-wrap'>
          {iDDCoordinatorSuggestionItem.remarks}
        </p>
      </div>
    </div>
  );
}

interface EditSuggestionItemProps {
  iDDCoordinatorSuggestionItem: IDDCoordinatorSuggestionItem;
  refresh: () => any;
}
function EditSuggestionItem({
  iDDCoordinatorSuggestionItem,
  refresh,
}: EditSuggestionItemProps) {
  const { addSnackbar } = useContext(SnackbarContext);
  const router = useRouter();
  const [openEdit, setOpenEdit] = useState(false);
  const formik = useFormik({
    initialValues: {
      suggestion: "",
      pageNumber: 0,
      remarks: "",
    },
    validationSchema: Yup.object({
      suggestion: Yup.string().required(),
      pageNumber: Yup.number().min(0).required(),
      remarks: Yup.string(),
    }),
    onSubmit: (values) => {
      axios
        .put(
          `/api/idd_coordinator_suggestion_item/${iDDCoordinatorSuggestionItem.id}`,
          values
        )
        .then(() => {
          addSnackbar("Suggestion has been updated successfully");
          refresh();
          setOpenEdit(false);
        })
        .catch((error) => {
          addSnackbar(
            error.response.data?.error?.message ?? "Failed to update snackbar",
            "error"
          );
        });
    },
  });

  useEffect(() => {
    if (!iDDCoordinatorSuggestionItem) return;
    formik.setValues({
      pageNumber: iDDCoordinatorSuggestionItem.pageNumber,
      remarks: iDDCoordinatorSuggestionItem?.remarks ?? "",
      suggestion: iDDCoordinatorSuggestionItem.suggestion,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iDDCoordinatorSuggestionItem]);

  return (
    <div>
      <button
        className='bg-palette_blue text-palette_white px-1 rounded text-sm inline-flex items-center space-x-1 justify-center hover:bg-opacity-90'
        onClick={() => setOpenEdit(true)}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          height='1em'
          viewBox='0 0 512 512'
          className='fill-palette_white'
        >
          <path d='M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z' />
        </svg>
        <span>Edit</span>
      </button>
      {openEdit && (
        <Modal title='Coordinator Review' onClose={() => setOpenEdit(false)}>
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
                placeholder='Remarks (optional)'
                {...formik.getFieldProps("remarks")}
                className='rounded'
              />
              <button
                type='submit'
                className='bg-palette_blue text-white rounded inline-flex items-center justify-center py-1 space-x-2 hover:bg-opacity-90'
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
    </div>
  );
}
