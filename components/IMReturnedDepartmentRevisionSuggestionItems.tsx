import useCoordinator from "@/hooks/useCoordinator";
import useFaculty from "@/hooks/useFaculty";
import useRefresh from "@/hooks/useRefresh";
import useReturnedDepartmentRevision from "@/hooks/useReturnedDepartmentRevision";
import useReturnedDepartmentRevisionSuggestionItemActionTakenReturnedDepartmentRevisionSuggestionItem from "@/hooks/useReturnedDepartmentRevisionSuggestionItemActionTakenReturnedDepartmentRevisionSuggestionItem";
import useReturnedDepartmentRevisionSuggestionItemsIM from "@/hooks/useReturnedDepartmentRevisionSuggestionItemsIM";
import useSubmittedReturnedDepartmentRevisionIM from "@/hooks/useSubmittedReturnedDepartmentRevisionIM";
import useUser from "@/hooks/useUser";
import {
  ReturnedDepartmentRevisionSuggestionItem,
  SubmittedReturnedDepartmentRevision,
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

interface IMReturnedDepartmentRevisionSuggestionItemsProps {
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
  const { returnedDepartmentRevisionSuggestionItems, count } =
    useReturnedDepartmentRevisionSuggestionItemsIM(state);
  const submittedReturnedDepartmentRevision =
    useSubmittedReturnedDepartmentRevisionIM({
      id,
    });

  useEffect(() => {
    setState((prev) => ({ ...prev, id }));
  }, [id]);

  return (
    <div className="border border-palette_light_grey rounded-lg text-sm">
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
      {returnedDepartmentRevisionSuggestionItems.map(
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

      {count < 1 && (
        <p className="text-center  font-bold p-5 text-palette_grey">
          NO SUGGESTIONS TO DISPLAY
        </p>
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
        <p className="px-5 py-1 border-r border-palette_grey col-span-2 md:col-span-1">
          Page No.
        </p>
        <p className="px-5 flex-1 col-span-2 md:col-span-4">
          {returnedDepartmentRevisionSuggestionItem.pageNumber}
        </p>
        <p className="px-5 py-1 border-r border-palette_grey col-span-2 md:col-span-1">
          Suggestion
        </p>
        <p className="px-5 flex-1 col-span-2 md:col-span-4 whitespace-pre-wrap">
          {returnedDepartmentRevisionSuggestionItem.suggestion}
        </p>
        <p className="px-5 py-1 border-r border-palette_grey col-span-2 md:col-span-1">
          Remarks
        </p>
        <p className="px-5 flex-1 col-span-2 md:col-span-4 whitespace-pre-wrap">
          {returnedDepartmentRevisionSuggestionItem.remarks}
        </p>
        <p className="px-5 py-1 border-r border-palette_grey col-span-2 md:col-span-1">
          Action Taken
        </p>
        <p className="px-5 flex-1 col-span-2 md:col-span-4 whitespace-pre-wrap">
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
        className="bg-palette_blue text-palette_white inline-flex items-center space-x-1 justify-center hover:bg-opacity-90 rounded-md px-2 py-1 text-sm"
        onClick={() => setOpenEditActionTaken(true)}
      >
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
                className="bg-palette_blue text-palette_white flex items-center space-x-2 justify-center hover:bg-opacity-90 rounded-md px-4 py-2 text-sm font-semibold"
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
