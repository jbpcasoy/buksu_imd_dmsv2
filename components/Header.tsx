import useActiveCITLDirectorMe from "@/hooks/useActiveCITLDirectorMe";
import useActiveChairpersonMe from "@/hooks/useActiveChairpersonMe";
import useActiveCoordinatorMe from "@/hooks/useActiveCoordinatorMe";
import useActiveDeanMe from "@/hooks/useActiveDeanMe";
import useActiveIDDCoordinatorMe from "@/hooks/useActiveIDDCoordinatorMe";
import useDepartmentMe from "@/hooks/useDepartmentMe";
import useEventsMe from "@/hooks/useEventsMe";
import { Event } from "@prisma/client";
import { Session } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Notification from "./Notification";

interface HeaderProps {
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
  const { count, events } = useEventsMe({
    skip: 0,
    take: 5,
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
        <div className="w-1/2 md:w-1/4 md:1/5 flex space-x-2 justify-left items-center">
          <button
            className="hidden md:flex h-6 w-6 rounded-full fill-palette_blue hover:fill-palette_grey justify-center items-center"
            onClick={() => {
              setState((prev) => ({ ...prev, openSidebar: !prev.openSidebar }));
            }}
            title={state.openSidebar ? "Hide Sidebar" : "Open Sidebar"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16"
              width="14"
              viewBox="0 0 448 512"
              className="fill-inherit"
            >
              <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
            </svg>

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
            className="flex-1  flex justify-left"
          >
            <img
              src="/images/logo.png"
              alt="BukSU IMD DMS Logo"
              className="h-9 md:h-11 lg:h-14"
            />
          </Link>
        </div>
        <div className="flex justify-center items-center space-x-2">
          <div className="hidden sm:block">
            <DropDown count={count} events={events} />
          </div>
          <Link href="/notification" className="group">
            <div className="inline-flex items-center justify-center px-1 rounded-full text-xs text-palette_blue hover:text-palette_grey p-1 space-x-1 relative md:hidden">
              {count > 0 && (
                <div className="absolute bottom-0 right-0 animate-bounce">
                  <div className="bg-palette_orange h-5 w-5 rounded-full flex justify-center items-center">
                    <span className="text-xs">
                      {count <= 99 ? count : "99+"}
                    </span>
                  </div>
                </div>
              )}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-5 h-5 md:w-8 md:h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>
            </div>
          </Link>
          <ProfileDropdown session={session} />

        </div>
      </div>
    </div>
  );
}

function ProfileDropdown({ session }: { session: Session | null }) {
  const [state, setState] = useState({
    open: false
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const department = useDepartmentMe();


  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setState((prev) => ({ ...prev, open: false }));
      }
    }

    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setState((prev) => ({ ...prev, open: false }));
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return <div className="relative inline-block text-left" ref={dropdownRef}>
    <div>
      <button type="button" className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" id="menu-button" aria-expanded="true" aria-haspopup="true" onClick={() => { setState(prev => ({ ...prev, open: !prev.open })) }}>
        <img
          src={
            session?.user?.image ?? "/images/buksu-logo-min-512x512.png"
          }
          onError={(e) => {
            e.currentTarget.src = "/images/buksu-logo-min-512x512.png";
          }}
          alt={session?.user?.name ?? "Profile"}
          className="h-5 w-5 md:h-8 md:w-8 rounded-full group-hover:opacity-90 object-cover"
        />
        <p className="text-sm xl:text-base font-semibold">
          {session?.user?.name ?? ""}
        </p>
      </button>
    </div>

    {/*
    <!--
    Dropdown menu, show/hide based on menu state.

    Entering: "transition ease-out duration-100"
    From: "transform opacity-0 scale-95"
    To: "transform opacity-100 scale-100"
    Leaving: "transition ease-in duration-75"
    From: "transform opacity-100 scale-100"
    To: "transform opacity-0 scale-95"
  --> */}

    {<div className={`absolute right-0 z-10 mt-2 w-72 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${state.open ? "transition ease-out duration-100 transform opacity-100 scale-100" : "transition ease-in duration-75 transform opacity-0 scale-95"}`} role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex={-1}>
      <div className="flex flex-row space-x-2 p-4">
        <div className="flex-none flex justify-center items-center">
          <img
            src={
              session?.user?.image ?? "/images/buksu-logo-min-512x512.png"
            }
            onError={(e) => {
              e.currentTarget.src = "/images/buksu-logo-min-512x512.png";
            }}
            alt={session?.user?.name ?? "Profile"}
            className="h-5 w-5 md:h-8 md:w-8 rounded-full object-cover"
          />
        </div>
        <div className="flex flex-col overflow-hidden">
          <p className="text-sm">{session?.user?.name}</p>
          <p className="text-xs text-nowrap">{department?.name}</p>
        </div>
      </div>
      <hr />
      <div className="" role="none">
        <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-palette_light_grey hover:bg-opacity-50 active:bg-opacity-100" role="menuitem" tabIndex={-1} id="menu-item-0">Manage Account</Link>
        <button className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-palette_light_grey hover:bg-opacity-50 active:bg-opacity-100" role="menuitem" tabIndex={-1} id="menu-item-3" onClick={() => signOut()}>Sign out</button>
      </div>
    </div>}
  </div>
}

function DropDown({ count, events = [] }: { count: number; events: Event[] }) {
  const [state, setState] = useState({
    openNotifications: false,
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setState((prev) => ({ ...prev, openNotifications: false }));
      }
    }

    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setState((prev) => ({ ...prev, openNotifications: false }));
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative inline-block text-left`} ref={dropdownRef}>
      <div
        className="inline-flex items-center justify-center px-1 rounded-full text-xs text-palette_blue hover:text-palette_grey p-1 space-x-1 relative cursor-pointer"
        onClick={() => {
          setState((prev) => ({
            ...prev,
            openNotifications: !prev.openNotifications,
          }));
        }}
      >
        {count > 0 && (
          <div className="absolute bottom-0 right-0 animate-bounce">
            <div className="bg-palette_orange h-5 w-5 rounded-full flex justify-center items-center">
              <span className="text-xs">{count <= 99 ? count : "99+"}</span>
            </div>
          </div>
        )}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-5 h-5 md:w-8 md:h-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
          />
        </svg>
      </div>

      {(
        <div
          className={`absolute right-0 z-10 mt-2 w-96 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden ${state.openNotifications ? "transition ease-out duration-100 transform opacity-100 scale-100" : "transition ease-in duration-75 transform opacity-0 scale-95"}`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={-1}
        >
          <div className="" role="none">
            {/* <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" --> */}
            <p className="p-4 font-semibold text-sm">Notification</p>
            {events.map((event) => {
              return <Notification event={event} key={event.id} />;
            })}
            {count < 1 && (
              <p className="text-center  font-bold p-5 text-palette_grey">
                NO NOTIFICATION TO DISPLAY
              </p>
            )}
            <Link
              href="/notification"
              className="text-center block hover:text-palette_light_blue p-4  text-sm"
            >
              View all
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
