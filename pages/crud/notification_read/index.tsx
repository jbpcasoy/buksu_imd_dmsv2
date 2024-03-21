import CrudLayout from "@/components/CrudLayout";
import useNotificationReads from "@/hooks/useNotificationReads";
import Link from "next/link";
import { useState } from "react";

export default function NotificationReadsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { notificationReads, count } = useNotificationReads(state);

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
    <CrudLayout>
      <div className="flex justify-between">
        <h2>NotificationRead</h2>
        <Link className="border rounded" href={`/crud/notification_read/add`}>
          Add
        </Link>
      </div>

      <div>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th>id</th>
              <th>createdAt</th>
              <th>updatedAt</th>
              <th>eventId</th>
              <th>userId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {notificationReads.map((notificationRead) => {
              return (
                <tr key={notificationRead.id}>
                  <td>{notificationRead.id}</td>
                  <td>
                    {new Date(notificationRead.createdAt).toLocaleString()}
                  </td>
                  <td>
                    {new Date(notificationRead.updatedAt).toLocaleString()}
                  </td>
                  <td>
                    <Link
                      href={`/crud/event/${notificationRead.eventId}`}
                      className="underline"
                    >
                      {notificationRead.eventId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/event/${notificationRead.userId}`}
                      className="underline"
                    >
                      {notificationRead.userId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/notification_read/${notificationRead.id}`}
                      className="border rounded"
                    >
                      view
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex justify-end space-x-1">
          <p>
            {state.skip} - {state.skip + state.take} of {count}
          </p>
          <button className="border rounded" onClick={handlePrev}>
            prev
          </button>
          <button className="border rounded" onClick={handleNext}>
            next
          </button>
        </div>
      </div>
    </CrudLayout>
  );
}
