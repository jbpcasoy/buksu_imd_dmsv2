import useActiveCITLDirectorMe from "@/hooks/useActiveCITLDirectorMe";
import useActiveChairpersonMe from "@/hooks/useActiveChairpersonMe";
import useActiveCoordinatorMe from "@/hooks/useActiveCoordinatorMe";
import useActiveDeanMe from "@/hooks/useActiveDeanMe";
import useActiveIDDCoordinatorMe from "@/hooks/useActiveIDDCoordinatorMe";
import useEventsMe from "@/hooks/useEventsMe";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

export interface HeaderProps {
  onToggleSidebar: (open: boolean) => any;
}
export default function Header({ onToggleSidebar }: HeaderProps) {
  const { data: session } = useSession();
  const activeIDDCoordinator = useActiveIDDCoordinatorMe();
  const activeCITLDirector = useActiveCITLDirectorMe();
  const activeCoordinator = useActiveCoordinatorMe();
  const activeChairperson = useActiveChairpersonMe();
  const activeDean = useActiveDeanMe();
  const [state, setState] = useState({
    initialized: false,
    openSidebar: true,
  });
  const { count } = useEventsMe({
    skip: 0,
    take: 0,
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
    <div className="">
      <div className="flex justify-between items-center h-20 space-x-2 bg-palette_white px-2">
        <div className="flex space-x-2 justify-center items-center">
          <button
            className="hidden sm:flex h-6 w-6 rounded-full fill-palette_blue hover:fill-palette_grey flex justify-center items-center"
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
          <Link
            href={
              activeCoordinator ||
              activeChairperson ||
              activeDean ||
              activeIDDCoordinator ||
              activeCITLDirector
                ? "/"
                : "/department/my_ims"
            }
            className="w-24 sm:w-72 text-lg block"
          >
            <img src="/images/logo.png" alt="BukSU IMD DMS Logo" />
          </Link>
        </div>
        <div className="flex justify-center items-center space-x-2">
          <Link href="/notification" className="group">
            <div className="relative">
              <div className="inline-flex items-center justify-center px-1 rounded-full text-xs text-palette_blue hover:text-palette_grey p-1 space-x-1">
                {/* <span>{count <= 99 ? count : "99+"}</span> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-8 h-8 sm:w-11 sm:h-11"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                  />
                </svg>
              </div>
            </div>
          </Link>
          <Link href="/profile" className="">
            <div className="flex items-center justify-center space-x-2 p-2 rounded-lg bg-palette_light_grey">
              <img
                src={
                  session?.user?.image ?? "/images/buksu-logo-min-512x512.png"
                }
                onError={(e) => {
                  e.currentTarget.src = "/images/buksu-logo-min-512x512.png";
                }}
                alt={session?.user?.name ?? "Profile"}
                className="h-6 w-6 sm:h-11 sm:w-11 rounded-full hover:opacity-90 object-cover"
              />
              <p className="text-base font-semibold">
                {session?.user?.name ?? ""}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
