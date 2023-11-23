import React, { ReactNode, useContext, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ActiveFacultyContext from "@/contexts/ActiveFacultyContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import useAnnouncements from "@/hooks/useAnnouncements";
import Link from "next/link";

export interface MainLayoutProps {
  children: ReactNode;
}
export default function MainLayout({ children }: MainLayoutProps) {
  const { data: session } = useSession({
    required: true,
  });
  const router = useRouter();
  const activeFaculty = useContext(ActiveFacultyContext);
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
      <Header />
      <div className='flex-1 flex h-full overflow-y-clip overflow-x-auto'>
        <div className='w-52'>
          <Sidebar />
        </div>
        <div className='flex-1 flex flex-col h-full'>
          {announcements?.length > 0 &&
            !router.pathname.startsWith("/im/[id]") && (
              <div className='flex justify-between items-center bg-palette_orange m-2 rounded p-1'>
                <button
                  className='w-10 h-10 rounded-full bg-palette_grey bg-opacity-10 hover:bg-opacity-20 text-white'
                  onClick={handlePrev}
                >
                  {"<"}
                </button>
                <div className='flex-1 px-10'>
                  <p>{announcements?.[0].title}</p>
                  <p>{announcements?.[0].description}</p>
                  {announcements?.[0].url && (
                    <Link
                      href={announcements?.[0].url}
                      className='rounded border border-palette_blue px-10'
                    >
                      Go
                    </Link>
                  )}
                  <p className='text-center text-xs'>
                    {state.skip + 1}/{count}
                  </p>
                </div>
                <button
                  className='w-10 h-10 rounded-full bg-palette_grey bg-opacity-10 hover:bg-opacity-20 text-white'
                  onClick={handleNext}
                >
                  {">"}
                </button>
              </div>
            )}
          <div className='overflow-auto h-full m-2'>{children}</div>
        </div>
      </div>
    </div>
  );
}
