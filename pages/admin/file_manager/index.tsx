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
        <div className="flex justify-between">
          <div className="flex space-x-2 mb-2">
            <TabItem label="IM" />
            <TabItem label="QAMIS" />
            <TabItem label="Plagiarism" />
            <TabItem label="Profile Picture" />
          </div>
        </div>
        <hr />
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
    <div>
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
                    {DateTime.fromJSDate(new Date(iMFile.uploadedAt)).toFormat(
                      "D | t"
                    )}
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
    <div>
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
    <div>
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
    <div>
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
