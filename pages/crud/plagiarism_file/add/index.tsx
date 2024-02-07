import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { ChangeEventHandler, useState } from "react";

export default function AddPlagiarismFile() {
  const [state, setState] = useState<{
    file?: File;
    iMERCCITLReviewedId?: string;
  } | null>();

  const onFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setState((prev) => ({ ...prev, file: e.target.files?.item(0) as File }));
  };
  const onIMChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setState((prev) => ({ ...prev, iMERCCITLReviewedId: e.target.value }));
  };

  const uploadFileHandler = () => {
    console.log({ state });
    if (!state?.file || !state?.iMERCCITLReviewedId) return;

    const formData = new FormData();
    formData.append("file", state.file);
    formData.append("iMERCCITLReviewedId", state.iMERCCITLReviewedId as string);
    axios
      .post("/api/plagiarism_file", formData)
      .then(() => {
        alert("PlagiarismFile created successfully");
      })
      .catch((error: any) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  return (
    <CrudLayout>
      <div className="flex">
        <h2 className="flex-1">Add PlagiarismFile</h2>
      </div>
      <input
        type="text"
        placeholder="iMERCCITLReviewedId"
        onChange={onIMChange}
      />
      <input type="file" onChange={onFileChange} accept=".pdf" />
      <button className="border rounded" onClick={uploadFileHandler}>
        Upload file
      </button>
    </CrudLayout>
  );
}
