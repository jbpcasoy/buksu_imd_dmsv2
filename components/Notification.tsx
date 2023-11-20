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
        notificationRead ? "bg-palette_grey bg-opacity-5 hover:bg-opacity-0" : "bg-palette_light_blue bg-opacity-20 hover:bg-opacity-10"
      } m-1 p-1`}
      key={event.id}
      onClick={() => {
        if (!event.url) {
          return;
        }
        return handleView(event);
      }}
    >
      <p className='text-sm text-palette_blue'>{event.message}</p>
      <p className='text-xs text-palette_light_blue'>
        {DateTime.fromJSDate(new Date(event.createdAt)).toRelative()}
      </p>
    </div>
  );
}
