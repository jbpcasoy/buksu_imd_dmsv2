import Link from "next/link";

export default function AdminSidebar() {
  return (
    <div className='h-full overflow-y-auto flex flex-col pb-10'>
      <Link
        href='/admin'
        className='py-2 sticky top-0 bg-white shadow text-lg block'
      >
        BUKSU IMD DMS <span className='text-sm text-gray-500'>ADMIN</span>
      </Link>
      <div className='flex flex-col'>
        <Link href='/admin/user' className='underline'>
          User
        </Link>
        <Link href='/admin/college' className='underline'>
          College
        </Link>
        <Link href='/admin/department' className='underline'>
          Department
        </Link>
        <Link href='/admin/faculty' className='underline'>
          Faculty
        </Link>
        <Link href='/admin/coordinator' className='underline'>
          Coordinator
        </Link>
        <Link href='/admin/chairperson' className='underline'>
          Chairperson
        </Link>
        <Link href='/admin/content_specialist' className='underline'>
          Content Specialist
        </Link>
        <Link href='/admin/dean' className='underline'>
          Dean
        </Link>
        <Link href='/admin/idd_coordinator' className='underline'>
          IDD Coordinator
        </Link>
        <Link href='/admin/citl_director' className='underline'>
          CITL Director
        </Link>
        <Link href='/admin/im' className='underline'>
          IM
        </Link>
      </div>
    </div>
  );
}
