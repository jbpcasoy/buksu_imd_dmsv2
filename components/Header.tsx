import useActiveCITLDirectorMe from "@/hooks/useActiveCITLDirectorMe";
import useActiveChairpersonMe from "@/hooks/useActiveChairpersonMe";
import useActiveCoordinatorMe from "@/hooks/useActiveCoordinatorMe";
import useActiveDeanMe from "@/hooks/useActiveDeanMe";
import useActiveIDDCoordinatorMe from "@/hooks/useActiveIDDCoordinatorMe";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Header() {
  const { data: session } = useSession();
  const activeIDDCoordinator = useActiveIDDCoordinatorMe();
  const activeCITLDirector = useActiveCITLDirectorMe();
  const activeCoordinator = useActiveCoordinatorMe();
  const activeChairperson = useActiveChairpersonMe();
  const activeDean = useActiveDeanMe();

  return (
    <div className=''>
      <div className='flex justify-between items-center h-12 space-x-2 bg-palette_blue border-b border-palette_white sticky top-0 px-2'>
        <Link
          href={
            activeCoordinator ||
            activeChairperson ||
            activeDean ||
            activeIDDCoordinator ||
            activeCITLDirector
              ? "/"
              : "/department/my_ims"
          }
          className='w-48 bg-palette_blue text-lg block'
        >
          <img src='/images/logo.svg' alt='BukSU IMD DMS Logo' />
        </Link>
        <div className="flex justify-center items-center space-x-2">
          <Link
            href='/notification'
            className='fill-palette_white hover:fill-palette_orange'
          >
            {/* <span className='font-normal '>{eventCount.count}</span> Notification */}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              height='1em'
              viewBox='0 0 448 512'
            >
              <path d='M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z' />
            </svg>
          </Link>
          <Link href='/profile' className=''>
            <img
              src={session?.user?.image ?? ""}
              alt={session?.user?.name ?? "Profile"}
              className='h-6 w-6 rounded-full hover:opacity-90'
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
