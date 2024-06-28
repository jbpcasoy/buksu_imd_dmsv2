import useActiveCITLDirectorMe from "@/hooks/useActiveCITLDirectorMe";
import useActiveFacultyMe from "@/hooks/useActiveFacultyMe";
import useActiveIDDCoordinatorMe from "@/hooks/useActiveIDDCoordinatorMe";
import useAnnouncements from "@/hooks/useAnnouncements";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useRef, useState } from "react";
import Header from "./Header";
import Loading from "./Loading";
import Sidebar from "./Sidebar";
import SidebarToggle from "./SidebarToggle";

interface MainLayoutProps {
  children: ReactNode;
}
export default function MainLayout({ children }: MainLayoutProps) {
  const { data: session, status } = useSession({
    required: true,
  });
  const router = useRouter();
  const activeFaculty = useActiveFacultyMe();
  const activeCITLDirector = useActiveCITLDirectorMe();
  const activeIDDCoordinator = useActiveIDDCoordinatorMe();
  const [openSidebar, setOpenSidebar] = useState(true);
  const [state, setState] = useState({
    skip: 0,
    take: 1,
  });
  const { announcements, count } = useAnnouncements(state);

  const handleNext = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return { ...prev, skip: nextVal < count ? nextVal : prev.skip };
    });
  };

  const handlePrev = () => {
    setState((prev) => {
      const nextVal = prev.skip - prev.take;
      return { ...prev, skip: nextVal >= 0 ? nextVal : prev.skip };
    });
  };

  useEffect(() => {
    if (
      activeFaculty === null &&
      activeCITLDirector === null &&
      activeIDDCoordinator === null &&
      router.pathname !== "/non_active" &&
      router.pathname !== "/profile"
    ) {
      router.replace("/non_active");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFaculty, activeCITLDirector, activeIDDCoordinator]);

  useEffect(() => {
    if (session?.user?.isAdmin && router) {
      router.replace("/admin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);


  const [sidebarWidth, setSidebarWidth] = useState({ width: 320, initial: true }); // initial width of 256px


  useEffect(() => {
    // Calculate initial width based on screen width
    const sidebarWidth = Number(localStorage.getItem("sidebar_width"));
    const deviceWidth = window.innerWidth;
    const width = deviceWidth < sidebarWidth ? deviceWidth : sidebarWidth;

    if (sidebarWidth) {
      setSidebarWidth(prev => ({ ...prev, width: width }));
    }
  }, []);

  useEffect(() => {
    if (sidebarWidth.initial) {
      return;
    }
    localStorage.setItem("sidebar_width", String(sidebarWidth.width))
  }, [sidebarWidth])

  const isResizing = useRef(false);

  const handleMouseDown = () => {
    isResizing.current = true;
  };

  const handleMouseUp = () => {
    isResizing.current = false;
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (isResizing.current) {
      let newWidth = event.clientX;
      const maxSidebarWidth = window.innerWidth * 0.90;
      if (newWidth > maxSidebarWidth) {
        newWidth = maxSidebarWidth;
      }

      setSidebarWidth(prev => ({ ...prev, width: newWidth, initial: false }));
    }
  };

  const handleDoubleClick = () => {
    setSidebarWidth(prev => ({ ...prev, width: window.innerWidth * 0.20, initial: false }));
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  if (status === "loading") {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen text-sm xl:text-base">
      <Header onToggleSidebar={setOpenSidebar} />
      <div className="flex-1 flex flex-row md:h-full overflow-auto">
        <div
          style={{ width: sidebarWidth.width }}
          className={`flex-none below-sm:w-full ${openSidebar ? "block" : "hidden"
            }`}
        >
          <Sidebar />
        </div>
        <div
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClick}
          className="bg-palette_light_grey w-1 cursor-col-resize select-none flex justify-center items-center z-10"
        >
          <div className={`${openSidebar ? "-ml-8 sm:-ml-16" : ""}`}>
            <SidebarToggle onToggleSidebar={setOpenSidebar} />
          </div>
        </div>
        <div className={`md:flex-1  flex-col lg:h-full md:overflow-auto sm:bg-palette_dirty_white w-full ${openSidebar ? "hidden" : "flex"}`}>
          {/* {announcements?.length > 0 &&
            !router.pathname.startsWith("/im/[id]") && (
              <div className="flex justify-between items-center m-2 rounded py-5 px-2 bg-gradient-to-r from-palette_orange shadow">
                <button
                  className="w-10 h-10 rounded-full bg-palette_grey bg-opacity-10 hover:bg-opacity-20 text-white flex justify-center items-center"
                  onClick={handlePrev}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="1em"
                    viewBox="0 0 320 512"
                    className="fill-palette_white"
                  >
                    <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
                  </svg>
                </button>
                <div className="flex-1 md:px-10 text-palette_blue overflow-auto">
                  <p className=" font-bold whitespace-nowrap overflow-auto">
                    {announcements?.[0].title}
                  </p>
                  <p className="whitespace-nowrap overflow-auto">
                    {announcements?.[0].description}
                  </p>
                  {announcements?.[0].url && (
                    <Link
                      href={announcements?.[0].url}
                      className="rounded border border-palette_blue px-2 inline-flex justify-center items-center space-x-4 fill-palette_blue hover:text-palette_white hover:fill-palette_white hover:bg-palette_blue hover:bg-opacity-95"
                    >
                      <span>Go</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="1em"
                        viewBox="0 0 448 512"
                        className="fill-inherit"
                      >
                        <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
                      </svg>
                    </Link>
                  )}
                  <p className="text-center text-xs">
                    {state.skip + 1}/{count}
                  </p>
                </div>
                <button
                  className="w-10 h-10 rounded-full bg-palette_grey bg-opacity-10 hover:bg-opacity-20 text-white flex justify-center items-center"
                  onClick={handleNext}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="1em"
                    viewBox="0 0 320 512"
                    className="fill-palette_white"
                  >
                    <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
                  </svg>
                </button>
              </div>
            )} */}
          <div className="flex-1 md:overflow-auto md:h-full sm:p-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
