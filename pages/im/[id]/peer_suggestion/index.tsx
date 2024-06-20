import Confirmation from "@/components/Confirmation";
import IMChairpersonSuggestionItems from "@/components/IMChairpersonSuggestionItems";
import IMCoordinatorSuggestionItems from "@/components/IMCoordinatorSuggestionItems";
import IMHeader from "@/components/IMHeader";
import Loading from "@/components/Loading";
import MainLayout from "@/components/MainLayout";
import Modal from "@/components/Modal";
import { SnackbarContext } from "@/components/SnackbarProvider";
import useActiveFacultyMe from "@/hooks/useActiveFacultyMe";
import useDepartmentRevisionIM from "@/hooks/useDepartmentRevisionIM";
import useIM from "@/hooks/useIM";
import usePeerReviewMe from "@/hooks/usePeerReviewMe";
import usePeerSuggestionItemsOwn, {
  usePeerSuggestionItemsOwnParams,
} from "@/hooks/usePeerSuggestionItemsOwn";
import usePeerSuggestionMe from "@/hooks/usePeerSuggestionMe";
import useRefresh from "@/hooks/useRefresh";
import useSubmittedPeerSuggestionIM from "@/hooks/useSubmittedPeerSuggestionIM";
import { PeerSuggestion, PeerSuggestionItem } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import Error from "next/error";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import * as Yup from "yup";

export default function PeerSuggestionPage() {
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
  const { refresh, refreshFlag } = useRefresh();
  const iMId = router.query.id;
  const iM = useIM({ id: iMId as string });
  const peerReview = usePeerReviewMe({ id: iMId as string });
  const [state, setState] = useState<usePeerSuggestionItemsOwnParams>({
    skip: 0,
    take: Number(process.env.NEXT_PUBLIC_MAX_QUERY_TAKE),
  });
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const departmentRevision = useDepartmentRevisionIM({ id: iMId as string });
  const submittedPeerSuggestion = useSubmittedPeerSuggestionIM({
    id: iMId as string,
  });
  const peerSuggestion = usePeerSuggestionMe(
    {
      id: iMId as string,
    },
    refreshFlag
  );
  const peerSuggestionItems = usePeerSuggestionItemsOwn(state, refreshFlag);
  const activeFaculty = useActiveFacultyMe();
  const { addSnackbar } = useContext(SnackbarContext);
  const [openAdd, setOpenAdd] = useState(false);

  const handleSubmitReview = () => {
    if (!peerSuggestion) return;
    axios
      .post(`/api/submitted_peer_suggestion`, {
        peerSuggestionId: peerSuggestion.id,
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
    if (!peerSuggestion) return;

    setState((prev) => ({
      ...prev,
      id: peerSuggestion.id,
    }));
  }, [peerSuggestion]);

  useEffect(() => {
    if (submittedPeerSuggestion && departmentRevision) {
      router.push(`/im/${iMId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submittedPeerSuggestion, departmentRevision, iMId]);

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
        const submitSuggestionItem = async (peerSuggestionId: string) => {
          return axios
            .post(`/api/peer_suggestion_item`, {
              ...values,
              peerSuggestionId,
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

        if (!peerSuggestion) {
          if (!peerReview) {
            return;
          }
          return axios
            .post<PeerSuggestion>(`/api/peer_suggestion/`, {
              peerReviewId: peerReview.id,
            })
            .then((res) => {
              const createdPeerSuggestion = res.data;

              return submitSuggestionItem(createdPeerSuggestion.id);
            })
            .catch((error) => {
              console.error(error);
            });
        } else {
          return submitSuggestionItem(peerSuggestion.id);
        }
      },
    });
    return (
      <>
        <button
          disabled={loading}
          onClick={() => setOpenAdd(true)}
          className="rounded-md font-semibold text-sm bg-palette_blue text-palette_white px-2 py-1 inline-flex items-center space-x-2 hover:bg-opacity-90"
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

  useEffect(() => {
    if (!iM || !activeFaculty) {
      return;
    }

    if (iM.facultyId === activeFaculty.facultyId) {
      router.replace(`/im/${iMId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iM, activeFaculty]);

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
          <IMHeader iM={iM} phase="Implementation Phase" role="Peer" />

          <div className="flex-1 h-full overflow-auto space-y-1">
            <div className="overflow-auto">
              <div className="border border-palette_light_grey rounded-lg text-sm">
                <div className="p-2 bg-palette_grey bg-opacity-10 flex items-center justify-between">
                  <p className="text-left font-medium">Peer Suggestions</p>
                  <AddSuggestionItem />
                </div>
                <hr />
                {peerSuggestionItems.peerSuggestionItems.map(
                  (peerSuggestionItem) => {
                    return (
                      <Item
                        peerSuggestionItem={peerSuggestionItem}
                        refresh={refresh}
                        key={peerSuggestionItem.id}
                      />
                    );
                  }
                )}
                {peerSuggestionItems.count < 1 && (
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
              <IMChairpersonSuggestionItems
                id={iMId as string}
                editable={false}
              />
            </div>
            <div className="flex justify-end pt-1">
              <button
                className="bg-palette_blue text-palette_white inline-flex space-x-2 items-center hover:bg-opacity-90 disabled:bg-palette_grey rounded-md text-sm font-semibold px-4 py-2"
                disabled={!Boolean(peerSuggestion) || loading}
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
  peerSuggestionItem: PeerSuggestionItem;
  refresh?: () => any;
}
export function Item({ peerSuggestionItem, refresh = () => { } }: ItemProps) {
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
      .delete(`/api/peer_suggestion_item/${peerSuggestionItem.id}`)
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
      });
  };
  return (
    <div className="px-1 py-2">
      <div className="flex justify-end item-center space-x-1">
        <EditSuggestionItem
          peerSuggestionItem={peerSuggestionItem}
          refresh={refresh}
        />
        <>
          <button
            disabled={loading}
            className="bg-palette_blue text-palette_white px-2 py-1 rounded text-sm inline-flex items-center space-x-1 justify-center hover:bg-opacity-90"
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
          {peerSuggestionItem.pageNumber}
        </p>
        <p className="px-5 py-1 border-r border-palette_light_grey col-span-2 md:col-span-1">
          Suggestion
        </p>
        <p className="px-5 flex-1 col-span-2 md:col-span-4 whitespace-pre-wrap">
          {peerSuggestionItem.suggestion}
        </p>
        <p className="px-5 py-1 border-r border-palette_light_grey col-span-2 md:col-span-1">
          Remarks
        </p>
        <p className="px-5 flex-1 col-span-2 md:col-span-4 whitespace-pre-wrap">
          {peerSuggestionItem.remarks}
        </p>
      </div>
    </div>
  );
}

interface EditSuggestionItemProps {
  peerSuggestionItem: PeerSuggestionItem;
  refresh?: () => any;
}
function EditSuggestionItem({
  peerSuggestionItem,
  refresh = () => { },
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
        .put(`/api/peer_suggestion_item/${peerSuggestionItem.id}`, values)
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
          setOpenEdit(false);
          refresh();
        });
    },
  });

  useEffect(() => {
    if (!peerSuggestionItem) return;
    formik.setValues({
      pageNumber: peerSuggestionItem.pageNumber,
      remarks: peerSuggestionItem?.remarks ?? "",
      suggestion: peerSuggestionItem.suggestion,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peerSuggestionItem]);

  return (
    <>
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
                className="bg-palette_blue text-white inline-flex items-center justify-center space-x-2 hover:bg-opacity-90 rounded-md text-sm font-semibold px-4 py-2"
              >
                <span>Submit</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
