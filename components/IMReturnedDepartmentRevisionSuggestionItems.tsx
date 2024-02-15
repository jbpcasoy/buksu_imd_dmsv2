import useReturnedDepartmentRevisionSuggestionItemActionTakenReturnedDepartmentRevisionSuggestionItem from "@/hooks/useReturnedDepartmentRevisionSuggestionItemActionTakenReturnedDepartmentRevisionSuggestionItem";
import useReturnedDepartmentRevisionSuggestionItemsIM from "@/hooks/useReturnedDepartmentRevisionSuggestionItemsIM";
import {
  ReturnedDepartmentRevision,
  ReturnedDepartmentRevisionSuggestionItem,
  SubmittedReturnedDepartmentRevision,
} from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import { DateTime } from "luxon";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import Modal from "./Modal";
import { SnackbarContext } from "./SnackbarProvider";
import useSubmittedReturnedDepartmentRevision from "@/hooks/useSubmittedReturnedDepartmentRevision";
import useSubmittedReturnedDepartmentRevisionIM from "@/hooks/useSubmittedReturnedDepartmentRevisionIM";
import useReturnedDepartmentRevision from "@/hooks/useReturnedDepartmentRevision";
import useCoordinator from "@/hooks/useCoordinator";
import useFaculty from "@/hooks/useFaculty";
import useUser from "@/hooks/useUser";
import useRefresh from "@/hooks/useRefresh";
import { useSession } from "next-auth/react";

export interface IMReturnedDepartmentRevisionSuggestionItemsProps {
  id: string;
  editable?: boolean;
}

export default function IMReturnedDepartmentRevisionSuggestionItems({
  id,
  editable = true,
}: IMReturnedDepartmentRevisionSuggestionItemsProps) {
  const [state, setState] = useState({
    skip: 0,
    take: Number(process.env.NEXT_PUBLIC_MAX_QUERY_TAKE),
    id,
  });
  const { data: session } = useSession();
  const returnedDepartmentRevisionSuggestionItems =
    useReturnedDepartmentRevisionSuggestionItemsIM(state);
  const submittedReturnedDepartmentRevision =
    useSubmittedReturnedDepartmentRevisionIM({
      id,
    });

  useEffect(() => {
    setState((prev) => ({ ...prev, id }));
  }, [id]);

  return (
    <div className="border border-palette_orange rounded text-sm">
      <div className="p-2 bg-palette_grey bg-opacity-10">
        <p className="text-left font-bold">RETURNED DEPARTMENT REVISION</p>
        {submittedReturnedDepartmentRevision && session?.user?.isAdmin && (
          <UserInformation
            submittedReturnedDepartmentRevision={
              submittedReturnedDepartmentRevision
            }
          />
        )}
      </div>
      <hr />
      {returnedDepartmentRevisionSuggestionItems.returnedDepartmentRevisionSuggestionItems.map(
        (returnedDepartmentRevisionSuggestionItem) => {
          return (
            <Item
              returnedDepartmentRevisionSuggestionItem={
                returnedDepartmentRevisionSuggestionItem
              }
              key={returnedDepartmentRevisionSuggestionItem.id}
              editable={editable}
            />
          );
        }
      )}
    </div>
  );
}

interface UserInformationProps {
  submittedReturnedDepartmentRevision: SubmittedReturnedDepartmentRevision;
}
function UserInformation({
  submittedReturnedDepartmentRevision,
}: UserInformationProps) {
  const returnedDepartmentRevision = useReturnedDepartmentRevision({
    id: submittedReturnedDepartmentRevision?.returnedDepartmentRevisionId,
  });
  const coordinator = useCoordinator({
    id: returnedDepartmentRevision?.coordinatorId,
  });
  const faculty = useFaculty({
    id: coordinator?.facultyId,
  });
  const user = useUser({
    id: faculty?.userId,
  });
  return (
    <div className="flex flex-row items-center space-x-2">
      <img
        src={user?.image ?? ""}
        alt="User profile picture"
        className="h-8 w-8 rounded-full object-cover"
      />
      <div className="flex flex-col justify-between">
        <p>{user?.name}</p>
        <p className="text-xs">
          {DateTime.fromJSDate(
            new Date(submittedReturnedDepartmentRevision?.updatedAt ?? "")
          ).toFormat("D | t")}
        </p>
      </div>
    </div>
  );
}

