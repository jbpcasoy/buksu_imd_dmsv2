import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { ChangeEventHandler, useState } from "react";

export default function AddSyllabus() {
  const [state, setState] = useState<{
    file?: File;
    syllabusId?: string;
  } | null>();

  const onFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setState((prev) => ({ ...prev, file: e.target.files?.item(0) as File }));
  };

  const uploadFileHandler = () => {
    console.log({ state });
    if (!state?.file || !state?.syllabusId) return;

    const formData = new FormData();
    formData.append("file", state.file);
    formData.append("syllabusId", state.syllabusId as string);
    axios
      .post("/api/syllabus_file", formData)
      .then(() => {
        alert("SyllabusFile created successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  const onSyllabusChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setState((prev) => ({ ...prev, syllabusId: e.target.value }));
  };

  return (
    <CrudLayout>
      <div className="flex">
        <h2 className="flex-1">Add SyllabusFile</h2>
      </div>
      <input type="text" placeholder="syllabusId" onChange={onSyllabusChange} />
      <input type="file" onChange={onFileChange} accept=".pdf" />
      <button className="border rounded" onClick={uploadFileHandler}>
        Upload file
      </button>
    </CrudLayout>
  );
}
