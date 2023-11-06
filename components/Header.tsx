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
      return { ...prev, skip: nextVal <= count ? nextVal : prev.skip };
    });
  };

  const handlePrev = () => {
    setState((prev) => {
      const nextVal = prev.skip - prev.take;
      return { ...prev, skip: nextVal >= 0 ? nextVal : prev.skip };
    });
  };

  return (
    <div>
      <div className='flex justify-end p-1 space-x-1'>
        <Link href='/notification' className='underline'>
          <span className='font-normal'>{eventCount.count}</span> notification
        </Link>
        <Link href='/profile' className='underline'>
          profile
        </Link>
      </div>
      {announcements?.length > 0 && (
        <div className='flex justify-between items-center'>
          <button className='rounded border' onClick={handlePrev}>
            prev
          </button>
          <div className='flex-1 px-10'>
            <p>{announcements?.[0].title}</p>
            <p>{announcements?.[0].description}</p>
            {announcements?.[0].url && (
              <Link href={announcements?.[0].url} className='rounded border'>
                Go
              </Link>
            )}
            <p className='text-center text-xs'>
              {state.skip + 1}/{count}
            </p>
          </div>
          <button className='rounded border' onClick={handleNext}>
            next
          </button>
        </div>
      )}
    </div>
  );
}
