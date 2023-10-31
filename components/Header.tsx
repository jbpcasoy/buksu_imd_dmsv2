import useEventCount from "@/hooks/useEventCount";
import Link from "next/link";

export default function Header() {
  const eventCount = useEventCount();

  return (
    <div className='flex justify-end p-1 space-x-1'>
      <Link href='/notification' className='underline'>
        <span className='font-normal'>{eventCount.count}</span> notification
      </Link>
      <Link href='/profile' className='underline'>
        profile
      </Link>
    </div>
  );
}
