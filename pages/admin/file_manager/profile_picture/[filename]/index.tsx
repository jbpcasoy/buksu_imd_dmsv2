import AdminLayout from "@/components/AdminLayout";
import Confirmation from "@/components/Confirmation";
import Loading from "@/components/Loading";
import { SnackbarContext } from "@/components/SnackbarProvider";
import useFileManagerProfilePictureFile from "@/hooks/useFileManagerProfilePictureFile";
import useProfilePictureFileByFilename from "@/hooks/useProfilePictureFileByFilename";
import formatBytes from "@/services/formatBytes";
import axios from "axios";
import { DateTime } from "luxon";
import dynamic from "next/dynamic";
import Error from "next/error";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
const DynamicReactJson = dynamic(import("react-json-view"), { ssr: false });

export default function FileManagerProfilePicturePage() {
  const router = useRouter();
  const filename = router.query.filename as string;
  const { addSnackbar } = useContext(SnackbarContext);
  const fileManagerProfilePictureFile = useFileManagerProfilePictureFile({
    filename: filename,
  });
  const profilePictureFile = useProfilePictureFileByFilename({
    filename,
  });
  const [state, setState] = useState({
    openDelete: false,
  });

  const deleteHandler = async () => {
    return axios
      .delete(`/api/file_manager/profile_picture/${filename}`)
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

  if (fileManagerProfilePictureFile === undefined) {
    return (
      <AdminLayout>
        <Loading />
      </AdminLayout>
    );
  }

  if (fileManagerProfilePictureFile === null) {
    return (
      <AdminLayout>
        <Error statusCode={404} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {fileManagerProfilePictureFile && (
        <div className="flex flex-row h-full">
          <div className="flex-1">
            <div>
              <p className="text-lg font-bold">
                {fileManagerProfilePictureFile.filename}
              </p>
              <div className="text-xs palette_grey flex space-x-2">
                <p>
                  {DateTime.fromJSDate(
                    new Date(
                      fileManagerProfilePictureFile.metadata.lastModified
                    )
                  ).toFormat("D | t")}
                </p>
                <p>
                  {formatBytes(fileManagerProfilePictureFile.metadata.size)}
                </p>
              </div>
            </div>

            {profilePictureFile && (
              <DynamicReactJson src={profilePictureFile} collapsed={2} />
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
            <img
              alt="user profile"
              loading="lazy"
              src={`/api/file_manager/profile_picture/${fileManagerProfilePictureFile.filename}/image`}
              title={fileManagerProfilePictureFile.filename}
              className="w-100 h-100 rounded-full"
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
