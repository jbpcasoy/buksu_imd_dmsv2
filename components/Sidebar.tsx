import useActiveCITLDirectorMe from "@/hooks/useActiveCITLDirectorMe";
import useActiveChairpersonMe from "@/hooks/useActiveChairpersonMe";
import useActiveContentSpecialistMe from "@/hooks/useActiveContentSpecialistMe";
import useActiveCoordinatorMe from "@/hooks/useActiveCoordinatorMe";
import useActiveDeanMe from "@/hooks/useActiveDeanMe";
import useActiveFacultyMe from "@/hooks/useActiveFacultyMe";
import useActiveIDDCoordinatorMe from "@/hooks/useActiveIDDCoordinatorMe";
import useCITLDirectorEndorsedCount from "@/hooks/useCITLDirectorEndorsedCount";
import useCITLDirectorToEndorseCount from "@/hooks/useCITLDirectorToEndorseCount";
import useCITLIDDEndorsedCount from "@/hooks/useCITLEndorsementCount";
import useCITLIDDToEndorseCount from "@/hooks/useCITLIDDToEndorseCount";
import useCITLIMsCount from "@/hooks/useCITLIMsCount";
import useCITLReviewedCount from "@/hooks/useCITLReviewedCount";
import useCITLToReviewCount from "@/hooks/useCITLToReviewCount";
import useCITLToReviseCount from "@/hooks/useCITLToReviseCount";
import useCollegeIMsCount from "@/hooks/useCollegeIMsCount";
import useCoordinatorEndorsedCount from "@/hooks/useCoordinatorEndorsedCount";
import useCoordinatorToEndorseCount from "@/hooks/useCoordinatorToEndorseCount";
import useDeanEndorsedCount from "@/hooks/useDeanEndorsedCount";
import useDeanToEndorseCount from "@/hooks/useDeanToEndorseCount";
import useDepartmentIMsCount from "@/hooks/useDepartmentIMsCount";
import useIMERCCITLDirectorEndorsedCount from "@/hooks/useIMERCCITLDirectorEndorsedCount";
import useIMERCCITLDirectorToEndorseCount from "@/hooks/useIMERCCITLDirectorToEndorseCount";
import useIMERCCITLEndorsedCount from "@/hooks/useIMERCCITLEndorsedCount";
import useIMERCCITLToEndorseCount from "@/hooks/useIMERCCITLToEndorseCount";
import useIMERCCITLToReviewCount from "@/hooks/useIMERCCITLToReviewCount";
import useIMERCCITLToReviseCount from "@/hooks/useIMERCCITLToReviseCount";
import useIMERCCollegeEndorsedCount from "@/hooks/useIMERCCollegeEndorsedCount";
import useIMERCCollegeToEndorseCount from "@/hooks/useIMERCCollegeToEndorseCount";
import useIMERCEndorsed from "@/hooks/useIMERCEndorsed";
import useIMERCEndorsedCount from "@/hooks/useIMERCEndorsedCount";
import useIMERCReviewedByCITLCount from "@/hooks/useIMERCReviewedByCITLCount";
import useIMERCReviewedCount from "@/hooks/useIMERCReviewedCount";
import useIMERCToEndorseCount from "@/hooks/useIMERCToEndorseCount";
import useIMERCToReviewCount from "@/hooks/useIMERCToReviewCount";
import useIMERCToReviseCount from "@/hooks/useIMERCToReviseCount";
import useMyIMsCount from "@/hooks/useMyIMsCount";
import useReviewedCount from "@/hooks/useReviewedCount";
import useTabCount from "@/hooks/useTabCount";
import useToReviewCount from "@/hooks/useToReviewCount";
import useToReviseCount from "@/hooks/useToReviseCount";
import Link from "next/link";

