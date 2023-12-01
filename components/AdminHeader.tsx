import { useSession } from "next-auth/react";
import Link from "next/link";

export default function AdminHeader() {
  const {data: session} = useSession();
  return (
    // <div className='flex justify-end p-1 bg-palette_blue border-b border-palette_white'>
    // <Link href='/admin/profile' className=''>
    //   <img
    //     src={session?.user?.image ?? ""}
    //     alt={session?.user?.name ?? "Profile"}
    //     className='h-6 w-6 rounded-full hover:opacity-90'
    //   />
    // </Link>
    // </div>

    <div className=''>
      <div className='flex justify-between items-center h-12 space-x-2 bg-palette_blue border-b border-palette_white px-2'>
        <div className='flex space-x-2 justify-center items-center'>
          {/* <button
            className='h-6 w-6 rounded-full fill-palette_white hover:bg-palette_white hover:fill-palette_blue flex justify-center items-center'
            onClick={() => {
              setState((prev) => ({ ...prev, openSidebar: !prev.openSidebar }));
            }}
          >
            {!state.openSidebar && (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                height='16'
                width='14'
                viewBox='0 0 448 512'
                className='fill-inherit'
              >
                <path d='M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z' />
              </svg>
            )}
            {state.openSidebar && (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                height='16'
                width='10'
                viewBox='0 0 320 512'
                className='fill-inherit'
              >
                <path d='M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z' />
              </svg>
            )}
          </button> */}
          <Link
            href="/"
            className='w-48 bg-palette_blue text-lg block'
          >
            <img src='/images/logo.svg' alt='BukSU IMD DMS Logo' />
          </Link>
        </div>
        <div className='flex justify-center items-center space-x-2'>
          
          <Link href='/admin/profile' className=''>
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
