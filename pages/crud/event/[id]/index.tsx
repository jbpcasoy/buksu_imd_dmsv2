import CrudLayout from "@/components/CrudLayout";
import useEvent from "@/hooks/useEvent";
import axios from "axios";
import { useRouter } from "next/router";

export default function EventPage() {
  const router = useRouter();
  const eventId = router.query.id;
  const event = useEvent({ id: eventId as string });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/event/${eventId}`)
      .then(() => {
        alert("Event deleted successfully");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  if (!event) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>Event</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {event.id}</p>
      <p>createdAt: {new Date(event.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(event.updatedAt).toLocaleString()}</p>
      <p>name: {event.type}</p>
    </CrudLayout>
  );
}
