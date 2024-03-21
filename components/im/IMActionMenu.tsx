import Confirmation from "@/components/Confirmation";
import { SnackbarContext } from "@/components/SnackbarProvider";
import useActiveFacultyMe from "@/hooks/useActiveFacultyMe";
import useIM from "@/hooks/useIM";
import useIMLatestIMFile from "@/hooks/useIMLatestIMFile.";
import useIMLatestPlagiarismFile from "@/hooks/useIMLatestPlagiarismFile";
import useIMLatestQAMISFile from "@/hooks/useIMLatestQAMISFile";
import useIMStatus from "@/hooks/useIMStatus";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
import EditIM from "./EditIM";

interface IMActionMenuProps {
  iMId: string;
  onRefresh: () => any;
  refreshFlag?: number;
}
export default function IMActionMenu({
  iMId,
  onRefresh = () => {},
  refreshFlag,
}: IMActionMenuProps) {
  const [state, setState] = useState({
    openMenu: false,
    openConfirmation: false,
  });
  const menuRef: any = useRef(null);

  const [loading, setLoading] = useState(false);
  const iM = useIM({
    id: iMId,
    refreshFlag,
  });
  const iMFile = useIMLatestIMFile({ id: iMId as string });
  const qAMISFile = useIMLatestQAMISFile({ id: iMId as string });
  const plagiarismFile = useIMLatestPlagiarismFile({ id: iMId as string });
  const { addSnackbar } = useContext(SnackbarContext);
  const router = useRouter();
  const activeFaculty = useActiveFacultyMe();
  const iMStatus = useIMStatus({
    id: iMId,
  });

  const deleteHandler = (id: string) => {
    axios
      .delete(`/api/im/${id}`)
      .then(() => {
        addSnackbar("IM has been deleted successfully");
        router.push("/department/my_ims");
      })
      .catch((error) => {
        addSnackbar(
          error.response.data?.error?.message ?? "Failed to delete IM",
          "error"
        );
      });
  };

  axios.interceptors.request.use(
    function (config) {
      setLoading(true);
      return config;
    },
    function (error) {
      console.log({ error });
      setLoading(false);
      return Promise.reject(error);
    }
  );
  axios.interceptors.response.use(
    function (response) {
      setLoading(false);
      return response;
    },
    function (error) {
      console.log({ error });
      setLoading(false);
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setState((prev) => ({ ...prev, openMenu: false }));
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setState((prev) => ({ ...prev, openMenu: false }));
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        className="inline-flex justify-center items-center space-x-2 w-full rounded-md border border-gray-300 shadow-sm p-2 bg-palette_blue text-sm font-medium text-palette_white hover:bg-opacity-95"
        id="options-menu"
        aria-haspopup="true"
        aria-expanded="true"
        onClick={() =>
          setState((prev) => ({ ...prev, openMenu: !prev.openMenu }))
        }
      >
        <span>Actions</span>
        {!state.openMenu && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 320 512"
            className="fill-palette_white"
          >
            <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
          </svg>
        )}
        {state.openMenu && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 320 512"
            className="fill-palette_white"
          >
            <path d="M182.6 137.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z" />
          </svg>
        )}
      </button>

      {state.openMenu && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <Link
              href={`/im/${iMId}/all_reviews`}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              All reviews
            </Link>
            <Link
              href={`/im/${iMId}/all_suggestions`}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              All suggestions
            </Link>
            <Link
              href={`/im/${iMId}/track`}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              Track
            </Link>
            {iMFile && (
              <Link
                href={`/api/im_file/im/${iMId}/pdf`}
                target="_blank"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                View IM PDF
              </Link>
            )}
            {qAMISFile && (
              <Link
                href={`/api/qamis_file/im/${iMId}/pdf`}
                target="_blank"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                View QAMIS PDF
              </Link>
            )}
            {plagiarismFile && (
              <Link
                href={`/api/plagiarism_file/im/${iMId}/pdf`}
                target="_blank"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                View Plagiarism PDF
              </Link>
            )}
            <Link
              href={`/im/${iMId}/versions`}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              Versions
            </Link>
            <Link
              href={`/im/${iMId}/forms`}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              Forms
            </Link>
            {iM &&
              iM.facultyId === activeFaculty?.facultyId &&
              iMStatus === "IMPLEMENTATION_DRAFT" && (
                <EditIM onUpdate={onRefresh} />
              )}
            {iM &&
              iM.facultyId === activeFaculty?.facultyId &&
              iMStatus === "IMPLEMENTATION_DRAFT" && (
                <>
                  <button
                    disabled={loading}
                    onClick={() =>
                      setState((prev) => ({ ...prev, openConfirmation: true }))
                    }
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    role="menuitem"
                  >
                    Delete
                  </button>

                  {state.openConfirmation && (
                    <Confirmation
                      onClose={() =>
                        setState((prev) => ({
                          ...prev,
                          openConfirmation: false,
                        }))
                      }
                      onConfirm={() => {
                        deleteHandler(iMId);
                      }}
                    />
                  )}
                </>
              )}
          </div>
        </div>
      )}
    </div>
  );
}
