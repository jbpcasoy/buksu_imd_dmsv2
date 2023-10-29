import MainLayout from "@/components/MainLayout";
import useEvents from "@/hooks/useEvents";
import useEventsMe from "@/hooks/useEventsMe";
import { useState } from "react";

export default function NotificationPage() {
  const [state, setState] = useState({
    take: 10,
    skip: 0,
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
          return (
            <div className='rounded border my-1' key={event.id}>
              <p className='text-sm'>{event.type}</p>
              <p className='text-sm'>{event.message}</p>
              <p className='text-sm'>
                {new Date(event.createdAt).toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>
      <div className='flex justify-end space-x-1'>
        <p>
          {state.skip} - {state.skip + state.take} of {count}
        </p>
        <button className='border rounded' onClick={handlePrev}>prev</button>
        <button className='border rounded' onClick={handleNext}>next</button>
      </div>
    </MainLayout>
  );
}