function Item({
  returnedDepartmentRevisionSuggestionItem,
  editable,
}: {
  returnedDepartmentRevisionSuggestionItem: ReturnedDepartmentRevisionSuggestionItem;
  editable: boolean;
}) {
  const { refresh, refreshFlag } = useRefresh();
  const returnedDepartmentRevisionSuggestionItemActionTaken =
    useReturnedDepartmentRevisionSuggestionItemActionTakenReturnedDepartmentRevisionSuggestionItem(
      {
        id: returnedDepartmentRevisionSuggestionItem.id,
      },
      refreshFlag
    );

  return (
    <div className="px-1 py-2">
      {editable && (
        <div className="flex justify-end">
          <EditSuggestionItemActionTaken
            returnedDepartmentRevisionSuggestionItem={
              returnedDepartmentRevisionSuggestionItem
            }
            refresh={refresh}
            refreshFlag={refreshFlag}
          />
        </div>
      )}
      <div className="grid grid-cols-5">
        <p className="px-5 py-1 border-r border-palette_grey col-span-2 sm:col-span-1">
          Page No.
        </p>
        <p className="px-5 flex-1 col-span-2 sm:col-span-4">
          {returnedDepartmentRevisionSuggestionItem.pageNumber}
        </p>
        <p className="px-5 py-1 border-r border-palette_grey col-span-2 sm:col-span-1">
          Suggestion
        </p>
        <p className="px-5 flex-1 col-span-2 sm:col-span-4 whitespace-pre-wrap">
          {returnedDepartmentRevisionSuggestionItem.suggestion}
        </p>
        <p className="px-5 py-1 border-r border-palette_grey col-span-2 sm:col-span-1">
          Remarks
        </p>
        <p className="px-5 flex-1 col-span-2 sm:col-span-4 whitespace-pre-wrap">
          {returnedDepartmentRevisionSuggestionItem.remarks}
        </p>
        <p className="px-5 py-1 border-r border-palette_grey col-span-2 sm:col-span-1">
          Action Taken
        </p>
        <p className="px-5 flex-1 col-span-2 sm:col-span-4 whitespace-pre-wrap">
          {returnedDepartmentRevisionSuggestionItemActionTaken?.value ?? (
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
  returnedDepartmentRevisionSuggestionItem: ReturnedDepartmentRevisionSuggestionItem;
  refresh: () => any;
  refreshFlag?: number;
}
function EditSuggestionItemActionTaken({
  returnedDepartmentRevisionSuggestionItem,
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
  const { addSnackbar } = useContext(SnackbarContext);
  const [openEditActionTaken, setOpenEditActionTaken] = useState(false);
  const returnedDepartmentRevisionSuggestionItemActionTaken =
    useReturnedDepartmentRevisionSuggestionItemActionTakenReturnedDepartmentRevisionSuggestionItem(
      {
        id: returnedDepartmentRevisionSuggestionItem.id,
      },
      refreshFlag
    );
  const formik = useFormik({
    initialValues: {
      value: "",
    },
    validationSchema: Yup.object({
      value: Yup.string().required(),
    }),
    onSubmit: (values) => {
      if (returnedDepartmentRevisionSuggestionItemActionTaken) {
        axios
          .put(
            `/api/returned_department_revision_suggestion_item_action_taken/${returnedDepartmentRevisionSuggestionItemActionTaken.id}`,
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
            setOpenEditActionTaken(false);
          });
      } else {
        axios
          .post(
            `/api/returned_department_revision_suggestion_item_action_taken`,
            {
              returnedDepartmentRevisionSuggestionItemId:
                returnedDepartmentRevisionSuggestionItem.id,
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
            setOpenEditActionTaken(false);
          });
      }
    },
  });

  useEffect(() => {
    if (!returnedDepartmentRevisionSuggestionItemActionTaken) return;
    formik.setValues({
      value: returnedDepartmentRevisionSuggestionItemActionTaken.value ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returnedDepartmentRevisionSuggestionItemActionTaken]);

  return (
    <div>
      <button
        disabled={loading}
        className="bg-palette_blue text-palette_white px-1 rounded text-sm inline-flex items-center space-x-1 justify-center hover:bg-opacity-90"
        onClick={() => setOpenEditActionTaken(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="1em"
          viewBox="0 0 512 512"
          className="fill-palette_white"
        >
          <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
        </svg>
        <span>Edit</span>
      </button>
      {openEditActionTaken && (
        <Modal
          title="Edit Action Taken"
          onClose={() => setOpenEditActionTaken(false)}
        >
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
