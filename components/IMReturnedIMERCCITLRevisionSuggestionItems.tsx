import useIDDCoordinator from "@/hooks/useIDDCoordinator";
import useRefresh from "@/hooks/useRefresh";
import useReturnedIMERCCITLRevision from "@/hooks/useReturnedIMERCCITLRevision";
import useReturnedIMERCCITLRevisionSuggestionItemActionTakenReturnedIMERCCITLRevisionSuggestionItem from "@/hooks/useReturnedIMERCCITLRevisionSuggestionItemActionTakenReturnedIMERCCITLRevisionSuggestionItem";
import useReturnedIMERCCITLRevisionSuggestionItemsIM from "@/hooks/useReturnedIMERCCITLRevisionSuggestionItemsIM";
import useSubmittedReturnedIMERCCITLRevisionIM from "@/hooks/useSubmittedReturnedIMERCCITLRevisionIM";
import useUser from "@/hooks/useUser";
import {
  ReturnedIMERCCITLRevisionSuggestionItem,
  SubmittedReturnedIMERCCITLRevision,
} from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import { DateTime } from "luxon";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import Modal from "./Modal";
import { SnackbarContext } from "./SnackbarProvider";

interface IMReturnedIMERCCITLRevisionSuggestionItemsProps {
  id: string;
  editable?: boolean;
}

export default function IMReturnedIMERCCITLRevisionSuggestionItems({
  id,
  editable = true,
}: IMReturnedIMERCCITLRevisionSuggestionItemsProps) {
  const [state, setState] = useState({
    skip: 0,
    take: Number(process.env.NEXT_PUBLIC_MAX_QUERY_TAKE),
    id,
  });

  const { data: session } = useSession();
  const { returnedIMERCCITLRevisionSuggestionItems, count } =
    useReturnedIMERCCITLRevisionSuggestionItemsIM(state);
  const submittedReturnedIMERCCITLRevision =
    useSubmittedReturnedIMERCCITLRevisionIM({
      id,
    });

  useEffect(() => {
    setState((prev) => ({ ...prev, id }));
  }, [id]);

  return (
    <div className="border border-palette_orange rounded-lg text-sm">
      <div className="p-2 bg-palette_grey bg-opacity-10">
        <p className="text-left font-bold">RETURNED IMERC CITL REVISION</p>
        {submittedReturnedIMERCCITLRevision && session?.user?.isAdmin && (
          <UserInformation
            submittedReturnedIMERCCITLRevision={
              submittedReturnedIMERCCITLRevision
            }
          />
        )}
      </div>
      <hr />
      {returnedIMERCCITLRevisionSuggestionItems.map(
        (returnedIMERCCITLRevisionSuggestionItem) => {
          return (
            <Item
              returnedIMERCCITLRevisionSuggestionItem={
                returnedIMERCCITLRevisionSuggestionItem
              }
              key={returnedIMERCCITLRevisionSuggestionItem.id}
              editable={editable}
            />
          );
        }
      )}
      {count < 1 && (
        <p className="text-center  font-bold p-5 text-palette_grey">
          NO SUGGESTIONS TO DISPLAY
        </p>
      )}
    </div>
  );
}

interface UserInformationProps {
  submittedReturnedIMERCCITLRevision: SubmittedReturnedIMERCCITLRevision;
}
function UserInformation({
  submittedReturnedIMERCCITLRevision,
}: UserInformationProps) {
  const returnedIMERCCITLRevision = useReturnedIMERCCITLRevision({
    id: submittedReturnedIMERCCITLRevision?.returnedIMERCCITLRevisionId,
  });
  const iDDCoordinator = useIDDCoordinator({
    id: returnedIMERCCITLRevision?.iDDCoordinatorId,
  });
  const user = useUser({
    id: iDDCoordinator?.userId,
  });
  return (
    <div className="flex flex-row items-center space-x-2">
      <img
        src={user?.image ?? "/images/buksu-logo-min-512x512.png"}
        onError={(e) => {
          e.currentTarget.src = "/images/buksu-logo-min-512x512.png";
        }}
        alt="User profile picture"
        className="h-8 w-8 rounded-full object-cover"
      />
      <div className="flex flex-col justify-between">
        <p>{user?.name}</p>
        <p className="text-xs">
          {DateTime.fromJSDate(
            new Date(submittedReturnedIMERCCITLRevision?.updatedAt ?? "")
          ).toFormat("D | t")}
        </p>
      </div>
    </div>
  );
}

