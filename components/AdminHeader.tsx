import { useSession } from "next-auth/react";
import Link from "next/link";

export default function AdminHeader() {
  const { data: session } = useSession();
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
          <div className='flex justify-center items-center space-x-1'>
            <Link href='/' className='w-48 bg-palette_blue text-lg block'>
              <img src='/images/logo.svg' alt='BukSU IMD DMS Logo' />
            </Link>
            <p className='bg-palette_orange px-2 rounded text-palette_white flex justify-center items-center space-x-1 text-sm'>
              <span>ADMIN</span>
              <span>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  height='16'
                  width='18'
                  viewBox='0 0 576 512'
                  className="fill-palette_white"
                >
                  <path d='M288 64C64 64 0 160 0 272S80 448 176 448h8.4c24.2 0 46.4-13.7 57.2-35.4l23.2-46.3c4.4-8.8 13.3-14.3 23.2-14.3s18.8 5.5 23.2 14.3l23.2 46.3c10.8 21.7 33 35.4 57.2 35.4H400c96 0 176-64 176-176s-64-208-288-208zM96 256a64 64 0 1 1 128 0A64 64 0 1 1 96 256zm320-64a64 64 0 1 1 0 128 64 64 0 1 1 0-128z' />
                </svg>
              </span>
            </p>
          </div>
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
