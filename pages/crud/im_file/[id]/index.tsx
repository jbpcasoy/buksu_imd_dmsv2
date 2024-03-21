import CrudLayout from "@/components/CrudLayout";
import useIMFile from "@/hooks/useIMFile";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function IMFilePage() {
  const router = useRouter();
  const iMFileId = router.query.id;
  const iMFile = useIMFile({ id: iMFileId as string });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/im_file/${iMFileId}`)
      .then(() => {
        alert("IMFile has been deleted successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!iMFile) return null;

  return (
    <CrudLayout>
      <div className="flex">
        <h2 className="flex-1">IMFile</h2>
        <div className="space-x-1">
          <button className="border rounded" onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {iMFile.id}</p>
      <p>createdAt: {new Date(iMFile.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(iMFile.updatedAt).toLocaleString()}</p>
      <p>
        iMId:{" "}
        <Link href={`/crud/im/${iMFile.iMId}`} className="underline">
          {iMFile.iMId}
        </Link>
      </p>
      <p>filename: {iMFile.filename}</p>
      <p>mimetype: {iMFile.mimetype}</p>
      <p>originalFilename: {iMFile.originalFilename}</p>
      <p>size: {iMFile.size}</p>
    </CrudLayout>
  );
}
