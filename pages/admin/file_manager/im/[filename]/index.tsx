import AdminLayout from "@/components/AdminLayout";
import Confirmation from "@/components/Confirmation";
import Loading from "@/components/Loading";
import { SnackbarContext } from "@/components/SnackbarProvider";
import useFileManagerIMFile from "@/hooks/useFileManagerIMFile";
import useIMFileByFilename from "@/hooks/useIMFileByFilename";
import formatBytes from "@/services/formatBytes";
import axios from "axios";
import { DateTime } from "luxon";
import dynamic from "next/dynamic";
import Error from "next/error";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
const DynamicReactJson = dynamic(import("react-json-view"), { ssr: false });

export default function FileManagerIMPage() {
  const router = useRouter();
  const filename = router.query.filename as string;
  const { addSnackbar } = useContext(SnackbarContext);
  const fileManagerIMFile = useFileManagerIMFile({
    filename: filename,
  });
  const iMFile = useIMFileByFilename({
    filename,
  });
  const [state, setState] = useState({
    openDelete: false,
  });

  const deleteHandler = async () => {
    return axios
      .delete(`/api/file_manager/im/${filename}`)
      .then((res) => {
        addSnackbar("File has been deleted successfully");
      })
      .catch((err) => {
        addSnackbar(
          err?.response?.data?.error?.message ?? "Failed to delete file",
          "error"
        );
      });
  };

  if (fileManagerIMFile === undefined) {
    return (
      <AdminLayout>
        <Loading />
      </AdminLayout>
    );
  }

  if (fileManagerIMFile === null) {
    return (
      <AdminLayout>
        <Error statusCode={404} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {fileManagerIMFile && (
        <div className="flex flex-row h-full">
          <div className="flex-1">
            <div>
              <p className="text-lg font-bold">{fileManagerIMFile.filename}</p>
              <div className="text-xs palette_grey flex space-x-2">
                <p>
                  {DateTime.fromJSDate(
                    new Date(fileManagerIMFile.metadata.lastModified)
                  ).toFormat("D | t")}
                </p>
                <p>{formatBytes(fileManagerIMFile.metadata.size)}</p>
              </div>
            </div>

            {iMFile && <DynamicReactJson src={iMFile} collapsed={2} />}
            <button
              onClick={() =>
                setState((prev) => ({ ...prev, openDelete: true }))
              }
              className="rounded bg-palette_blue text-palette_white px-2"
            >
              Delete
            </button>
          </div>

          <div className="flex-1 h-full">
            <iframe
              loading="lazy"
              src={`/api/file_manager/im/${fileManagerIMFile.filename}/pdf`}
              title={fileManagerIMFile.filename}
              className="w-full h-full rounded"
            />
          </div>

          {state.openDelete && (
            <Confirmation
              onClose={() =>
                setState((prev) => ({ ...prev, openDelete: false }))
              }
              onConfirm={deleteHandler}
            />
          )}
        </div>
      )}
    </AdminLayout>
  );
}