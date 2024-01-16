import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { ChangeEventHandler, useState } from "react";

export default function AddProfilePictureFile() {
  const [state, setState] = useState<{ file?: File } | null>();

  const onFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setState((prev) => ({ ...prev, file: e.target.files?.item(0) as File }));
  };

  const uploadFileHandler = () => {
    console.log({ state });
    if (!state?.file) return;

    const formData = new FormData();
    formData.append("file", state.file);
    axios.post("/api/profile_picture_file", formData).then(() => {
      alert("ProfilePictureFile created successfully");
    });
  };

  return (
    <CrudLayout>
      <div className="flex">
        <h2 className="flex-1">Add ProfilePictureFile</h2>
      </div>
      <input type="file" onChange={onFileChange} accept=".pdf" />
      <button className="border rounded" onClick={uploadFileHandler}>
        Upload file
      </button>
    </CrudLayout>
  );
}
