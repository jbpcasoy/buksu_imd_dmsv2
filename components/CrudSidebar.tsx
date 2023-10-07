import ActiveFacultyContext from "@/contexts/ActiveFacultyContext";
import Link from "next/link";
import { useContext } from "react";

export default function CrudSidebar() {
  return (
    <div className='flex flex-col'>
      <Link href='/crud' className='underline'>
        Home
      </Link>
      <Link href='/crud/college' className='underline'>
        College
      </Link>
      <Link href='/crud/department' className='underline'>
        Department
      </Link>
      <Link href='/crud/faculty' className='underline'>
        Faculty
      </Link>
      <Link href='/crud/im' className='underline'>
        IM
      </Link>
    </div>
  );
}
