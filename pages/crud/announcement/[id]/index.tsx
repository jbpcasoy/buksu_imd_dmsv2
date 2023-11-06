import CrudLayout from "@/components/CrudLayout";
import useAnnouncement from "@/hooks/useAnnouncement";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function AnnouncementPage() {
  const router = useRouter();
  const announcementId = router.query.id;
  const announcement = useAnnouncement({ id: announcementId as string });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/announcement/${announcementId}`)
      .then(() => {
        alert("Announcement deleted successfully.");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  if (!announcement) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>Announcement</h2>
        <div className='space-x-1'>
          <Link
            className='border rounded'
            href={`/crud/announcement/${announcementId}/edit`}
          >
            edit
          </Link>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {announcement.id}</p>
      <p>createdAt: {new Date(announcement.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(announcement.updatedAt).toLocaleString()}</p>
      <p>title: {announcement.title}</p>
      <p>description: {announcement.description}</p>
      <p>url: {announcement.url}</p>
    </CrudLayout>
  );
}
