import { signOut } from "next-auth/react";
import Link from "next/link";

export default function Header() {
  return (
    <div className='flex justify-end p-1'>
      <Link href='/profile' className='underline'>
        profile
      </Link>
    </div>
  );
}
