import Confirmation from "@/components/Confirmation";
import IMChairpersonSuggestionItems from "@/components/IMChairpersonSuggestionItems";
import IMHeader from "@/components/IMHeader";
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
import useRefresh from "@/hooks/useRefresh";
import useSubmittedCoordinatorSuggestionIM from "@/hooks/useSubmittedCoordinatorSuggestionIM";
import {
  CoordinatorSuggestion,
  CoordinatorSuggestionItem,
} from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import Error from "next/error";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import * as Yup from "yup";

export default function CoordinatorSuggestionPage() {
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
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const coordinatorSuggestion = useCoordinatorSuggestionMe(
    {
      id: iMId as string,
    },
    refreshFlag
  );
  const coordinatorReview = useCoordinatorReviewMe({ id: iMId as string });
  const [state, setState] = useState<useCoordinatorSuggestionItemsOwnParams>({
    skip: 0,
    take: Number(process.env.NEXT_PUBLIC_MAX_QUERY_TAKE),
  });
  const departmentRevision = useDepartmentRevisionIM({ id: iMId as string });
  const submittedCoordinatorSuggestion = useSubmittedCoordinatorSuggestionIM({
    id: iMId as string,
  });
  const coordinatorSuggestionItems = useCoordinatorSuggestionItemsOwn(
    state,
    refreshFlag
  );
  const activeCoordinator = useActiveCoordinatorMe();
  const myDepartment = useDepartmentMe();
  const ownerDepartment = useDepartmentIM({
    id: iMId as string,
  });
  const { addSnackbar } = useContext(SnackbarContext);
  const [openAdd, setOpenAdd] = useState(false);

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
        addSnackbar(
          error.response.data?.error?.message ?? "Failed to submit review",
          "error"
        );
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myDepartment, ownerDepartment]);

  useEffect(() => {
    if (activeCoordinator === undefined) {
      return;
    }

    if (activeCoordinator === null) {
      addSnackbar("Only coordinators are allowed for this action", "error");
      router.replace(`/im/${iMId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCoordinator]);

  const AddSuggestionItem = () => {
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
              addSnackbar("Suggestion has been added successfully");
              refresh();
              setOpenAdd(false);
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
              refresh();
              setOpenAdd(false);
            });
        } else {
          return submitSuggestionItem(coordinatorSuggestion.id);
        }
      },
    });
    return (
      <>
        <button
          disabled={loading}
          onClick={() => setOpenAdd(true)}
          className="rounded-md font-semibold text-sm bg-palette_blue text-palette_white px-2 py-1 inline-flex space-x-2 items-center hover:bg-opacity-90"
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
                  className="w-full rounded"
                />
                <input
                  type="number"
                  placeholder="Page No."
                  {...formik.getFieldProps("pageNumber")}
                  className="w-full rounded"
                />
                <textarea
                  placeholder="Remarks (optional)"
                  {...formik.getFieldProps("remarks")}
                  className="w-full rounded"
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
      <div className="flex flex-col md:flex-row h-full overflow-auto md:space-x-4">
        <div className="md:flex-1 flex flex-col h-full overflow-auto rounded-2xl bg-palette_white p-4 space-y-4">
          <IMHeader iM={iM} phase="Implementation Phase" role="Coordinator" />

          <div className="flex-1 h-full overflow-auto space-y-1">
            <div className="overflow-auto">
              <div className="border border-palette_light_grey rounded-lg text-sm">
                <div className="p-2 bg-palette_grey bg-opacity-10 flex justify-between">
                  <p className="text-left font-medium">Coordinator Suggestions</p>
                  <AddSuggestionItem />
                </div>
                <hr />
                {coordinatorSuggestionItems.coordinatorSuggestionItems.map(
                  (coordinatorSuggestionItem) => {
                    return (
                      <Item
                        coordinatorSuggestionItem={coordinatorSuggestionItem}
                        key={coordinatorSuggestionItem.id}
                        refresh={refresh}
                      />
                    );
                  }
                )}
                {coordinatorSuggestionItems.count < 1 && (
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
            </div>
            <div className="flex justify-end pt-1">
              <button
                className="bg-palette_blue text-palette_white  inline-flex space-x-2 items-center hover:bg-opacity-90 disabled:bg-palette_grey rounded-md text-sm font-semibold px-4 py-2"
                disabled={!Boolean(coordinatorSuggestion) || loading}
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

interface ItemProps {
  coordinatorSuggestionItem: CoordinatorSuggestionItem;
  refresh: () => any;
}
function Item({ coordinatorSuggestionItem, refresh }: ItemProps) {
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
  const [state, setState] = useState({
    openConfirmation: false,
  });
  const { addSnackbar } = useContext(SnackbarContext);
  const handleDelete = () => {
    axios
      .delete(
        `/api/coordinator_suggestion_item/${coordinatorSuggestionItem.id}`
      )
      .then(() => {
        addSnackbar("Suggestion has been deleted successfully");
      })
      .catch((error) => {
        addSnackbar("Failed to delete suggestion", "error");
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
          coordinatorSuggestionItem={coordinatorSuggestionItem}
          refresh={refresh}
        />
        <>
          <button
            disabled={loading}
            className="bg-palette_blue text-palette_white py-1 px-2 rounded text-sm inline-flex items-center space-x-1 justify-center hover:bg-opacity-90"
            onClick={() =>
              setState((prev) => ({ ...prev, openConfirmation: true }))
            }
          >
            <span>Delete</span>
          </button>
          {state.openConfirmation && (
            <Confirmation
              onClose={() => setState((prev) => ({ openConfirmation: false }))}
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
          {coordinatorSuggestionItem.pageNumber}
        </p>
        <p className="px-5 py-1 border-r border-palette_light_grey col-span-2 md:col-span-1">
          Suggestion
        </p>
        <p className="px-5 flex-1 col-span-2 md:col-span-4 whitespace-pre-wrap">
          {coordinatorSuggestionItem.suggestion}
        </p>
        <p className="px-5 py-1 border-r border-palette_light_grey col-span-2 md:col-span-1">
          Remarks
        </p>
        <p className="px-5 flex-1 col-span-2 md:col-span-4 whitespace-pre-wrap">
          {coordinatorSuggestionItem.remarks}
        </p>
      </div>
    </div>
  );
}

interface EditSuggestionItemProps {
  coordinatorSuggestionItem: CoordinatorSuggestionItem;
  refresh: () => {};
}
function EditSuggestionItem({
  coordinatorSuggestionItem,
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
  const router = useRouter();
  const [openEdit, setOpenEdit] = useState(false);
  const { addSnackbar } = useContext(SnackbarContext);

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
          `/api/coordinator_suggestion_item/${coordinatorSuggestionItem.id}`,
          values
        )
        .then(() => {
          addSnackbar("Suggestion has been updated successfully");
        })
        .catch((error) => {
          addSnackbar("Failed to update suggestion", "error");
        })
        .finally(() => {
          refresh();
          setOpenEdit(false);
        });
    },
  });

  useEffect(() => {
    if (!coordinatorSuggestionItem) return;
    formik.setValues({
      pageNumber: coordinatorSuggestionItem.pageNumber,
      remarks: coordinatorSuggestionItem?.remarks ?? "",
      suggestion: coordinatorSuggestionItem.suggestion,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinatorSuggestionItem]);

  return (
    <div>
      <button
        disabled={loading}
        className="bg-palette_blue text-palette_white py-1 px-2 rounded text-sm inline-flex items-center space-x-1 justify-center hover:bg-opacity-90"
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
                className="bg-palette_blue text-white inline-flex items-center justify-center py-2 px-4 rounded-md font-semibold text-sm space-x-2 hover:bg-opacity-90 "
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
