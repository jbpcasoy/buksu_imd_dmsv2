import AdminLayout from "@/components/AdminLayout";
import Timeline from "@/components/Timeline";
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
      <div className='h-full overflow-auto flex flex-col'>
        <div className='flex flex-1 h-full overflow-auto'>
          {user && (
            <div className='flex-1 h-full overflow-auto'>
              <UserActivity id={user.id} />
            </div>
          )}
          <div className='flex-1 h-full flex flex-col'>
            <div className='flex justify-end'>
              <Link
                className='border rounded'
                href={`/admin/user/${userId}/edit`}
              >
                edit
              </Link>
            </div>
            <div className='h-full flex-1 flex flex-col justify-center items-center space-y-2 '>
              <img
                src={user?.image ?? ""}
                className='w-32 h-32 shadow rounded-full'
              />
              <div className='flex flex-col justify-center items-center'>
                <p className=''>{user?.name}</p>
                <p>{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
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

  const nextHandler = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return { ...prev, skip: nextVal < count ? nextVal : prev.skip };
    });
  };

  const previousHandler = () => {
    setState((prev) => {
      const nextVal = prev.skip - prev.take;
      return { ...prev, skip: nextVal >= 0 ? nextVal : prev.skip };
    });
  };

  return (
    <div className='flex flex-col h-full overflow-auto'>
      {/* <table className='table-auto w-full'>
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
      </table> */}
      <div className='flex-1 h-full overflow-auto py-3'>
        <Timeline events={events} />
      </div>

      <div className='flex justify-start items-center space-x-1 p-1'>
        <button
          disabled={state.skip - state.take < 0}
          className='rounded bg-palette_blue text-palette_white fill-palette_white flex space-x-1 items-center px-1 hover:bg-opacity-90 disabled:bg-opacity-50'
          onClick={previousHandler}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            height='1em'
            viewBox='0 0 448 512'
          >
            <path d='M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z' />
          </svg>
          <span>Previous</span>
        </button>
        <button
          disabled={state.skip + state.take >= count}
          className='rounded bg-palette_blue text-palette_white fill-palette_white flex space-x-1 items-center px-1 hover:bg-opacity-90 disabled:bg-opacity-50'
          onClick={nextHandler}
        >
          <span>Next</span>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            height='1em'
            viewBox='0 0 448 512'
            className='fill-inherit'
          >
            <path d='M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z' />
          </svg>
        </button>
        <p className='text-xs'>
          {state.skip} - {state.skip + state.take} of {count}
        </p>
      </div>
    </div>
  );
}
