import useActiveCITLDirectorMe from "@/hooks/useActiveCITLDirectorMe";
import useActiveChairpersonMe from "@/hooks/useActiveChairpersonMe";
import useActiveContentSpecialistMe from "@/hooks/useActiveContentSpecialistMe";
import useActiveCoordinatorMe from "@/hooks/useActiveCoordinatorMe";
import useActiveDeanMe from "@/hooks/useActiveDeanMe";
import useActiveFacultyMe from "@/hooks/useActiveFacultyMe";
import useActiveIDDCoordinatorMe from "@/hooks/useActiveIDDCoordinatorMe";
import useCITLDirectorToEndorseCount from "@/hooks/useCITLDirectorToEndorseCount";
import useCITLIDDToEndorseCount from "@/hooks/useCITLIDDToEndorseCount";
import useCITLToReviewCount from "@/hooks/useCITLToReviewCount";
import useCITLToReviseCount from "@/hooks/useCITLToReviseCount";
import useCoordinatorEndorsedCount from "@/hooks/useCoordinatorEndorsedCount";
import useCoordinatorToEndorseCount from "@/hooks/useCoordinatorToEndorseCount";
import useDeanToEndorseCount from "@/hooks/useDeanToEndorseCount";
import useDepartmentIMsCount from "@/hooks/useDepartmentIMsCount";
import useIMERCCITLDirectorToEndorseCount from "@/hooks/useIMERCCITLDirectorToEndorseCount";
import useIMERCCITLToEndorseCount from "@/hooks/useIMERCCITLToEndorseCount";
import useIMERCCITLToReviewCount from "@/hooks/useIMERCCITLToReviewCount";
import useIMERCCITLToReviseCount from "@/hooks/useIMERCCITLToReviseCount";
import useIMERCCollegeToEndorseCount from "@/hooks/useIMERCCollegeToEndorseCount";
import useIMERCToEndorseCount from "@/hooks/useIMERCToEndorseCount";
import useIMERCToReviewCount from "@/hooks/useIMERCToReviewCount";
import useIMERCToReviseCount from "@/hooks/useIMERCToReviseCount";
import useMyIMsCount from "@/hooks/useMyIMsCount";
import useReviewedCount from "@/hooks/useReviewedCount";
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
  const myIMsCount = useMyIMsCount();
  const departmentIMsCount = useDepartmentIMsCount();
  const coordinatorToEndorseCount = useCoordinatorToEndorseCount();
  const deanToEndorseCount = useDeanToEndorseCount();
  const toReviseCount = useToReviseCount();
  const toReviewCount = useToReviewCount();
  const reviewedCount = useReviewedCount();
  const cITLToRevise = useCITLToReviseCount();
  const cITLToReviewCount = useCITLToReviewCount();
  const cITLIDDToEndorse = useCITLIDDToEndorseCount();
  const cITLDirectorToEndorse = useCITLDirectorToEndorseCount();
  const iMERCToRevise = useIMERCToReviseCount();
  const iMERCToReview = useIMERCToReviewCount();
  const iMERCToEndorse = useIMERCToEndorseCount();
  const iMERCCollegeToEndorse = useIMERCCollegeToEndorseCount();
  const iMERCCITLToRevise = useIMERCCITLToReviseCount();
  const iMERCCITLToReview = useIMERCCITLToReviewCount();
  const iMERCCITLToEndorse = useIMERCCITLToEndorseCount();
  const iMERCCITLDirectorToEndorse = useIMERCCITLDirectorToEndorseCount();
  const coordinatorEndorsedCount = useCoordinatorEndorsedCount();

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
          {activeFaculty && (
            <Link href='/department/my_ims' className='underline font-bold'>
              <span className='font-normal'>{myIMsCount.count}</span> My
              IM&apos;s
            </Link>
          )}
          <p className='text-xs text-center'>IMPLEMENTATION PHASE</p>
          {activeFaculty && (
            <div className='flex flex-col'>
              <p className='font-bold'>Department</p>
              {activeFaculty && (
                <Link href='/department/to_revise' className='underline'>
                  <span className='font-normal'>{toReviseCount.count}</span> To
                  Revise
                </Link>
              )}
              {activeFaculty && (
                <Link href='/department/to_review' className='underline'>
                  <span className='font-normal'>{toReviewCount.count}</span> To
                  Review
                </Link>
              )}
              {activeFaculty && (
                <Link href='/department/reviewed' className='underline'>
                  <span className='font-normal'>{reviewedCount.count}</span>{" "}
                  Reviewed
                </Link>
              )}
              {activeCoordinator && (
                <Link href='/department/to_endorse' className='underline'>
                  <span className='font-normal'>
                    {coordinatorToEndorseCount.count}
                  </span>{" "}
                  To Endorse
                </Link>
              )}
              {activeCoordinator && (
                <Link href='/department/endorsed' className='underline'>
                  <span className='font-normal'>
                    {coordinatorEndorsedCount.count}
                  </span>{" "}
                  Endorsed
                </Link>
              )}
              {(activeCoordinator || activeChairperson) && (
                <Link href='/department/all_ims' className='underline'>
                  <span className='font-normal'>
                    {departmentIMsCount.count}
                  </span>{" "}
                  All IMs
                </Link>
              )}
            </div>
          )}
          {activeDean && (
            <div className='flex flex-col'>
              <p className='font-bold'>College</p>

              {activeDean && (
                <Link href='/college/to_endorse' className='underline'>
                  <span className='font-normal'>
                    {deanToEndorseCount.count}
                  </span>{" "}
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
                  <span className='font-normal'>{cITLToRevise.count}</span> To
                  Revise
                </Link>
              )}
              {activeIDDCoordinator && (
                <div>
                  <p className='font-bold text-xs'>IDD Coordinator</p>
                  <Link href='/citl/to_review' className='underline'>
                    <span className='font-normal'>
                      {cITLToReviewCount.count}
                    </span>{" "}
                    To Review
                  </Link>
                </div>
              )}
              {activeIDDCoordinator && (
                <Link href='/citl/to_endorse' className='underline'>
                  <span className='font-normal'>{cITLIDDToEndorse.count}</span>{" "}
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
                    <span className='font-normal'>
                      {cITLDirectorToEndorse.count}
                    </span>{" "}
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
                  <span className='font-normal'>{iMERCToRevise.count}</span> To
                  Revise
                </Link>
              )}
              {activeContentSpecialist && (
                <Link href='/imerc/department/to_review' className='underline'>
                  <span className='font-normal'>{iMERCToReview.count}</span> To
                  Review
                </Link>
              )}
              {(activeCoordinator || activeChairperson) && (
                <Link href='/imerc/department/to_endorse' className='underline'>
                  <span className='font-normal'>{iMERCToEndorse.count}</span> To
                  Endorse
                </Link>
              )}
            </div>
          )}
          {activeDean && (
            <div className='flex flex-col'>
              <p className='font-bold'>College</p>

              <Link href='/imerc/college/to_endorse' className='underline'>
                <span className='font-normal'>
                  {iMERCCollegeToEndorse.count}
                </span>{" "}
                To Endorse
              </Link>
            </div>
          )}

          {(activeFaculty || activeIDDCoordinator || activeCITLDirector) && (
            <div className='flex flex-col'>
              <p className='font-bold'>CITL</p>

              {activeFaculty && (
                <Link href='/imerc/citl/to_revise' className='underline'>
                  <span className='font-normal'>{iMERCCITLToRevise.count}</span>{" "}
                  To Revise
                </Link>
              )}
              {(activeIDDCoordinator || activeCITLDirector) && (
                <Link href='/imerc/citl/to_review' className='underline'>
                  <span className='font-normal'>{iMERCCITLToReview.count}</span>{" "}
                  To Review
                </Link>
              )}
              {activeIDDCoordinator && (
                <div>
                  <p className='font-bold text-xs'>IDD Coordinator</p>
                  <Link href='/imerc/citl/to_endorse' className='underline'>
                    <span className='font-normal'>
                      {iMERCCITLToEndorse.count}
                    </span>{" "}
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
                    <span className='font-normal'>
                      {iMERCCITLDirectorToEndorse.count}
                    </span>{" "}
                    To Endorse
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
