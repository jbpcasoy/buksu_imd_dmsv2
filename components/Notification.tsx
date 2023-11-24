import useNotificationReadMe from "@/hooks/useNotificationReadMe";
import { Event } from "@prisma/client";
import axios from "axios";
import { DateTime } from "luxon";
import { useRouter } from "next/router";

export interface NotificationProps {
  event: Event;
}

export default function Notification({ event }: NotificationProps) {
  const router = useRouter();
  const handleView = async (event: Event) => {
    return axios
      .post(`/api/notification_read`, {
        eventId: event.id,
      })
      .then(() => {
        if (!event.url) return;
        router.push(event.url);
      });
  };
  const notificationRead = useNotificationReadMe({ id: event.id });

  return (
    <div
      className={`rounded cursor-pointer  ${
        notificationRead
          ? "bg-palette_grey bg-opacity-5 hover:bg-opacity-0"
          : "bg-palette_light_blue bg-opacity-20 hover:bg-opacity-10"
      } m-1 p-1`}
      key={event.id}
      onClick={() => {
        if (!event.url) {
          return;
        }
        return handleView(event);
      }}
    >
      <div className='flex items-center space-x-2'>
        <div className='bg-palette_blue rounded-full p-2'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            height='1em'
            viewBox='0 0 448 512'
            className='w-8 h-8 fill-palette_white'
          >
            <path d='M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z' />
          </svg>
        </div>
        <div>
          <p className='text-sm text-palette_blue'>{event.message}</p>
          <p className='text-xs text-palette_light_blue'>
            {DateTime.fromJSDate(new Date(event.createdAt)).toRelative()}
          </p>
        </div>
      </div>
    </div>
  );
}
