import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface AdminHeaderProps {
  onToggleSidebar: (open: boolean) => any;
}
export default function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const { data: session } = useSession();
  const [state, setState] = useState({
    initialized: false,
    openSidebar: true,
  });

  useEffect(() => {
    if (!state.initialized) {
      return;
    }

    localStorage.setItem("openSidebar", JSON.stringify(state.openSidebar));
    onToggleSidebar(state.openSidebar);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    const rawOpenSidebar = localStorage.getItem("openSidebar");
    if (rawOpenSidebar) {
      setState((prev) => ({
        ...prev,
        openSidebar: JSON.parse(rawOpenSidebar),
        initialized: true,
      }));
    } else {
      setState((prev) => ({ ...prev, initialized: true }));
    }
  }, []);
  return (
    <div className="flex justify-between items-center h-20 space-x-2 bg-palette_white px-2">
      <div className="flex space-x-2 justify-center items-center">
        <button
          className="h-6 w-6 rounded-full fill-palette_blue hover:bg-palette_white hover:fill-palette_blue flex justify-center items-center"
          onClick={() => {
            setState((prev) => ({ ...prev, openSidebar: !prev.openSidebar }));
          }}
        >
          {!state.openSidebar && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16"
              width="14"
              viewBox="0 0 448 512"
              className="fill-inherit"
            >
              <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
            </svg>
          )}
          {state.openSidebar && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16"
              width="10"
              viewBox="0 0 320 512"
              className="fill-inherit"
            >
              <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
            </svg>
          )}
        </button>
        <div className="flex justify-center items-center space-x-1">
          <Link href="/" className="w-24 md:w-72  block">
            <img
              src="/images/logo.png"
              alt="BukSU IMD DMS Logo"
              className="object-cover h-9 md:h-11 lg:h-14"
            />
          </Link>
          <p className="bg-palette_orange p-1 rounded-full text-palette_white flex justify-center items-center space-x-1 text-sm">
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="16"
                width="18"
                viewBox="0 0 576 512"
                className="fill-palette_white"
              >
                <path d="M288 64C64 64 0 160 0 272S80 448 176 448h8.4c24.2 0 46.4-13.7 57.2-35.4l23.2-46.3c4.4-8.8 13.3-14.3 23.2-14.3s18.8 5.5 23.2 14.3l23.2 46.3c10.8 21.7 33 35.4 57.2 35.4H400c96 0 176-64 176-176s-64-208-288-208zM96 256a64 64 0 1 1 128 0A64 64 0 1 1 96 256zm320-64a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
              </svg>
            </span>
          </p>
        </div>
      </div>
      <Link href="/admin/profile" className="">
        <div className="flex items-center justify-center space-x-2 p-2 rounded-lg bg-palette_light_grey hover:bg-opacity-90">
          <img
            src={session?.user?.image ?? "/images/buksu-logo-min-512x512.png"}
            onError={(e) => {
              e.currentTarget.src = "/images/buksu-logo-min-512x512.png";
            }}
            alt={session?.user?.name ?? "Profile"}
            className="h-6 w-6 md:h-11 md:w-11 rounded-full group-hover:opacity-90 object-cover"
          />
          <p className=" font-semibold">{session?.user?.name ?? ""}</p>
        </div>
      </Link>
    </div>
  );
}
