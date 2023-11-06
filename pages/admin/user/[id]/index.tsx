import AdminLayout from "@/components/AdminLayout";
import useEventsUser from "@/hooks/useEventUser";
import useUser from "@/hooks/useUser";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function UserPage() {
  const router = useRouter();
  const userId = router.query.id;
  const user = useUser({ id: userId as string });

  if (!user) return null;

  return (
    <AdminLayout>
      <div className='flex'>
        <h2 className='flex-1'>User</h2>
        <div className='space-x-1'>
          <Link className='border rounded' href={`/admin/user/${userId}/edit`}>
            edit
          </Link>
        </div>
      </div>
      <p>id: {user.id}</p>
      <p>name: {user.name}</p>
      <p>email: {user.email}</p>

      {user && (
        <div>
          <UserActivity id={user.id} />
        </div>
      )}
    </AdminLayout>
  );
}

function UserActivity({ id }: { id: string }) {
  const [state, setState] = useState({
    take: 10,
    skip: 0,
    id,
  });
  const { events, count } = useEventsUser(state);

  const handleNext = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return { ...prev, skip: nextVal < count ? nextVal : prev.skip };
    });
  };

  const handlePrev = () => {
    setState((prev) => {
      const nextVal = prev.skip - prev.take;
      return { ...prev, skip: nextVal >= 0 ? nextVal : prev.skip };
    });
  };

  return (
    <div>
      <table className='table-auto w-full'>
        <thead>
          <tr>
            <th>id</th>
            <th>createdAt</th>
            <th>updatedAt</th>
            <th>type</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => {
            return (
              <tr key={event.id}>
                <td>{event.id}</td>
                <td>{new Date(event.createdAt).toLocaleString()}</td>
                <td>{new Date(event.updatedAt).toLocaleString()}</td>
                <td>{event.type}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
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
  );
}
