import useAnnouncements from "@/hooks/useAnnouncements";
import useEventCount from "@/hooks/useEventCount";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const eventCount = useEventCount();
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

  return (
    <div className=''>
      <div className='flex justify-end items-center h-10 space-x-1 bg-palette_blue border-b border-palette_white sticky top-0'>
        <Link
          href='/notification'
          className='rounded hover:bg-palette_grey text-white px-2'
        >
          <span className='font-normal'>{eventCount.count}</span> Notification
        </Link>
        <Link
          href='/profile'
          className='rounded hover:bg-palette_grey text-white px-2'
        >
          Profile
        </Link>
      </div>
      {announcements?.length > 0 && (
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
    </div>
  );
}
