import Link from "next/link";

export default function AdminHeader() {
  return (
    <div className='flex justify-end p-1'>
      <Link href='/admin/profile' className='underline'>
        profile
      </Link>
    </div>
  );
}
