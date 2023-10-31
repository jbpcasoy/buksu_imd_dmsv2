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
    <MainLayout>
      <h2>Notifications</h2>
      <div>
        {events.map((event) => {
          return <Notification event={event} key={event.id} />;
        })}
      </div>
      <div className='flex flex-row justify-between'>
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
          >
            <option value='read'>Read</option>
            <option value='unread'>Unread</option>
            <option value='all'>All</option>
          </select>
        </div>
        <div className='flex justify-end space-x-1'>
          <p>
            {state.skip} - {state.skip + state.take} of {count}
          </p>
          <button className='border rounded' onClick={handlePrev}>
            prev
          </button>
          <button className='border rounded' onClick={handleNext}>
            next
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