export default function Sidebar() {
  const activeFaculty = useActiveFacultyMe();
  const activeDean = useActiveDeanMe();
  const activeIDDCoordinator = useActiveIDDCoordinatorMe();
  const activeCITLDirector = useActiveCITLDirectorMe();
  const activeCoordinator = useActiveCoordinatorMe();
  const activeChairperson = useActiveChairpersonMe();
  const activeContentSpecialist = useActiveContentSpecialistMe();
  const {
    cITLDirectorEndorsedCount,
    cITLDirectorToEndorseCount,
    cITLIDDEndorsedCount,
    cITLIDDToEndorseCount,
    cITLIMsCount,
    cITLReviewedCount,
    cITLToReviewCount,
    cITLToReviseCount,
    collegeIMsCount,
    coordinatorEndorsedCount,
    coordinatorToEndorseCount,
    deanEndorsedCount,
    deanToEndorseCount,
    departmentIMsCount,
    iMERCCITLDirectorEndorsedCount,
    iMERCCITLDirectorToEndorseCount,
    iMERCCITLEndorsedCount,
    iMERCCITLToEndorseCount,
    iMERCCITLToReviewCount,
    iMERCCITLToReviseCount,
    iMERCCollegeEndorsedCount,
    iMERCCollegeToEndorseCount,
    iMERCEndorsedCount,
    iMERCReviewedByCITLCount,
    iMERCReviewedCount,
    iMERCToEndorseCount,
    iMERCToReviewCount,
    iMERCToReviseCount,
    myIMsCount,
    reviewedCount,
    toReviewCount,
    toReviseCount,
  } = useTabCount();

  return (
    <div className='h-full overflow-y-auto flex flex-col pb-10'>
      <Link
        href='/'
        className='py-2 sticky top-0 bg-white shadow text-lg block'
      >
        BUKSU IMD DMS
      </Link>
      {(activeFaculty || activeIDDCoordinator || activeCITLDirector) && (
        <div className='my-2'>
          <div className='flex flex-col'>
            {activeFaculty && (
              <Link href='/department' className='underline'>
                My Department
              </Link>
            )}
            {activeFaculty && (
              <Link href='/department/my_ims' className='underline'>
                <span className='font-normal'>{myIMsCount}</span> My IM&apos;s
              </Link>
            )}

            {(activeCoordinator || activeChairperson) && (
              <Link href='/department/all_ims' className='underline'>
                <span className='font-normal'>{departmentIMsCount}</span>{" "}
                Department IMs
              </Link>
            )}
            {activeDean && (
              <Link href='/college/all_ims' className='underline'>
                <span className='font-normal'>{collegeIMsCount}</span> College
                IM&apos;s
              </Link>
            )}
            {(activeCITLDirector || activeIDDCoordinator) && (
              <Link href='/citl/all_ims' className='underline'>
                <span className='font-normal'>{cITLIMsCount}</span> All
                IM&apos;s
              </Link>
            )}
          </div>
          <p className='text-xs text-center'>IMPLEMENTATION PHASE</p>
          {activeFaculty && (
            <div className='flex flex-col'>
              <p className='font-bold'>Department</p>
              {activeFaculty && (
                <Link href='/department/to_revise' className='underline'>
                  <span className='font-normal'>{toReviseCount}</span> To Revise
                </Link>
              )}
              {activeFaculty && (
                <Link href='/department/to_review' className='underline'>
                  <span className='font-normal'>{toReviewCount}</span> To Review
                </Link>
              )}
              {activeFaculty && (
                <Link href='/department/reviewed' className='underline'>
                  <span className='font-normal'>{reviewedCount}</span> Reviewed
                </Link>
              )}
              {activeCoordinator && (
                <Link href='/department/to_endorse' className='underline'>
                  <span className='font-normal'>
                    {coordinatorToEndorseCount}
                  </span>{" "}
                  To Endorse
                </Link>
              )}
              {activeCoordinator && (
                <Link href='/department/endorsed' className='underline'>
                  <span className='font-normal'>
                    {coordinatorEndorsedCount}
                  </span>{" "}
                  Endorsed
                </Link>
              )}
            </div>
          )}
          {activeDean && (
            <div className='flex flex-col'>
              <p className='font-bold'>College</p>

              {activeDean && (
                <Link href='/college/to_endorse' className='underline'>
                  <span className='font-normal'>{deanToEndorseCount}</span> To
                  Endorse
                </Link>
              )}
              {activeDean && (
                <Link href='/college/endorsed' className='underline'>
                  <span className='font-normal'>{deanEndorsedCount}</span>{" "}
                  Endorsed
                </Link>
              )}
            </div>
          )}
          {(activeFaculty || activeIDDCoordinator || activeCITLDirector) && (
            <div className='flex flex-col'>
              <p className='font-bold'>CITL</p>

              {activeFaculty && (
                <Link href='/citl/to_revise' className='underline'>
                  <span className='font-normal'>{cITLToReviseCount}</span> To
                  Revise
                </Link>
              )}
              {activeIDDCoordinator && (
                <div className='flex flex-col'>
                  <p className='font-bold text-xs'>IDD Coordinator</p>
                  <Link href='/citl/to_review' className='underline'>
                    <span className='font-normal'>{cITLToReviewCount}</span> To
                    Review
                  </Link>
                  <Link href='/citl/reviewed' className='underline'>
                    <span className='font-normal'>{cITLReviewedCount}</span>{" "}
                    Reviewed
                  </Link>
                </div>
              )}
              {activeIDDCoordinator && (
                <Link href='/citl/to_endorse' className='underline'>
                  <span className='font-normal'>{cITLIDDToEndorseCount}</span>{" "}
                  To Endorse
                </Link>
              )}
              {activeIDDCoordinator && (
                <Link href='/citl/endorsed' className='underline'>
                  <span className='font-normal'>{cITLIDDEndorsedCount}</span>{" "}
                  Endorsed
                </Link>
              )}
              {activeCITLDirector && (
                <div className='flex flex-col'>
                  <p className='font-bold text-xs'>CITL Director</p>
                  <Link
                    href='/citl/citl_director_to_endorse'
                    className='underline'
                  >
                    <span className='font-normal'>
                      {cITLDirectorToEndorseCount}
                    </span>{" "}
                    To Endorse
                  </Link>{" "}
                  <Link
                    href='/citl/citl_director_endorsed'
                    className='underline'
                  >
                    <span className='font-normal'>
                      {cITLDirectorEndorsedCount}
                    </span>{" "}
                    Endorsed
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
                  <span className='font-normal'>{iMERCToReviseCount}</span> To
                  Revise
                </Link>
              )}
              {activeContentSpecialist && (
                <Link href='/imerc/department/to_review' className='underline'>
                  <span className='font-normal'>{iMERCToReviewCount}</span> To
                  Review
                </Link>
              )}
              {activeContentSpecialist && (
                <Link href='/imerc/department/reviewed' className='underline'>
                  <span className='font-normal'>{iMERCReviewedCount}</span>{" "}
                  Reviewed
                </Link>
              )}
              {(activeCoordinator || activeChairperson) && (
                <Link href='/imerc/department/to_endorse' className='underline'>
                  <span className='font-normal'>{iMERCToEndorseCount}</span> To
                  Endorse
                </Link>
              )}
              {(activeCoordinator || activeChairperson) && (
                <Link href='/imerc/department/endorsed' className='underline'>
                  <span className='font-normal'>{iMERCEndorsedCount}</span>{" "}
                  Endorsed
                </Link>
              )}
            </div>
          )}
          {activeDean && (
            <div className='flex flex-col'>
              <p className='font-bold'>College</p>

              <Link href='/imerc/college/to_endorse' className='underline'>
                <span className='font-normal'>
                  {iMERCCollegeToEndorseCount}
                </span>{" "}
                To Endorse
              </Link>
              <Link href='/imerc/college/endorsed' className='underline'>
                <span className='font-normal'>{iMERCCollegeEndorsedCount}</span>{" "}
                Endorsed
              </Link>
            </div>
          )}

          {(activeFaculty || activeIDDCoordinator || activeCITLDirector) && (
            <div className='flex flex-col'>
              <p className='font-bold'>CITL</p>

              {activeFaculty && (
                <Link href='/imerc/citl/to_revise' className='underline'>
                  <span className='font-normal'>{iMERCCITLToReviseCount}</span>{" "}
                  To Revise
                </Link>
              )}
              {(activeIDDCoordinator || activeCITLDirector) && (
                <Link href='/imerc/citl/to_review' className='underline'>
                  <span className='font-normal'>{iMERCCITLToReviewCount}</span>{" "}
                  To Review
                </Link>
              )}
              {(activeIDDCoordinator || activeCITLDirector) && (
                <Link href='/imerc/citl/reviewed' className='underline'>
                  <span className='font-normal'>
                    {iMERCReviewedByCITLCount}
                  </span>{" "}
                  Reviewed
                </Link>
              )}
              {activeIDDCoordinator && (
                <div className='flex flex-col'>
                  <p className='font-bold text-xs'>IDD Coordinator</p>
                  <Link href='/imerc/citl/to_endorse' className='underline'>
                    <span className='font-normal'>
                      {iMERCCITLToEndorseCount}
                    </span>{" "}
                    To Endorse
                  </Link>
                  <Link href='/imerc/citl/endorsed' className='underline'>
                    <span className='font-normal'>
                      {iMERCCITLEndorsedCount}
                    </span>{" "}
                    Endorsed
                  </Link>
                </div>
              )}
              {activeCITLDirector && (
                <div className='flex flex-col'>
                  <p className='font-bold text-xs'>CITL Director</p>
                  <Link
                    href='/imerc/citl/citl_director_to_endorse'
                    className='underline'
                  >
                    <span className='font-normal'>
                      {iMERCCITLDirectorToEndorseCount}
                    </span>{" "}
                    To Endorse
                  </Link>
                  <Link
                    href='/imerc/citl/citl_director_endorsed'
                    className='underline'
                  >
                    <span className='font-normal'>
                      {iMERCCITLDirectorEndorsedCount}
                    </span>{" "}
                    Endorsed
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
