import ActiveFacultyContext from "@/contexts/ActiveFacultyContext";
import useAnnouncements from "@/hooks/useAnnouncements";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, useContext, useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

export interface MainLayoutProps {
  children: ReactNode;
}
export default function MainLayout({ children }: MainLayoutProps) {
  const { data: session } = useSession({
    required: true,
  });
  const router = useRouter();
  const activeFaculty = useContext(ActiveFacultyContext);
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
    console.log({ activeFaculty });
  }, [activeFaculty]);

  useEffect(() => {
    if (session?.user?.isAdmin && router) {
      router.replace("/admin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return (
    <div className='flex flex-col h-screen'>
      <Header onToggleSidebar={setOpenSidebar} />
      <div className='flex-1 flex h-full overflow-y-clip overflow-x-auto'>
        {openSidebar && <div className='w-56'>
          <Sidebar />
        </div>}
        <div className='flex-1 flex flex-col h-full'>
          {announcements?.length > 0 &&
            !router.pathname.startsWith("/im/[id]") && (
              <div className='flex justify-between items-center m-2 rounded py-5 px-2 bg-gradient-to-r from-palette_orange shadow'>
                <button
                  className='w-10 h-10 rounded-full bg-palette_grey bg-opacity-10 hover:bg-opacity-20 text-white flex justify-center items-center'
                  onClick={handlePrev}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    height='1em'
                    viewBox='0 0 320 512'
                    className='fill-palette_white'
                  >
                    <path d='M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z' />
                  </svg>
                </button>
                <div className='flex-1 px-10  text-palette_blue'>
                  <p className='text-lg font-bold'>
                    {announcements?.[0].title}
                  </p>
                  <p>{announcements?.[0].description}</p>
                  {announcements?.[0].url && (
                    <Link
                      href={announcements?.[0].url}
                      className='rounded border border-palette_blue px-2 inline-flex justify-center items-center space-x-4 fill-palette_blue hover:text-palette_white hover:fill-palette_white hover:bg-palette_blue hover:bg-opacity-95'
                    >
                      <span>Go</span>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        height='1em'
                        viewBox='0 0 448 512'
                        className='fill-inherit'
                      >
                        <path d='M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z' />
                      </svg>
                    </Link>
                  )}
                  <p className='text-center text-xs'>
                    {state.skip + 1}/{count}
                  </p>
                </div>
                <button
                  className='w-10 h-10 rounded-full bg-palette_grey bg-opacity-10 hover:bg-opacity-20 text-white flex justify-center items-center'
                  onClick={handleNext}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    height='1em'
                    viewBox='0 0 320 512'
                    className='fill-palette_white'
                  >
                    <path d='M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z' />
                  </svg>
                </button>
              </div>
            )}
          <div className='flex-1 overflow-auto h-full m-2'>{children}</div>
        </div>
      </div>
    </div>
  );
}
