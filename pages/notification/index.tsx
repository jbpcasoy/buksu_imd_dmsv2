import MainLayout from "@/components/MainLayout";
import Notification from "@/components/Notification";
import useEventsMe from "@/hooks/useEventsMe";
import { useState } from "react";

export default function NotificationPage() {
  const [state, setState] = useState({
    take: 10,
    skip: 0,
    filter: {
      read: "unread",
    },
  });
  const { events, count } = useEventsMe(state);

  const nextHandler = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return { ...prev, skip: nextVal <= count ? nextVal : prev.skip };
    });
  };

  const previousHandler = () => {
    setState((prev) => {
      const nextVal = prev.skip - prev.take;
      return { ...prev, skip: nextVal >= 0 ? nextVal : prev.skip };
    });
  };

  return (
    <MainLayout>
      <div className='flex flex-col h-full overflow-auto bg-palette_grey bg-opacity-10 p-1 rounded border border-palette_grey'>
        <div className='flex justify-between items-center py-1'>
          <h2 className='text-palette_grey text-xl font-bold'>Notifications</h2>

          <div>
            <select
              value={`${state.filter.read}`}
              onChange={(e) =>
                setState((prev) => ({
                  ...prev,
                  skip: 0,
                  filter: {
                    ...prev.filter,
                    read: e.target.value,
                  },
                }))
              }
              className='rounded py-1 text-palette_blue bg-inherit text-xs focus:border-palette_grey focus:ring-palette_grey'
            >
              <option value='read'>Read</option>
              <option value='unread'>Unread</option>
              <option value='all'>All</option>
            </select>
          </div>
        </div>
        <div className='flex-1  overflow-auto'>
          {events.map((event) => {
            return <Notification event={event} key={event.id} />;
          })}
        </div>
        <div className='flex justify-end items-center space-x-1 text-sm p-1'>
          <p className='text-xs'>
            {state.skip} - {state.skip + state.take} of {count}
          </p>
          <button
            disabled={state.skip - state.take < 0}
            className='rounded bg-palette_blue text-palette_white fill-palette_white flex space-x-1 items-center px-1 hover:bg-opacity-90 disabled:bg-opacity-50'
            onClick={previousHandler}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              height='1em'
              viewBox='0 0 448 512'
            >
              <path d='M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z' />
            </svg>
            <span>Previous</span>
          </button>
          <button
            disabled={state.skip + state.take >= count}
            className='rounded bg-palette_blue text-palette_white fill-palette_white flex space-x-1 items-center px-1 hover:bg-opacity-90 disabled:bg-opacity-50'
            onClick={nextHandler}
          >
            <span>Next</span>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              height='1em'
              viewBox='0 0 448 512'
              className='fill-inherit'
            >
              <path d='M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z' />
            </svg>
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
