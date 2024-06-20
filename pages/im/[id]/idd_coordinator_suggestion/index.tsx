import Confirmation from "@/components/Confirmation";
import IMChairpersonSuggestionItems from "@/components/IMChairpersonSuggestionItems";
import IMCoordinatorSuggestionItems from "@/components/IMCoordinatorSuggestionItems";
import IMHeader from "@/components/IMHeader";
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
  const { refresh, refreshFlag } = useRefresh();
  const router = useRouter();
  const iMId = router.query.id;
  const iM = useIM({ id: iMId as string });
  const iDDCoordinatorSuggestion = useIDDCoordinatorSuggestionMe(
    {
      id: iMId as string,
    },
    refreshFlag
  );
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
      take: Number(process.env.NEXT_PUBLIC_MAX_QUERY_TAKE),
    }
  );
  const iDDCoordinatorSuggestionItems = useIDDCoordinatorSuggestionItemsOwn(
    state,
    refreshFlag
  );
  const activeIDDCoordinator = useActiveIDDCoordinatorMe();
  const [openAdd, setOpenAdd] = useState(false);
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
          disabled={loading}
          onClick={() => setOpenAdd(true)}
          className="bg-palette_blue text-palette_white inline-flex space-x-2 items-center hover:bg-opacity-90 rounded-md px-2 py-1 font-semibold text-sm"
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
          <Modal title="Add Suggestion" onClose={() => setOpenAdd(false)}>
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
      <div className="flex flex-col md:flex-row space-x-1 h-full md:overflow-auto md:space-x-4">
        <div className="md:flex-1 flex flex-col h-full md:overflow-auto bg-palette_white p-4 rounded-2xl space-y-4">
          <IMHeader
            iM={iM}
            phase="Implementation Phase"
            role="IDD Coordinator"
          />

          <div className="flex-1 h-full overflow-auto space-y-1">
            <div className="overflow-auto">
              <div className="border border-palette_light_grey rounded-lg text-sm">
                <div className="p-2 bg-palette_grey bg-opacity-10 flex justify-between items-center">
                  <p className="text-left font-medium">
                    IDD Coordinator Suggestions
                  </p>
                  <AddSuggestionItem />
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
                  <p className="text-center text-xs text-palette_error w-full p-4">
                    Suggestions are required
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-1">
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
            <div className="flex justify-end pt-1">
              <button
                className="bg-palette_blue text-palette_white inline-flex space-x-2 items-center hover:bg-opacity-90 disabled:bg-palette_grey rounded-md text-sm font-semibold px-4 py-2"
                disabled={!Boolean(iDDCoordinatorSuggestion) || loading}
                onClick={() => setOpenConfirmation(true)}
              >
                <span>Submit</span>
              </button>
              {openConfirmation && (
                <Confirmation
                  onClose={() => setOpenConfirmation(false)}
                  onConfirm={handleSubmitReview}
                />
              )}
            </div>
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
  iDDCoordinatorSuggestionItem: IDDCoordinatorSuggestionItem;
  refresh: () => any;
}
export function Item({ iDDCoordinatorSuggestionItem, refresh }: ItemProps) {
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
    <div className="px-1 py-2">
      <div className="flex justify-end items-center space-x-1">
        <EditSuggestionItem
          iDDCoordinatorSuggestionItem={iDDCoordinatorSuggestionItem}
          refresh={refresh}
        />
        <>
          <button
            disabled={loading}
            className="bg-palette_blue text-palette_white inline-flex items-center space-x-1 justify-center hover:bg-opacity-90 rounded-md text-sm px-2 py-1"
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
      <div className="grid grid-cols-5 text-palette_grey">
        <p className="px-5 py-1 border-r border-palette_light_grey col-span-2 md:col-span-1">
          Page No.
        </p>
        <p className="px-5 flex-1 col-span-2 md:col-span-4">
          {iDDCoordinatorSuggestionItem.pageNumber}
        </p>
        <p className="px-5 py-1 border-r border-palette_light_grey col-span-2 md:col-span-1">
          Suggestion
        </p>
        <p className="px-5 flex-1 col-span-2 md:col-span-4 whitespace-pre-wrap">
          {iDDCoordinatorSuggestionItem.suggestion}
        </p>
        <p className="px-5 py-1 border-r border-palette_light_grey col-span-2 md:col-span-1">
          Remarks
        </p>
        <p className="px-5 flex-1 col-span-2 md:col-span-4 whitespace-pre-wrap">
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
        disabled={loading}
        className="bg-palette_blue text-palette_white inline-flex items-center space-x-1 justify-center hover:bg-opacity-90 rounded text-sm px-2 py-1"
        onClick={() => setOpenEdit(true)}
      >
        <span>Edit</span>
      </button>
      {openEdit && (
        <Modal title="Coordinator Review" onClose={() => setOpenEdit(false)}>
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
