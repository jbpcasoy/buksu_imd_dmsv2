import CrudLayout from "@/components/CrudLayout";
import useNotificationRead from "@/hooks/useNotificationRead";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function NotificationReadPage() {
  const router = useRouter();
  const notificationReadId = router.query.id;
  const notificationRead = useNotificationRead({
    id: notificationReadId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/notification_read/${notificationReadId}`)
      .then(() => {
        alert("NotificationRead deleted successfully.");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!notificationRead) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>NotificationRead</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {notificationRead.id}</p>
      <p>createdAt: {new Date(notificationRead.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(notificationRead.updatedAt).toLocaleString()}</p>
      <p>
        eventId:{" "}
        <Link
          href={`/crud/event/${notificationRead.eventId}`}
          className='underline'
        >
          {notificationRead.eventId}{" "}
        </Link>
      </p>
      <p>
        userId:{" "}
        <Link
          href={`/crud/user/${notificationRead.userId}`}
          className='underline'
        >
          {notificationRead.userId}{" "}
        </Link>
      </p>
    </CrudLayout>
  );
}
