import AdminLayout from "@/components/AdminLayout";
import useFileManagerIMFiles from "@/hooks/useFileManagerIMFiles";
import useFileManagerPlagiarismFiles from "@/hooks/useFileManagerPlagiarismFiles";
import useFileManagerProfilePictureFiles from "@/hooks/useFileManagerProfilePictureFiles";
import useFileManagerQAMISFiles from "@/hooks/useFileManagerQAMISFiles";
import formatBytes from "@/services/formatBytes";
import { DateTime } from "luxon";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function FileManagerPage() {
  const [state, setState] = useState<{
    tab: "IM" | "QAMIS" | "Plagiarism" | "Profile Picture";
    query: {
      skip: number;
      take: number;
    };
  }>({
    tab: "IM",
    query: {
      skip: 0,
      take: 10,
    },
  });

  const TabItem = ({
    label,
  }: {
    label: "IM" | "QAMIS" | "Plagiarism" | "Profile Picture";
  }) => {
    return (
      <p
        className={`border min-w-36 rounded-lg ${
          state.tab === label ? "border-palette_orange" : ""
        } p-3 hover:border-palette_grey cursor-pointer`}
        onClick={() => setState((prev) => ({ ...prev, tab: label }))}
      >
        {label}
      </p>
    );
  };

  return (
    <AdminLayout>
      <div className="h-full flex flex-col space-y-4">
        <div className="flex space-x-4">
          <div className="flex flex-row space-x-2 p-3 bg-palette_white rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              className="w-5 h-5 stroke-palette_grey"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
              />
            </svg>
            <p className="font-bold">File Manager</p>
          </div>
          <div className="flex space-x-2">
            <TabItem label="IM" />
            <TabItem label="QAMIS" />
            <TabItem label="Plagiarism" />
            <TabItem label="Profile Picture" />
          </div>
        </div>
        <div className="rounded-2xl h-full flex flex-col p-4 bg-palette_white flex-1">
          {state.tab === "IM" && (
            <div className="sm:flex-1 sm:h-full overflow-auto">
              <IMFiles query={state.query} />
            </div>
          )}
          {state.tab === "QAMIS" && (
            <div className="sm:flex-1 sm:h-full overflow-auto">
              <QAMISFiles query={state.query} />
            </div>
          )}
          {state.tab === "Plagiarism" && (
            <div className="sm:flex-1 sm:h-full overflow-auto">
              <PlagiarismFiles query={state.query} />
            </div>
          )}
          {state.tab === "Profile Picture" && (
            <div className="sm:flex-1 sm:h-full overflow-auto">
              <ProfilePictureFiles query={state.query} />
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

// TODO remove skip
function IMFiles({ query }: { query: { take: number } }) {
  const [state, setState] = useState<{
    take: number;
    cursor?: string;
  }>({
    take: 10,
  });

  const [cursorState, setCursorState] = useState<{
    cursors: string[];
    currentCursor: number;
  }>({
    currentCursor: -1,
    cursors: [],
  });
  useEffect(() => {
    console.log({ cursors: cursorState });
  }, [cursorState]);
  useEffect(() => {
    if (cursorState.currentCursor > -1) {
      setState((prev) => ({
        ...prev,
        cursor: cursorState.cursors[cursorState.currentCursor],
      }));
    } else if (cursorState.currentCursor === -1) {
      setState((prev) => ({
        ...prev,
        cursor: undefined,
      }));
    }
  }, [cursorState]);

  const nextHandler = () => {
    setCursorState((prev) => ({
      ...prev,
      currentCursor: prev.currentCursor + 1,
    }));
  };

  const previousHandler = () => {
    setCursorState((prev) => ({
      ...prev,
      currentCursor: prev.currentCursor - 1,
    }));
  };

  useEffect(() => {
    setState((prev) => ({ ...prev, ...query }));
  }, [query]);

  useEffect(() => {
    console.log({ state });
  }, [state]);

  const {
    fileMetadatas: iMFiles,
    cursor,
    hasMore,
  } = useFileManagerIMFiles(state);

  useEffect(() => {
    if (!cursor) {
      return;
    }
    setCursorState((prev) => {
      if (!prev.cursors.includes(cursor)) {
        return { ...prev, cursors: [...prev.cursors, cursor] };
      } else {
        return prev;
      }
    });
  }, [cursor]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <table className="table-auto w-full overflow-auto">
          <thead className="p-1">
            <tr>
              <th className="font-medium text-left">FILENAME</th>
              <th className="font-medium text-left">SIZE</th>
              <th className="font-medium text-left">LAST MODIFIED</th>
              <th className="font-medium text-center">ACTIONS</th>
            </tr>
          </thead>

          <tbody className="py-1 overflow-auto">
            {iMFiles?.map((iMFile) => {
              return (
                <tr key={iMFile.url} className="border-b">
                  <td>
                    <div className="py-1 px-2 pl-4">
                      {iMFile.url.split("/").at(-1)}
                    </div>
                  </td>
                  <td>
                    <div className="py-1 px-2 pl-4">
                      {formatBytes(iMFile.size)}
                    </div>
                  </td>
                  <td>
                    <div className="py-1 px-2 pl-4">
                      {DateTime.fromJSDate(
                        new Date(iMFile.uploadedAt)
                      ).toFormat("D | t")}
                    </div>
                  </td>
                  <td>
                    <div className="py-1 flex justify-center items-center">
                      <Link
                        href={`/admin/file_manager/im/${iMFile.url
                          .split("/")
                          .at(-1)}`}
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
      </div>

      <div className="flex justify-end items-center space-x-1 p-1">
        <button
          disabled={cursorState.currentCursor < 0}
          className="rounded bg-palette_blue text-palette_white fill-palette_white flex space-x-1 items-center px-1 hover:bg-opacity-90 disabled:bg-opacity-50"
          onClick={previousHandler}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 448 512"
          >
            <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
          </svg>
          <span>Previous</span>
        </button>
        <button
          disabled={!hasMore}
          className="rounded bg-palette_blue text-palette_white fill-palette_white flex space-x-1 items-center px-1 hover:bg-opacity-90 disabled:bg-opacity-50"
          onClick={nextHandler}
        >
          <span>Next</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 448 512"
            className="fill-inherit"
          >
            <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function QAMISFiles({ query }: { query: { take: number } }) {
  const [state, setState] = useState<{
    take: number;
    cursor?: string;
  }>({
    take: 10,
  });

  const [cursorState, setCursorState] = useState<{
    cursors: string[];
    currentCursor: number;
  }>({
    currentCursor: -1,
    cursors: [],
  });
  useEffect(() => {
    console.log({ cursors: cursorState });
  }, [cursorState]);
  useEffect(() => {
    if (cursorState.currentCursor > -1) {
      setState((prev) => ({
        ...prev,
        cursor: cursorState.cursors[cursorState.currentCursor],
      }));
    } else if (cursorState.currentCursor === -1) {
      setState((prev) => ({
        ...prev,
        cursor: undefined,
      }));
    }
  }, [cursorState]);

  const nextHandler = () => {
    setCursorState((prev) => ({
      ...prev,
      currentCursor: prev.currentCursor + 1,
    }));
  };

  const previousHandler = () => {
    setCursorState((prev) => ({
      ...prev,
      currentCursor: prev.currentCursor - 1,
    }));
  };

  useEffect(() => {
    setState((prev) => ({ ...prev, ...query }));
  }, [query]);

  const {
    fileMetadatas: qAMISFiles,
    cursor,
    hasMore,
  } = useFileManagerQAMISFiles(state);

  useEffect(() => {
    if (!cursor) {
      return;
    }
    setCursorState((prev) => {
      if (!prev.cursors.includes(cursor)) {
        return { ...prev, cursors: [...prev.cursors, cursor] };
      } else {
        return prev;
      }
    });
  }, [cursor]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <table className="table-auto w-full overflow-auto">
          <thead className="p-1">
            <tr>
              <th className="font-medium text-left">FILENAME</th>
              <th className="font-medium text-left">SIZE</th>
              <th className="font-medium text-left">LAST MODIFIED</th>
              <th className="font-medium text-center">ACTIONS</th>
            </tr>
          </thead>

          <tbody className="py-1 h-full overflow-auto">
            {qAMISFiles?.map((qAMISFile) => {
              return (
                <tr key={qAMISFile.url} className="border-b">
                  <td>
                    <div className="py-1 px-2 pl-4">
                      {qAMISFile.url.split("/").at(-1)}
                    </div>
                  </td>
                  <td>
                    <div className="py-1 px-2 pl-4">
                      {formatBytes(qAMISFile.size)}
                    </div>
                  </td>
                  <td>
                    <div className="py-1 px-2 pl-4">
                      {DateTime.fromJSDate(
                        new Date(qAMISFile.uploadedAt)
                      ).toFormat("D | t")}
                    </div>
                  </td>
                  <td>
                    <div className="py-1 flex justify-center items-center">
                      <Link
                        href={`/admin/file_manager/qamis/${qAMISFile.url
                          .split("/")
                          .at(-1)}`}
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
      </div>

      <div className="flex justify-end items-center space-x-1 p-1">
        <button
          disabled={cursorState.currentCursor < 0}
          className="rounded bg-palette_blue text-palette_white fill-palette_white flex space-x-1 items-center px-1 hover:bg-opacity-90 disabled:bg-opacity-50"
          onClick={previousHandler}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 448 512"
          >
            <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
          </svg>
          <span>Previous</span>
        </button>
        <button
          disabled={!hasMore}
          className="rounded bg-palette_blue text-palette_white fill-palette_white flex space-x-1 items-center px-1 hover:bg-opacity-90 disabled:bg-opacity-50"
          onClick={nextHandler}
        >
          <span>Next</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 448 512"
            className="fill-inherit"
          >
            <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function PlagiarismFiles({ query }: { query: { take: number; skip: number } }) {
  const [state, setState] = useState<{
    take: number;
    cursor?: string;
  }>({
    take: 10,
  });

  const [cursorState, setCursorState] = useState<{
    cursors: string[];
    currentCursor: number;
  }>({
    currentCursor: -1,
    cursors: [],
  });
  useEffect(() => {
    console.log({ cursors: cursorState });
  }, [cursorState]);
  useEffect(() => {
    if (cursorState.currentCursor > -1) {
      setState((prev) => ({
        ...prev,
        cursor: cursorState.cursors[cursorState.currentCursor],
      }));
    } else if (cursorState.currentCursor === -1) {
      setState((prev) => ({
        ...prev,
        cursor: undefined,
      }));
    }
  }, [cursorState]);

  const nextHandler = () => {
    setCursorState((prev) => ({
      ...prev,
      currentCursor: prev.currentCursor + 1,
    }));
  };

  const previousHandler = () => {
    setCursorState((prev) => ({
      ...prev,
      currentCursor: prev.currentCursor - 1,
    }));
  };

  useEffect(() => {
    setState((prev) => ({ ...prev, ...query }));
  }, [query]);

  const {
    fileMetadatas: plagiarismFiles,
    cursor,
    hasMore,
  } = useFileManagerPlagiarismFiles(state);

  useEffect(() => {
    if (!cursor) {
      return;
    }
    setCursorState((prev) => {
      if (!prev.cursors.includes(cursor)) {
        return { ...prev, cursors: [...prev.cursors, cursor] };
      } else {
        return prev;
      }
    });
  }, [cursor]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <table className="table-auto w-full overflow-auto">
          <thead className="p-1">
            <tr>
              <th className="font-medium text-left">FILENAME</th>
              <th className="font-medium text-left">SIZE</th>
              <th className="font-medium text-left">LAST MODIFIED</th>
              <th className="font-medium text-center">ACTIONS</th>
            </tr>
          </thead>

          <tbody className="py-1 h-full overflow-auto">
            {plagiarismFiles?.map((plagiarismFile) => {
              return (
                <tr key={plagiarismFile.url} className="border-b">
                  <td>
                    <div className="py-1 px-2 pl-4">
                      {plagiarismFile.url.split("/").at(-1)}
                    </div>
                  </td>
                  <td>
                    <div className="py-1 px-2 pl-4">
                      {formatBytes(plagiarismFile.size)}
                    </div>
                  </td>
                  <td>
                    <div className="py-1 px-2 pl-4">
                      {DateTime.fromJSDate(
                        new Date(plagiarismFile.uploadedAt)
                      ).toFormat("D | t")}
                    </div>
                  </td>
                  <td>
                    <div className="py-1 flex justify-center items-center">
                      <Link
                        href={`/admin/file_manager/plagiarism/${plagiarismFile.url
                          .split("/")
                          .at(-1)}`}
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
      </div>

      <div className="flex justify-end items-center space-x-1 p-1">
        <button
          disabled={cursorState.currentCursor < 0}
          className="rounded bg-palette_blue text-palette_white fill-palette_white flex space-x-1 items-center px-1 hover:bg-opacity-90 disabled:bg-opacity-50"
          onClick={previousHandler}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 448 512"
          >
            <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
          </svg>
          <span>Previous</span>
        </button>
        <button
          disabled={!hasMore}
          className="rounded bg-palette_blue text-palette_white fill-palette_white flex space-x-1 items-center px-1 hover:bg-opacity-90 disabled:bg-opacity-50"
          onClick={nextHandler}
        >
          <span>Next</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 448 512"
            className="fill-inherit"
          >
            <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function ProfilePictureFiles({ query }: { query: { take: number } }) {
  const [state, setState] = useState<{
    take: number;
    cursor?: string;
  }>({
    take: 10,
  });

  const [cursorState, setCursorState] = useState<{
    cursors: string[];
    currentCursor: number;
  }>({
    currentCursor: -1,
    cursors: [],
  });
  useEffect(() => {
    console.log({ cursors: cursorState });
  }, [cursorState]);
  useEffect(() => {
    if (cursorState.currentCursor > -1) {
      setState((prev) => ({
        ...prev,
        cursor: cursorState.cursors[cursorState.currentCursor],
      }));
    } else if (cursorState.currentCursor === -1) {
      setState((prev) => ({
        ...prev,
        cursor: undefined,
      }));
    }
  }, [cursorState]);

  const nextHandler = () => {
    setCursorState((prev) => ({
      ...prev,
      currentCursor: prev.currentCursor + 1,
    }));
  };

  const previousHandler = () => {
    setCursorState((prev) => ({
      ...prev,
      currentCursor: prev.currentCursor - 1,
    }));
  };

  useEffect(() => {
    setState((prev) => ({ ...prev, ...query }));
  }, [query]);

  const {
    fileMetadatas: profilePictureFiles,
    cursor,
    hasMore,
  } = useFileManagerProfilePictureFiles(state);

  useEffect(() => {
    if (!cursor) {
      return;
    }
    setCursorState((prev) => {
      if (!prev.cursors.includes(cursor)) {
        return { ...prev, cursors: [...prev.cursors, cursor] };
      } else {
        return prev;
      }
    });
  }, [cursor]);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <table className="table-auto w-full overflow-auto">
          <thead className="p-1">
            <tr>
              <th className="font-medium text-left">FILENAME</th>
              <th className="font-medium text-left">SIZE</th>
              <th className="font-medium text-left">LAST MODIFIED</th>
              <th className="font-medium text-center">ACTIONS</th>
            </tr>
          </thead>

          <tbody className="py-1 h-full overflow-auto">
            {profilePictureFiles?.map((profilePictureFile) => {
              return (
                <tr key={profilePictureFile.url} className="border-b">
                  <td>
                    <div className="py-1 px-2 pl-4">
                      {profilePictureFile.url.split("/").at(-1)}
                    </div>
                  </td>
                  <td>
                    <div className="py-1 px-2 pl-4">
                      {formatBytes(profilePictureFile.size)}
                    </div>
                  </td>
                  <td>
                    <div className="py-1 px-2 pl-4">
                      {DateTime.fromJSDate(
                        new Date(profilePictureFile.uploadedAt)
                      ).toFormat("D | t")}
                    </div>
                  </td>
                  <td>
                    <div className="py-1 flex justify-center items-center">
                      <Link
                        href={`/admin/file_manager/profile_picture/${profilePictureFile.url
                          .split("/")
                          .at(-1)}`}
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
      </div>

      <div className="flex justify-end items-center space-x-1 p-1">
        <button
          disabled={cursorState.currentCursor < 0}
          className="rounded bg-palette_blue text-palette_white fill-palette_white flex space-x-1 items-center px-1 hover:bg-opacity-90 disabled:bg-opacity-50"
          onClick={previousHandler}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 448 512"
          >
            <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
          </svg>
          <span>Previous</span>
        </button>
        <button
          disabled={!hasMore}
          className="rounded bg-palette_blue text-palette_white fill-palette_white flex space-x-1 items-center px-1 hover:bg-opacity-90 disabled:bg-opacity-50"
          onClick={nextHandler}
        >
          <span>Next</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 448 512"
            className="fill-inherit"
          >
            <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
