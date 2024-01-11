import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { ChangeEventHandler, useState } from "react";

export default function AddQAMISFile() {
  const [state, setState] = useState<{
    file?: File;
    submittedQAMISSuggestionId?: string;
  } | null>();

  const onFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setState((prev) => ({ ...prev, file: e.target.files?.item(0) as File }));
  };
  const onSubmittedQAMISSuggestionChange: ChangeEventHandler<
    HTMLInputElement
  > = (e) => {
    setState((prev) => ({
      ...prev,
      submittedQAMISSuggestionId: e.target.value,
    }));
  };

  const uploadFileHandler = () => {
    console.log({ state });
    if (!state?.file || !state?.submittedQAMISSuggestionId) return;

    const formData = new FormData();
    formData.append("file", state.file);
    formData.append(
      "submittedQAMISSuggestionId",
      state.submittedQAMISSuggestionId as string
    );
    axios
      .post("/api/qamis_file", formData)
      .then(() => {
        alert("QAMISFile created successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  return (
    <CrudLayout>
      <div className="flex">
        <h2 className="flex-1">Add QAMISFile</h2>
      </div>
      <input
        type="text"
        placeholder="submittedQAMISSuggestionId"
        onChange={onSubmittedQAMISSuggestionChange}
      />
      <br />
      <input type="file" onChange={onFileChange} accept=".pdf" />
      <button className="border rounded" onClick={uploadFileHandler}>
        Upload file
      </button>
    </CrudLayout>
  );
}
