import MainLayout from "@/components/MainLayout";
import useIM from "@/hooks/useIM";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { ChangeEventHandler, useState } from "react";
import { DepartmentReview, IMFile } from "@prisma/client";

export default function ViewIM() {
  const router = useRouter();
  const iMId = router.query.id;
  const iM = useIM({ id: iMId as string });
  const [state, setState] = useState<File | null>();

  const deleteHandler = (id: string) => {
    axios.delete(`/api/im/${id}`).then(() => {
      alert("IM deleted successfully");
    });
  };

  const onFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setState(e.target.files?.item(0));
  };

  const uploadFileHandler = async () => {
    if (!state || !iMId) return;

    const formData = new FormData();
    formData.append("file", state);
    formData.append("iMId", iMId as string);
    return axios
      .post<IMFile>("/api/im_file", formData)
      .then(async (res) => {
        return axios
          .post<DepartmentReview>("/api/department_review/", {
            iMFileId: res.data.id,
          })
          .then(() => {
            alert("IM has been submitted for review");
          });
      })
      .catch((err) => {
        alert(err?.response?.data?.error?.message ?? err.message);
      });
  };

  if (!iM) return null;

  return (
    <MainLayout>
      <div className='flex'>
        <h2 className='flex-1'>View IM</h2>

        <div>
          <Link href={`/im/${iM.id}/edit`} className='border rounded'>
            edit
          </Link>
          <button
            onClick={() => deleteHandler(iM.id)}
            className='border rounded'
          >
            delete
          </button>
        </div>
      </div>
      <p>id: {iM.id}</p>
      <p>createdAt: {new Date(iM.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(iM.updatedAt).toLocaleString()}</p>
      <p>facultyId: {iM.facultyId}</p>
      <p>title: {iM.title}</p>
      <p>type: {iM.type}</p>
      <input type='file' onChange={onFileChange} />
      <button className='border rounded' onClick={uploadFileHandler}>
        Submit for review
      </button>
    </MainLayout>
  );
}
