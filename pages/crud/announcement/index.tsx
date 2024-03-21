import CrudLayout from "@/components/CrudLayout";
import useAnnouncements from "@/hooks/useAnnouncements";
import Link from "next/link";
import { useState } from "react";

export default function AnnouncementsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
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
    <CrudLayout>
      <div className="flex justify-between">
        <h2>Announcement</h2>
        <Link className="border rounded" href={`/crud/announcement/add`}>
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
              <th>title</th>
              <th>description</th>
              <th>url</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {announcements.map((announcement) => {
              return (
                <tr key={announcement.id}>
                  <td>{announcement.id}</td>
                  <td>{new Date(announcement.createdAt).toLocaleString()}</td>
                  <td>{new Date(announcement.updatedAt).toLocaleString()}</td>
                  <td>{announcement.title}</td>
                  <td>{announcement.description}</td>
                  <td>{announcement.url}</td>
                  <td>
                    <Link
                      href={`/crud/announcement/${announcement.id}`}
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
