import Confirmation from "@/components/Confirmation";
import IMContentEditorSuggestionItems from "@/components/IMContentEditorSuggestionItems";
import IMHeader from "@/components/IMHeader";
import IMIDDSpecialistSuggestionItems from "@/components/IMIDDSpecialistSuggestionItems";
import IMQAMISSuggestionItems from "@/components/IMQAMISSuggestionItems";
import Loading from "@/components/Loading";
import MainLayout from "@/components/MainLayout";
import Modal from "@/components/Modal";
import { SnackbarContext } from "@/components/SnackbarProvider";
import useActiveContentSpecialistMe from "@/hooks/useActiveContentSpecialistMe";
import useContentSpecialistReviewMe from "@/hooks/useContentSpecialistReviewMe";
import useContentSpecialistSuggestionItemsOwn, {
  useContentSpecialistSuggestionItemsOwnParams,
} from "@/hooks/useContentSpecialistSuggestionItemsOwn";
import useContentSpecialistSuggestionMe from "@/hooks/useContentSpecialistSuggestionMe";
import useDepartmentIM from "@/hooks/useDepartmentIM";
import useDepartmentMe from "@/hooks/useDepartmentMe";
import useIM from "@/hooks/useIM";
import useRefresh from "@/hooks/useRefresh";
import useSubmittedContentSpecialistSuggestionIM from "@/hooks/useSubmittedContentSpecialistSuggestionIM";
import {
  ContentSpecialistSuggestion,
  ContentSpecialistSuggestionItem,
} from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import Error from "next/error";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import * as Yup from "yup";

