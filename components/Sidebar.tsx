import useActiveCITLDirectorMe from "@/hooks/useActiveCITLDirectorMe";
import useActiveChairpersonMe from "@/hooks/useActiveChairpersonMe";
import useActiveContentSpecialistMe from "@/hooks/useActiveContentSpecialistMe";
import useActiveCoordinatorMe from "@/hooks/useActiveCoordinatorMe";
import useActiveDeanMe from "@/hooks/useActiveDeanMe";
import useActiveFacultyMe from "@/hooks/useActiveFacultyMe";
import useActiveIDDCoordinatorMe from "@/hooks/useActiveIDDCoordinatorMe";
import Link from "next/link";

export default function Sidebar() {
  const activeFaculty = useActiveFacultyMe();
  const activeDean = useActiveDeanMe();
  const activeIDDCoordinator = useActiveIDDCoordinatorMe();
  const activeCITLDirector = useActiveCITLDirectorMe();
  const activeCoordinator = useActiveCoordinatorMe();
  const activeChairperson = useActiveChairpersonMe();
  const activeContentSpecialist = useActiveContentSpecialistMe();

  return (
    <div className='h-full overflow-y-auto flex flex-col pb-10'>
      <Link
        href='/'
        className='py-2 sticky top-0 bg-white shadow text-lg block'
      >
        BUKSU IMD DMS
      </Link>
      {(activeFaculty || activeIDDCoordinator || activeCITLDirector) && (
        <>
          {activeFaculty && (
            <Link href='/department/my_ims' className='underline font-bold'>
              My IM&apos;s
            </Link>
          )}
          <p className='text-xs text-center'>IMPLEMENTATION PHASE</p>
          {activeFaculty && (
            <div className='flex flex-col'>
              <p className='font-bold'>Department</p>
              {activeFaculty && (
                <Link href='/department/to_revise' className='underline'>
                  To Revise
                </Link>
              )}
              {activeFaculty && (
                <Link href='/department/to_review' className='underline'>
                  To Review
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
          {(activeFaculty || activeIDDCoordinator || activeCITLDirector) && (
            <div className='flex flex-col'>
              <p className='font-bold'>CITL</p>

              {activeFaculty && (
                <Link href='/citl/to_revise' className='underline'>
                  To Revise
                </Link>
              )}
              {activeIDDCoordinator && (
                <div>
                  <p className='font-bold text-xs'>IDD Coordinator</p>
                  <Link href='/citl/to_review' className='underline'>
                    To Review
                  </Link>
                </div>
              )}
              {activeIDDCoordinator && (
                <Link href='/citl/to_endorse' className='underline'>
                  To Endorse
                </Link>
              )}
              {activeCITLDirector && (
                <div>
                  <p className='font-bold text-xs'>CITL Director</p>
                  <Link
                    href='/citl/citl_director_to_endorse'
                    className='underline'
                  >
                    To Endorse
                  </Link>
                </div>
              )}
            </div>
          )}
          <p className='text-xs text-center'>IMERC</p>
          {activeFaculty && (
            <div className='flex flex-col'>
              <p className='font-bold'>Department</p>

              {activeFaculty && (
                <Link href='/imerc/department/to_revise' className='underline'>
                  To Revise
                </Link>
              )}
              {activeContentSpecialist && (
                <Link href='/imerc/department/to_review' className='underline'>
                  To Review
                </Link>
              )}
              {(activeCoordinator || activeChairperson) && (
                <Link href='/imerc/department/to_endorse' className='underline'>
                  To Endorse
                </Link>
              )}
            </div>
          )}
          {activeDean && (
            <div className='flex flex-col'>
              <p className='font-bold'>College</p>

              <Link href='/imerc/college/to_endorse' className='underline'>
                To Endorse
              </Link>
            </div>
          )}

          {(activeFaculty || activeIDDCoordinator || activeCITLDirector) && (
            <div className='flex flex-col'>
              <p className='font-bold'>CITL</p>

              {activeFaculty && (
                <Link href='/imerc/citl/to_revise' className='underline'>
                  To Revise
                </Link>
              )}
              {(activeIDDCoordinator || activeCITLDirector) && (
                <Link href='/imerc/citl/to_review' className='underline'>
                  To Review
                </Link>
              )}
              {activeIDDCoordinator && (
                <div>
                  <p className='font-bold text-xs'>IDD Coordinator</p>
                  <Link href='/imerc/citl/to_endorse' className='underline'>
                    To Endorse
                  </Link>
                </div>
              )}
              {activeCITLDirector && (
                <div>
                  <p className='font-bold text-xs'>CITL Director</p>
                  <Link
                    href='/imerc/citl/citl_director_to_endorse'
                    className='underline'
                  >
                    To Endorse
                  </Link>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
