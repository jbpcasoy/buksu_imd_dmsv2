import AdminLayout from "@/components/AdminLayout";
import useFileManagerIMFiles from "@/hooks/useFileManagerIMFiles";
import formatBytes from "@/services/formatBytes";
import { DateTime } from "luxon";
import Link from "next/link";
import { useState } from "react";

export default function FileManagerPage() {
  const [state, setState] = useState<{
    tab: "IM" | "QAMIS" | "Plagiarism" | "Profile Picture";
  }>({
    tab: "IM",
  });

  const TabItem = ({
    label,
  }: {
    label: "IM" | "QAMIS" | "Plagiarism" | "Profile Picture";
  }) => {
    return (
      <p
        className={`border-b-2 ${
          state.tab === label ? "border-palette_orange" : ""
        } px-2 hover:border-palette_grey cursor-pointer`}
        onClick={() => setState((prev) => ({ ...prev, tab: label }))}
      >
        {label}
      </p>
    );
  };

  return (
    <AdminLayout>
      <div className="border border-palette_grey rounded h-full flex flex-col p-2">
        <div className="flex space-x-2 mb-2">
          <TabItem label="IM" />
          <TabItem label="QAMIS" />
          <TabItem label="Plagiarism" />
          <TabItem label="Profile Picture" />
        </div>
        <hr />
        {state.tab === "IM" && (
          <div className="sm:flex-1 sm:h-full overflow-auto">
            <IMFiles />
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function IMFiles() {
  const [state, setState] = useState<{ skip: number; take: number }>({
    skip: 0,
    take: 10,
  });
  const { fileMetadatas: iMFiles, count } = useFileManagerIMFiles(state);

  return (
    <table className="table-auto w-full overflow-auto text-sm">
      <thead className="bg-palette_grey bg-opacity-10 p-1">
        <tr>
          <th className="font-normal">FILENAME</th>
          <th className="font-normal">SIZE</th>
          <th className="font-normal">LAST MODIFIED</th>
          <th className="font-normal">ACTIONS</th>
        </tr>
      </thead>

      <tbody className="py-1 h-full overflow-auto">
        {iMFiles?.map((iMFile) => {
          return (
            <tr key={iMFile.filename} className="border-b">
              <td>
                <div className="py-1 px-2 pl-4">{iMFile.filename}</div>
              </td>
              <td>
                <div className="py-1 px-2 pl-4">
                  {formatBytes(iMFile.metadata.size)}
                </div>
              </td>
              <td>
                <div className="py-1 px-2 pl-4">
                  {DateTime.fromJSDate(
                    new Date(iMFile.metadata.lastModified)
                  ).toFormat("D | t")}
                </div>
              </td>
              <td>
                <div className="py-1 flex justify-center items-center">
                  <Link
                    href={`/admin/file_manager/im/${iMFile.filename}`}
                    className="rounded bg-palette_blue text-palette_white py-1 px-2 flex justify-center items-center space-x-1"
                  >
                    <span>View</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="16"
                      width="16"
                      viewBox="0 0 512 512"
                      className="fill-palette_white"
                    >
                      <path d="M352 0c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9L370.7 96 201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L416 141.3l41.4 41.4c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V32c0-17.7-14.3-32-32-32H352zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z" />
                    </svg>
                  </Link>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
