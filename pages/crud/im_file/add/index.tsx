import CrudLayout from "@/components/CrudLayout";
import { fi } from "@faker-js/faker";
import axios from "axios";
import { ChangeEventHandler, useState } from "react";

export default function AddIMFile() {
  const [state, setState] = useState<{
    file?: File;
    iMId?: string;
    departmentReviewedId?: string;
    submittedReturnedDepartmentRevisionId?: string;
    submittedIDDCoordinatorSuggestionId?: string;
    submittedReturnedCITLRevisionId?: string;
    submittedQAMISSuggestionId?: string;
    iMERCCITLReviewedId?: string;
    submittedReturnedIMERCCITLRevisionId?: string;
  } | null>();

  const onFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setState((prev) => ({ ...prev, file: e.target.files?.item(0) as File }));
  };

  const uploadFileHandler = () => {
    console.log({ state });
    if (!state?.file || !state?.iMId) return;

    const formData = new FormData();
    formData.append("file", state.file);
    formData.append("iMId", state.iMId as string);
    if (state.departmentReviewedId) {
      formData.append(
        "departmentReviewedId",
        state.departmentReviewedId as string
      );
    }
    if (state.submittedReturnedDepartmentRevisionId) {
      formData.append(
        "submittedReturnedDepartmentRevisionId",
        state.submittedReturnedDepartmentRevisionId as string
      );
    }
    if (state.submittedIDDCoordinatorSuggestionId) {
      formData.append(
        "submittedIDDCoordinatorSuggestionId",
        state.submittedIDDCoordinatorSuggestionId as string
      );
    }
    if (state.submittedReturnedCITLRevisionId) {
      formData.append(
        "submittedReturnedCITLRevisionId",
        state.submittedReturnedCITLRevisionId as string
      );
    }
    if (state.submittedQAMISSuggestionId) {
      formData.append(
        "submittedQAMISSuggestionId",
        state.submittedQAMISSuggestionId as string
      );
    }
    if (state.iMERCCITLReviewedId) {
      formData.append(
        "iMERCCITLReviewedId",
        state.iMERCCITLReviewedId as string
      );
    }
    if (state.submittedReturnedIMERCCITLRevisionId) {
      formData.append(
        "submittedReturnedIMERCCITLRevisionId",
        state.submittedReturnedIMERCCITLRevisionId as string
      );
    }
    axios
      .post("/api/im_file", formData)
      .then(() => {
        alert("IMFile created successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  const onIMChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setState((prev) => ({ ...prev, iMId: e.target.value }));
  };
  const onDepartmentReviewedId: ChangeEventHandler<HTMLInputElement> = (e) => {
    setState((prev) => ({ ...prev, departmentReviewedId: e.target.value }));
  };
  const onSubmittedReturnedDepartmentRevisionId: ChangeEventHandler<
    HTMLInputElement
  > = (e) => {
    setState((prev) => ({
      ...prev,
      submittedReturnedDepartmentRevisionId: e.target.value,
    }));
  };
  const onSubmittedIDDCoordinatorSuggestionId: ChangeEventHandler<
    HTMLInputElement
  > = (e) => {
    setState((prev) => ({
      ...prev,
      submittedIDDCoordinatorSuggestionId: e.target.value,
    }));
  };
  const onSubmittedReturnedCITLRevisionId: ChangeEventHandler<
    HTMLInputElement
  > = (e) => {
    setState((prev) => ({
      ...prev,
      submittedReturnedCITLRevisionId: e.target.value,
    }));
  };
  const onSubmittedQAMISSuggestionId: ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    setState((prev) => ({
      ...prev,
      submittedQAMISSuggestionId: e.target.value,
    }));
  };
  const onIMERCCITLReviewedId: ChangeEventHandler<HTMLInputElement> = (e) => {
    setState((prev) => ({ ...prev, iMERCCITLReviewedId: e.target.value }));
  };
  const onSubmittedReturnedIMERCCITLRevisionId: ChangeEventHandler<
    HTMLInputElement
  > = (e) => {
    setState((prev) => ({
      ...prev,
      submittedReturnedIMERCCITLRevisionId: e.target.value,
    }));
  };

  return (
    <CrudLayout>
      <div className="flex">
        <h2 className="flex-1">Add IMFile</h2>
      </div>
      <input type="text" placeholder="iMId" onChange={onIMChange} />
      <input
        type="text"
        placeholder="departmentReviewedId"
        onChange={onDepartmentReviewedId}
      />
      <input
        type="text"
        placeholder="submittedReturnedDepartmentRevisionId"
        onChange={onSubmittedReturnedDepartmentRevisionId}
      />
      <input
        type="text"
        placeholder="submittedIDDCoordinatorSuggestionId"
        onChange={onSubmittedIDDCoordinatorSuggestionId}
      />
      <input
        type="text"
        placeholder="submittedReturnedCITLRevisionId"
        onChange={onSubmittedReturnedCITLRevisionId}
      />
      <input
        type="text"
        placeholder="submittedQAMISSuggestionId"
        onChange={onSubmittedQAMISSuggestionId}
      />
      <input
        type="text"
        placeholder="iMERCCITLReviewedId"
        onChange={onIMERCCITLReviewedId}
      />
      <input
        type="text"
        placeholder="submittedReturnedIMERCCITLRevisionId"
        onChange={onSubmittedReturnedIMERCCITLRevisionId}
      />
      <input type="file" onChange={onFileChange} accept=".pdf" />
      <button className="border rounded" onClick={uploadFileHandler}>
        Upload file
      </button>
    </CrudLayout>
  );
}
