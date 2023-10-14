import useActiveCITLDirectorMe from "@/hooks/useActiveCITLDirectorMe";
import useActiveDeanMe from "@/hooks/useActiveDeanMe";
import useActiveFacultyMe from "@/hooks/useActiveFacultyMe";
import useActiveIDDCoordinatorMe from "@/hooks/useActiveIDDCoordinatorMe";
import Link from "next/link";

export default function Sidebar() {
  const activeFaculty = useActiveFacultyMe();
  const activeDean = useActiveDeanMe();
  const activeIDDCoordinator = useActiveIDDCoordinatorMe();
  const activeCITLDirector = useActiveCITLDirectorMe();

  return (
    <div className='h-full overflow-y-auto flex flex-col'>
      <h1 className='py-2 sticky top-0 bg-white shadow'>BUKSU IMD DMS</h1>

      {activeFaculty && (
        <div className='flex flex-col'>
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
      )}
      {activeDean && (
        <div className='flex flex-col'>
          <p className='font-bold'>College</p>

          {activeDean && (
            <Link href='/college/to_endorse' className='underline'>
              To Endorse
            </Link>
          )}
        </div>
      )}
      <div className='flex flex-col'>
        <p className='font-bold'>CITL</p>

        {activeIDDCoordinator && (
          <Link href='/citl/to_review' className='underline'>
            To Review
          </Link>
        )}
        {activeFaculty && (
          <Link href='/citl/to_revise' className='underline'>
            To Revise
          </Link>
        )}
      </div>
    </div>
  );
}
