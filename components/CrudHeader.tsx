import Link from "next/link";

export default function CrudHeader() {
  return (
    <div className='flex justify-end p-1'>
      <Link href='/profile' className='underline'>
        profile
      </Link>
    </div>
  );
}
