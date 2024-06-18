import Confirmation from "@/components/Confirmation";
import IMChairpersonSuggestionItems from "@/components/IMChairpersonSuggestionItems";
import IMCoordinatorSuggestionItems from "@/components/IMCoordinatorSuggestionItems";
import IMHeader from "@/components/IMHeader";
import IMPeerSuggestionItems from "@/components/IMPeerSuggestionItems";
import IMReturnedCITLRevisionSuggestionItems from "@/components/IMReturnedCITLRevisionSuggestionItems";
import Loading from "@/components/Loading";
import MainLayout from "@/components/MainLayout";
import Modal from "@/components/Modal";
import { SnackbarContext } from "@/components/SnackbarProvider";
import useActiveIDDCoordinatorMe from "@/hooks/useActiveIDDCoordinatorMe";
import useCITLRevisionIM from "@/hooks/useCITLRevisionIM";
import useIM from "@/hooks/useIM";
import useRefresh from "@/hooks/useRefresh";
import useReturnedCITLRevisionMe from "@/hooks/useReturnedCITLRevisionMe";
import { useReturnedCITLRevisionSuggestionItemsIMParams } from "@/hooks/useReturnedCITLRevisionSuggestionItemsIM";
import useReturnedCITLRevisionSuggestionItemsOwn from "@/hooks/useReturnedCITLRevisionSuggestionItemsOwn";
import useSubmittedReturnedCITLRevisionReturnedCITLRevision from "@/hooks/useSubmittedReturnedCITLRevisionReturnedCITLRevision";
import {
  ReturnedCITLRevision,
  ReturnedCITLRevisionSuggestionItem,
} from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import Error from "next/error";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import * as Yup from "yup";