function Item({
  returnedIMERCCITLRevisionSuggestionItem,
  editable,
}: {
  returnedIMERCCITLRevisionSuggestionItem: ReturnedIMERCCITLRevisionSuggestionItem;
  editable: boolean;
}) {
  const { refresh, refreshFlag } = useRefresh();
  const returnedIMERCCITLRevisionSuggestionItemActionTaken =
    useReturnedIMERCCITLRevisionSuggestionItemActionTakenReturnedIMERCCITLRevisionSuggestionItem(
      {
        id: returnedIMERCCITLRevisionSuggestionItem.id,
      },
      refreshFlag
    );

  return (
    <div className="px-1 py-2">
      {editable && (
        <div className="flex justify-end">
          <EditSuggestionItemActionTaken
            returnedIMERCCITLRevisionSuggestionItem={
              returnedIMERCCITLRevisionSuggestionItem
            }
            refresh={refresh}
            refreshFlag={refreshFlag}
          />
        </div>
      )}
      <div className="grid grid-cols-5">
        <p className="px-5 py-1 border-r border-palette_grey col-span-2 md:col-span-1">
          Page No.
        </p>
        <p className="px-5 flex-1 col-span-2 md:col-span-4">
          {returnedIMERCCITLRevisionSuggestionItem.pageNumber}
        </p>
        <p className="px-5 py-1 border-r border-palette_grey col-span-2 md:col-span-1">
          Suggestion
        </p>
        <p className="px-5 flex-1 col-span-2 md:col-span-4 whitespace-pre-wrap">
          {returnedIMERCCITLRevisionSuggestionItem.suggestion}
        </p>
        <p className="px-5 py-1 border-r border-palette_grey col-span-2 md:col-span-1">
          Remarks
        </p>
        <p className="px-5 flex-1 col-span-2 md:col-span-4 whitespace-pre-wrap">
          {returnedIMERCCITLRevisionSuggestionItem.remarks}
        </p>
        <p className="px-5 py-1 border-r border-palette_grey col-span-2 md:col-span-1">
          Action Taken
        </p>
        <p className="px-5 flex-1 col-span-2 md:col-span-4 whitespace-pre-wrap">
          {returnedIMERCCITLRevisionSuggestionItemActionTaken?.value ?? (
            <>
              {editable && (
                <p className="text-palette_error text-xs">Required *</p>
              )}
            </>
          )}
        </p>
      </div>
    </div>
  );
}

interface EditSuggestionItemActionTakenProps {
  returnedIMERCCITLRevisionSuggestionItem: ReturnedIMERCCITLRevisionSuggestionItem;
  refresh: () => any;
  refreshFlag?: number;
}

function EditSuggestionItemActionTaken({
  returnedIMERCCITLRevisionSuggestionItem,
  refresh,
  refreshFlag,
}: EditSuggestionItemActionTakenProps) {
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
  const returnedIMERCCITLRevisionSuggestionItemActionTaken =
    useReturnedIMERCCITLRevisionSuggestionItemActionTakenReturnedIMERCCITLRevisionSuggestionItem(
      {
        id: returnedIMERCCITLRevisionSuggestionItem.id as string,
      },
      refreshFlag
    );
  const { addSnackbar } = useContext(SnackbarContext);
  const formik = useFormik({
    initialValues: {
      value: "",
    },
    validationSchema: Yup.object({
      value: Yup.string().required(),
    }),
    onSubmit: (values) => {
      if (returnedIMERCCITLRevisionSuggestionItemActionTaken) {
        axios
          .put(
            `/api/returned_imerc_citl_revision_suggestion_item_action_taken/${returnedIMERCCITLRevisionSuggestionItemActionTaken.id}`,
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
      } else {
        axios
          .post(
            `/api/returned_imerc_citl_revision_suggestion_item_action_taken`,
            {
              returnedIMERCCITLRevisionSuggestionItemId:
                returnedIMERCCITLRevisionSuggestionItem.id,
              value: values.value,
            }
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
      }
    },
  });

  useEffect(() => {
    if (!returnedIMERCCITLRevisionSuggestionItemActionTaken) return;
    formik.setValues({
      value: returnedIMERCCITLRevisionSuggestionItemActionTaken.value ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returnedIMERCCITLRevisionSuggestionItemActionTaken]);

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
        <Modal title="Edit Action Taken" onClose={() => setOpenEdit(false)}>
          <form noValidate onSubmit={formik.handleSubmit}>
            <div className="flex flex-col space-y-1">
              <textarea
                placeholder="Action Taken"
                {...formik.getFieldProps("value")}
                className="rounded"
              />
              <button
                disabled={loading}
                type="submit"
                className="bg-palette_blue text-palette_white rounded px-2 py-1 flex items-center space-x-2 justify-center hover:bg-opacity-90"
              >
                <span>Submit</span>
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="1em"
                    viewBox="0 0 448 512"
                    className="fill-palette_white"
                  >
                    <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
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
