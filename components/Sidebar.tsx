import ActiveFacultyContext from "@/contexts/ActiveFacultyContext";
import Link from "next/link";
import { useContext } from "react";

export default function Sidebar() {
  const activeFaculty = useContext(ActiveFacultyContext);

  return (
    <div className='h-full overflow-y-auto flex flex-col'>
      <h1 className='py-2 sticky top-0 bg-white shadow'>BUKSU IMD DMS</h1>

      <p className='font-bold'>Department</p>
      {activeFaculty && (
        <Link href='/department/my_ims' className='underline'>
          My IM&apos;s
        </Link>
      )}
      {activeFaculty && (
        <Link href='/department/to_review' className='underline'>
          To Review
        </Link>
      )}
      {activeFaculty && (
        <Link href='/department/to_revise' className='underline'>
          To Revise
        </Link>
      )}
      {activeFaculty && (
        <Link href='/department/to_endorse' className='underline'>
          To Endorse
        </Link>
      )}
    </div>
  );
}
