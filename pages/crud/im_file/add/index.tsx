import CrudLayout from "@/components/CrudLayout";
import IMSelector from "@/components/IMSelector";
import axios from "axios";
import { ChangeEventHandler, useState } from "react";

export default function AddIMFile() {
  const [state, setState] = useState<{ file?: File; iMId?: string } | null>();

  const onFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setState((prev) => ({ ...prev, file: e.target.files?.item(0) as File }));
  };
  const onIMChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setState((prev) => ({ ...prev, iMId: e.target.value }));
  };

  const uploadFileHandler = () => {
    console.log({ state });
    if (!state?.file || !state?.iMId) return;

    const formData = new FormData();
    formData.append("file", state.file);
    formData.append("iMId", state.iMId as string);
    axios.post("/api/im_file", formData).then(() => {
      alert("IMFile created successfully")
    });
  };

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>Add IMFile</h2>
      </div>
      <input type="text" placeholder="iMId" onChange={onIMChange} />
      <input type='file' onChange={onFileChange} />
      <button className='border rounded' onClick={uploadFileHandler}>
        Upload file
      </button>
    </CrudLayout>
  );
}
