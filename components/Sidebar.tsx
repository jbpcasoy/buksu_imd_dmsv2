import ActiveFacultyContext from "@/contexts/ActiveFacultyContext";
import Link from "next/link";
import { useContext } from "react";

export default function Sidebar() {
  const activeFaculty = useContext(ActiveFacultyContext);

  return (
    <div className='h-full overflow-y-auto'>
      <h1 className='py-2 sticky top-0 bg-white shadow'>BUKSU IMD DMS</h1>

      {activeFaculty && (
        <Link href='/my_ims' className='underline'>
          My IM's
        </Link>
      )}
    </div>
  );
}