export default function ReturnedCITLRevisionPage() {
  const [loading, setLoading] = useState(false);

  axios.interceptors.request.use(
    function (config) {
      setLoading(true);
      return config;
    },
    function (error) {
      console.log({ error });
      setLoading(false);
      return Promise.reject(error);
    }
  );
  axios.interceptors.response.use(
    function (response) {
      setLoading(false);
      return response;
    },
    function (error) {
      console.log({ error });
      setLoading(false);
      return Promise.reject(error);
    }
  );
  const router = useRouter();
  const iMId = router.query.id;
  const iM = useIM({
    id: iMId as string,
  });
  const { refresh, refreshFlag } = useRefresh();
  const returnedCITLRevision = useReturnedCITLRevisionMe(
    {
      id: iMId as string,
    },
    refreshFlag
  );
  const { addSnackbar } = useContext(SnackbarContext);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const activeIDDCoordinator = useActiveIDDCoordinatorMe();
  const [state, setState] =
    useState<useReturnedCITLRevisionSuggestionItemsIMParams>({
      skip: 0,
      take: Number(process.env.NEXT_PUBLIC_MAX_QUERY_TAKE),
    });
  const cITLRevision = useCITLRevisionIM({ id: iMId as string });
  const submittedReturnedCITLRevision =
    useSubmittedReturnedCITLRevisionReturnedCITLRevision({
      id: returnedCITLRevision?.id,
    });
  const returnedCITLRevisionSuggestionItems =
    useReturnedCITLRevisionSuggestionItemsOwn(
      {
        ...state,
        id: returnedCITLRevision?.id,
      },
      refreshFlag
    );
  const handleSubmitSuggestions = () => {
    if (!returnedCITLRevision) return;
    axios
      .post(`/api/submitted_returned_citl_revision`, {
        returnedCITLRevisionId: returnedCITLRevision.id,
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
              addSnackbar("Suggestion has been added successfully");
            })
            .catch((error) => {
              addSnackbar(
                error.response.data?.error?.message ??
                "Failed to add suggestion",
                "error"
              );
            })
            .finally(() => {
              refresh();
              setOpenAdd(false);
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
          disabled={loading}
          onClick={() => setOpenAdd(true)}
          className="rounded bg-palette_blue text-palette_white px-2 py-1 inline-flex items-center space-x-2 hover:bg-opacity-90"
        >
          <span>Add</span>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 448 512"
              className="fill-palette_white"
            >
              <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
            </svg>
          </span>
        </button>
        {openAdd && (
          <Modal onClose={() => setOpenAdd(false)} title="Add Suggestion">
            <form noValidate onSubmit={formik.handleSubmit}>
              <div className="flex flex-col space-y-1">
                <textarea
                  placeholder="Suggestion"
                  {...formik.getFieldProps("suggestion")}
                  className="rounded"
                />
                <input
                  type="number"
                  placeholder="Page No."
                  {...formik.getFieldProps("pageNumber")}
                  className="rounded"
                />
                <textarea
                  placeholder="Remarks (optional)"
                  {...formik.getFieldProps("remarks")}
                  className="rounded"
                />
                <button
                  disabled={loading}
                  type="submit"
                  className="bg-palette_blue text-palette_white flex items-center space-x-2 justify-center hover:bg-opacity-90 rounded-md text-sm font-semibold px-4 py-2"
                >
                  <span>Submit</span>
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIDDCoordinator]);

  if (iM === null) {
    return (
      <MainLayout>
        <Error statusCode={404} title="IM Not Found" />
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
      <div className="flex flex-col md:flex-row h-full md:overflow-auto md:space-x-4">
        <div className="md:flex-1 flex flex-col h-full md:overflow-auto bg-palette_white p-4 rounded-2xl space-y-4">
          <IMHeader
            iM={iM}
            phase="Implementation Phase"
            role="IDD Coordinator"
          />

          <div className="flex-1 h-full overflow-auto space-y-1">
            <div className="overflow-auto">
              <div className="border border-palette_orange rounded-lg text-sm">
                <div className="p-2 bg-palette_grey bg-opacity-10 flex justify-between items-center">
                  <p className="text-left font-bold">RETURNED CITL REVISION</p>
                  <AddSuggestion />
                </div>
                <hr />
                {returnedCITLRevisionSuggestionItems.returnedCITLRevisionSuggestionItems.map(
                  (returnedCITLRevisionSuggestionItem) => {
                    return (
                      <Item
                        returnedCITLRevisionSuggestionItem={
                          returnedCITLRevisionSuggestionItem
                        }
                        key={returnedCITLRevisionSuggestionItem.id}
                        refresh={refresh}
                      />
                    );
                  }
                )}
                {returnedCITLRevisionSuggestionItems.count < 1 && (
                  <p className="text-center text-xs text-palette_error w-full p-4">
                    Suggestions are required
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <IMCoordinatorSuggestionItems
                id={iMId as string}
                editable={false}
              />
              <IMPeerSuggestionItems id={iMId as string} editable={false} />
              <IMChairpersonSuggestionItems
                id={iMId as string}
                editable={false}
              />
              <IMReturnedCITLRevisionSuggestionItems
                id={iMId as string}
                editable={false}
              />
            </div>

            <>
              <button
                className="bg-palette_blue text-palette_white inline-flex space-x-2 items-center hover:bg-opacity-90 disabled:bg-palette_grey rounded-md text-sm font-semibold px-4 py-2"
                disabled={!Boolean(returnedCITLRevision) || loading}
                onClick={() => setOpenConfirmation(true)}
              >
                <span>Submit</span>
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
        <div className="md:flex-1 h-screen-3/4 md:h-auto">
          <iframe
            loading="lazy"
            src={`/api/im_file/im/${iMId}/pdf`}
            className="w-full h-full"
          />
        </div>
      </div>
    </MainLayout>
  );
}

export interface ItemProps {
  returnedCITLRevisionSuggestionItem: ReturnedCITLRevisionSuggestionItem;
  refresh: () => any;
}
export function Item({
  returnedCITLRevisionSuggestionItem,
  refresh,
}: ItemProps) {
  const [loading, setLoading] = useState(false);

  axios.interceptors.request.use(
    function (config) {
      setLoading(true);
      return config;
    },
    function (error) {
      console.log({ error });
      setLoading(false);
      return Promise.reject(error);
    }
  );
  axios.interceptors.response.use(
    function (response) {
      setLoading(false);
      return response;
    },
    function (error) {
      console.log({ error });
      setLoading(false);
      return Promise.reject(error);
    }
  );
  const router = useRouter();
  const { addSnackbar } = useContext(SnackbarContext);
  const [state, setState] = useState({
    openConfirmation: false,
  });
  const handleDelete = () => {
    axios
      .delete(
        `/api/returned_citl_revision_suggestion_item/${returnedCITLRevisionSuggestionItem.id}`
      )
      .then(() => {
        addSnackbar("Suggestion has been deleted successfully");
      })
      .catch((error) => {
        addSnackbar(
          error.response.data?.error?.message ?? "Failed to delete suggestion",
          "error"
        );
      })
      .finally(() => {
        refresh();
        setState((prev) => ({ ...prev, openConfirmation: false }));
      });
  };
  return (
    <div className="px-1 py-2">
      <div className="flex justify-end items-center space-x-1">
        <EditSuggestionItem
          returnedCITLRevisionSuggestionItem={
            returnedCITLRevisionSuggestionItem
          }
          refresh={refresh}
        />
        <>
          <button
            disabled={loading}
            className="bg-palette_blue text-palette_white px-1 rounded text-sm inline-flex items-center space-x-1 justify-center hover:bg-opacity-90"
            onClick={() =>
              setState((prev) => ({ ...prev, openConfirmation: true }))
            }
          >
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
      <div className="grid grid-cols-5">
        <p className="px-5 py-1 border-r border-palette_grey col-span-2 md:col-span-1">
          Page No.
        </p>
        <p className="px-5 flex-1 col-span-2 md:col-span-4">
          {returnedCITLRevisionSuggestionItem.pageNumber}
        </p>
        <p className="px-5 py-1 border-r border-palette_grey col-span-2 md:col-span-1">
          Suggestion
        </p>
        <p className="px-5 flex-1 col-span-2 md:col-span-4 whitespace-pre-wrap">
          {returnedCITLRevisionSuggestionItem.suggestion}
        </p>
        <p className="px-5 py-1 border-r border-palette_grey col-span-2 md:col-span-1">
          Remarks
        </p>
        <p className="px-5 flex-1 col-span-2 md:col-span-4 whitespace-pre-wrap">
          {returnedCITLRevisionSuggestionItem.remarks}
        </p>
      </div>
    </div>
  );
}

interface EditSuggestionItemProps {
  returnedCITLRevisionSuggestionItem: ReturnedCITLRevisionSuggestionItem;
  refresh: () => any;
}
function EditSuggestionItem({
  returnedCITLRevisionSuggestionItem,
  refresh,
}: EditSuggestionItemProps) {
  const [loading, setLoading] = useState(false);

  axios.interceptors.request.use(
    function (config) {
      setLoading(true);
      return config;
    },
    function (error) {
      console.log({ error });
      setLoading(false);
      return Promise.reject(error);
    }
  );
  axios.interceptors.response.use(
    function (response) {
      setLoading(false);
      return response;
    },
    function (error) {
      console.log({ error });
      setLoading(false);
      return Promise.reject(error);
    }
  );
  const { addSnackbar } = useContext(SnackbarContext);
  const [openEdit, setOpenEdit] = useState(false);
  const router = useRouter();
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
          `/api/returned_citl_revision_suggestion_item/${returnedCITLRevisionSuggestionItem.id}`,
          values
        )
        .then(() => {
          addSnackbar("Suggestion has been updated successfully");
        })
        .catch((error) => {
          addSnackbar(
            error.response.data?.error?.message ??
            "Failed to update suggestion",
            "error"
          );
        })
        .finally(() => {
          refresh();
          setOpenEdit(false);
        });
    },
  });

  useEffect(() => {
    if (!returnedCITLRevisionSuggestionItem) return;
    formik.setValues({
      pageNumber: returnedCITLRevisionSuggestionItem.pageNumber,
      remarks: returnedCITLRevisionSuggestionItem?.remarks ?? "",
      suggestion: returnedCITLRevisionSuggestionItem.suggestion,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returnedCITLRevisionSuggestionItem]);

  return (
    <div>
      <button
        disabled={loading}
        className="bg-palette_blue text-palette_white px-1 rounded text-sm inline-flex items-center space-x-1 justify-center hover:bg-opacity-90"
        onClick={() => setOpenEdit(true)}
      >
        <span>Edit</span>
      </button>
      {openEdit && (
        <Modal title="Edit Suggestion Item" onClose={() => setOpenEdit(false)}>
          <form noValidate onSubmit={formik.handleSubmit}>
            <div className="flex flex-col space-y-1">
              <textarea
                placeholder="Suggestion"
                {...formik.getFieldProps("suggestion")}
                className="rounded"
              />
              <input
                type="number"
                placeholder="Page No."
                {...formik.getFieldProps("pageNumber")}
                className="rounded"
              />
              <textarea
                placeholder="Remarks (optional)"
                {...formik.getFieldProps("remarks")}
                className="rounded"
              />
              <button
                disabled={loading}
                type="submit"
                className="bg-palette_blue text-white inline-flex items-center justify-center space-x-2 hover:bg-opacity-90 rounded-md text-sm font-semibold px-4 py-2"
              >
                <span>Submit</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
