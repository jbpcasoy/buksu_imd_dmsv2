import AdminLayout from "@/components/AdminLayout";
import { SnackbarContext } from "@/components/SnackbarProvider";
import useAnnouncements from "@/hooks/useAnnouncements";
import { Announcement } from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import { useContext, useState } from "react";

export default function AnnouncementsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { announcements, count } = useAnnouncements(state);

  const nextHandler = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return { ...prev, skip: nextVal <= count ? nextVal : prev.skip };
    });
  };

  const previousHandler = () => {
    setState((prev) => {
      const nextVal = prev.skip - prev.take;
      return { ...prev, skip: nextVal >= 0 ? nextVal : prev.skip };
    });
  };

  return (
    <AdminLayout>
      <div className='border border-palette_grey rounded h-full flex flex-col'>
        <div className='flex justify-between bg-palette_grey bg-opacity-10 p-1'>
          <h2 className='border-b-2 border-palette_orange px-2'>
            Announcement
          </h2>
          <Link className='border rounded' href={`/admin/announcement/add`}>
            Add
          </Link>
        </div>

        <div className='flex-1'>
          <table className='table-auto w-full text-sm'>
            <thead className='bg-palette_grey bg-opacity-10'>
              <tr>
                <th className='font-normal'>TITLE</th>
                <th className='font-normal'>DESCRIPTION</th>
                <th className='font-normal'>URL</th>
                <th className='font-normal'>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {announcements.map((announcement) => {
                return (
                  <AnnouncementItem
                    announcement={announcement}
                    key={announcement.id}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
        <div className='flex justify-end items-center space-x-1 p-1'>
          <p className='text-xs'>
            {state.skip} - {state.skip + state.take} of {count}
          </p>
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
        </div>
      </div>
    </AdminLayout>
  );
}

interface AnnouncementItemProps {
  announcement: Announcement;
}

function AnnouncementItem({ announcement }: AnnouncementItemProps) {
  const { addSnackbar } = useContext(SnackbarContext);

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/announcement/${announcement.id}`)
      .then(() => {
        addSnackbar("Announcement deleted successfully.");
      })
      .catch((error) => {
        addSnackbar(
          error.response.data?.error?.message ??
            "Failed to delete announcement",
          "error"
        );
      });
  };

  return (
    <tr key={announcement.id} className='border-b'>
      <td className='py-1 pl-4'>{announcement.title}</td>
      <td className='py-1'>{announcement.description}</td>
      <td className='py-1'>{announcement.url}</td>

      <td className='py-1 flex justify-center items-center'>
        <div className='flex space-x-1'>
          <Link
            className='rounded bg-palette_blue px-4 py-1 hover:bg-opacity-90'
            href={`/admin/announcement/${announcement.id}/edit`}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              height='16'
              width='16'
              viewBox='0 0 512 512'
              className='fill-palette_white'
            >
              <path d='M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z' />
            </svg>
          </Link>
          <button
            className='rounded bg-palette_blue px-4 py-1 hover:bg-opacity-90'
            onClick={() => deleteHandler()}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              height='16'
              width='14'
              viewBox='0 0 448 512'
              className='fill-palette_white'
            >
              <path d='M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z' />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
}