export default function ContentSpecialistSuggestionPage() {
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
  const contentSpecialistSuggestion = useContentSpecialistSuggestionMe(
    {
      id: iMId as string,
    },
    refreshFlag
  );
  const contentSpecialistReview = useContentSpecialistReviewMe({
    id: iMId as string,
  });
  const { addSnackbar } = useContext(SnackbarContext);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [state, setState] =
    useState<useContentSpecialistSuggestionItemsOwnParams>({
      skip: 0,
      take: Number(process.env.NEXT_PUBLIC_MAX_QUERY_TAKE),
    });
  const submittedContentSpecialistSuggestion =
    useSubmittedContentSpecialistSuggestionIM({ id: iMId as string });
  const contentSpecialistSuggestionItems =
    useContentSpecialistSuggestionItemsOwn(state, refreshFlag);
  const activeContentSpecialist = useActiveContentSpecialistMe();
  const myDepartment = useDepartmentMe();
  const ownerDepartment = useDepartmentIM({ id: iMId as string });
  const [openAdd, setOpenAdd] = useState(false);

  const handleSubmitReview = () => {
    if (!contentSpecialistSuggestion) return;
    axios
      .post(`/api/submitted_content_specialist_suggestion`, {
        contentSpecialistSuggestionId: contentSpecialistSuggestion.id,
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
    if (!contentSpecialistSuggestion) return;

    setState((prev) => ({
      ...prev,
      id: contentSpecialistSuggestion.id,
    }));
  }, [contentSpecialistSuggestion]);

  useEffect(() => {
    if (submittedContentSpecialistSuggestion) {
      router.push(`/im/${iMId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submittedContentSpecialistSuggestion, iMId]);

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
          contentSpecialistSuggestionId: string
        ) => {
          return axios
            .post(`/api/content_specialist_suggestion_item`, {
              ...values,
              contentSpecialistSuggestionId,
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

        if (!contentSpecialistSuggestion) {
          if (!contentSpecialistReview) {
            return;
          }
          return axios
            .post<ContentSpecialistSuggestion>(
              `/api/content_specialist_suggestion/`,
              {
                contentSpecialistReviewId: contentSpecialistReview.id,
              }
            )
            .then((res) => {
              const createdContentSpecialistSuggestion = res.data;

              return submitSuggestionItem(
                createdContentSpecialistSuggestion.id
              );
            })
            .catch((error) => {
              console.error(error);
            });
        } else {
          return submitSuggestionItem(contentSpecialistSuggestion.id);
        }
      },
    });

    return (
      <div>
        <button
          disabled={loading}
          onClick={() => setOpenAdd(true)}
          className="bg-palette_blue text-palette_white inline-flex space-x-2 items-center hover:bg-opacity-90 rounded-md font-semibold text-sm px-2 py-1"
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
      </div>
    );
  };

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
    if (activeContentSpecialist === undefined) {
      return;
    }

    if (activeContentSpecialist === null) {
      addSnackbar(
        "Only content specialists are allowed for this action",
        "error"
      );
      router.replace(`/im/${iMId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeContentSpecialist]);

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
      <div className="flex flex-col md:flex-row space-x-1 h-full overflow-auto md:space-x-4">
        <div className="md:flex-1 flex flex-col md:h-full overflow-auto bg-palette_white p-4 rounded-2xl space-y-4">
          <IMHeader iM={iM} phase="IMERC Phase" role="Content Specialist" />

          <div className="flex-1 h-full overflow-auto space-y-1 flex flex-col">
            <div className="border border-palette_light_grey rounded text-sm">
              <div className="p-2 bg-palette_grey bg-opacity-10 flex justify-between items-center">
                <p className="text-left font-medium">
                  Content Specialist Suggestions
                </p>
                <AddSuggestionItem />
              </div>
              <hr />
              {contentSpecialistSuggestionItems.contentSpecialistSuggestionItems.map(
                (contentSpecialistSuggestionItem) => {
                  return (
                    <Item
                      contentSpecialistSuggestionItem={
                        contentSpecialistSuggestionItem
                      }
                      key={contentSpecialistSuggestionItem.id}
                      refresh={refresh}
                    />
                  );
                }
              )}
              {contentSpecialistSuggestionItems.count < 1 && (
                <p className="text-center text-xs text-palette_error w-full p-4">
                  Suggestions are required
                </p>
              )}
            </div>

            <div className="space-y-1">
              <IMQAMISSuggestionItems id={iMId as string} editable={false} />
              <IMIDDSpecialistSuggestionItems
                id={iMId as string}
                editable={false}
              />
              <IMContentEditorSuggestionItems
                id={iMId as string}
                editable={false}
              />
            </div>
            <div className="flex flex-col justify-end flex-1">
              <div className="flex justify-end">
                <button
                  className="bg-palette_blue text-palette_white inline-flex space-x-2 items-center hover:bg-opacity-90 disabled:bg-palette_grey rounded-md text-sm font-semibold px-4 py-2"
                  disabled={!Boolean(contentSpecialistSuggestion) || loading}
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
  contentSpecialistSuggestionItem: ContentSpecialistSuggestionItem;
  refresh: () => any;
}
export function Item({ contentSpecialistSuggestionItem, refresh }: ItemProps) {
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
  const router = useRouter();
  const handleDelete = () => {
    axios
      .delete(
        `/api/content_specialist_suggestion_item/${contentSpecialistSuggestionItem.id}`
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
          contentSpecialistSuggestionItem={contentSpecialistSuggestionItem}
          refresh={refresh}
        />
        <>
          <button
            disabled={loading}
            className="bg-palette_blue text-palette_white inline-flex items-center space-x-1 justify-center hover:bg-opacity-90 rounded px-2 py-1 text-sm"
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
          {contentSpecialistSuggestionItem.pageNumber}
        </p>
        <p className="px-5 py-1 border-r border-palette_light_grey col-span-2 md:col-span-1">
          Suggestion
        </p>
        <p className="px-5 flex-1 col-span-2 md:col-span-4 whitespace-pre-wrap">
          {contentSpecialistSuggestionItem.suggestion}
        </p>
        <p className="px-5 py-1 border-r border-palette_light_grey col-span-2 md:col-span-1">
          Remarks
        </p>
        <p className="px-5 flex-1 col-span-2 md:col-span-4 whitespace-pre-wrap">
          {contentSpecialistSuggestionItem.remarks}
        </p>
      </div>
    </div>
  );
}

interface EditSuggestionItemProps {
  contentSpecialistSuggestionItem: ContentSpecialistSuggestionItem;
  refresh: () => any;
}

function EditSuggestionItem({
  contentSpecialistSuggestionItem,
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
          `/api/content_specialist_suggestion_item/${contentSpecialistSuggestionItem.id}`,
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
    if (!contentSpecialistSuggestionItem) return;
    formik.setValues({
      pageNumber: contentSpecialistSuggestionItem.pageNumber,
      remarks: contentSpecialistSuggestionItem?.remarks ?? "",
      suggestion: contentSpecialistSuggestionItem.suggestion,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentSpecialistSuggestionItem]);

  return (
    <div>
      <button
        disabled={loading}
        className="bg-palette_blue text-palette_white inline-flex items-center space-x-1 justify-center hover:bg-opacity-90 rounded px-2 py-1 text-sm"
        onClick={() => setOpenEdit(true)}
      >
        <span>Edit</span>
      </button>
      {openEdit && (
        <Modal title="Edit Suggestion" onClose={() => setOpenEdit(false)}>
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
