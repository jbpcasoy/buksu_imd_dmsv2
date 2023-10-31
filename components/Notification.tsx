import useNotificationReadMe from "@/hooks/useNotificationReadMe";
import { Event } from "@prisma/client";
import axios from "axios";
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
      className={`rounded border ${
        notificationRead ? "" : "border-black"
      } m-1 p-1`}
      key={event.id}
    >
      <p className='text-sm'>{event.type}</p>
      <p className='text-sm'>{event.message}</p>
      <p className='text-sm'>{new Date(event.createdAt).toLocaleString()}</p>
      {event.url && (
        <button
          className='text-sm underline'
          onClick={() => {
            return handleView(event);
          }}
        >
          View
        </button>
      )}
    </div>
  );
}
