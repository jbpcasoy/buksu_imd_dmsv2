import AdminLayout from "@/components/AdminLayout";
import Confirmation from "@/components/Confirmation";
import Loading from "@/components/Loading";
import { SnackbarContext } from "@/components/SnackbarProvider";
import useFileManagerQAMISFile from "@/hooks/useFileManagerQAMISFile";
import useQAMISFileByFilename from "@/hooks/useQAMISFileByFilename";
import formatBytes from "@/services/formatBytes";
import axios from "axios";
import { DateTime } from "luxon";
import Error from "next/error";
import { useRouter } from "next/router";
import { useContext, useState } from "react";

export default function FileManagerQAMISPage() {
  const router = useRouter();
  const filename = router.query.filename as string;
  const { addSnackbar } = useContext(SnackbarContext);
  const fileManagerQAMISFile = useFileManagerQAMISFile({
    filename: filename,
  });
  const qAMISFile = useQAMISFileByFilename({
    filename,
  });
  const [state, setState] = useState({
    openDelete: false,
  });

  const deleteHandler = async () => {
    return axios
      .delete(`/api/file_manager/qamis/${filename}`)
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

  if (fileManagerQAMISFile === undefined) {
    return (
      <AdminLayout>
        <Loading />
      </AdminLayout>
    );
  }

  if (fileManagerQAMISFile === null) {
    return (
      <AdminLayout>
        <Error statusCode={404} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {fileManagerQAMISFile && (
        <div className="flex flex-row h-full">
          <div className="flex-1">
            <div>
              <p className="text-lg font-bold">
                {fileManagerQAMISFile.url.split("/").at(-1)}
              </p>
              <div className="text-xs palette_grey flex space-x-2">
                <p>
                  {DateTime.fromJSDate(
                    new Date(fileManagerQAMISFile.uploadedAt)
                  ).toFormat("D | t")}
                </p>
                <p>{formatBytes(fileManagerQAMISFile.size)}</p>
              </div>
            </div>

            {qAMISFile && (
              // <DynamicReactJson src={qAMISFile} collapsed={2} />
              <pre className="text-xs">
                {JSON.stringify(qAMISFile, undefined, 4)}
              </pre>
            )}
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
              src={`/api/file_manager/qamis/${fileManagerQAMISFile.url
                .split("/")
                .at(-1)}/pdf`}
              title={fileManagerQAMISFile.url.split("/").at(-1)}
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
