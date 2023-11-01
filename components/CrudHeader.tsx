import { useSession } from "next-auth/react";
import Link from "next/link";

export default function CrudHeader() {
  const { data: session } = useSession();
  return (
    <div className='flex justify-end p-1'>
      <Link
        href={session?.user?.isAdmin ? "/admin/profile" : "/profile"}
        className='underline'
      >
        profile
      </Link>
    </div>
  );
}
