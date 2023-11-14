import useActiveCITLDirectorMe from "@/hooks/useActiveCITLDirectorMe";
import useActiveChairpersonMe from "@/hooks/useActiveChairpersonMe";
import useActiveContentSpecialistMe from "@/hooks/useActiveContentSpecialistMe";
import useActiveCoordinatorMe from "@/hooks/useActiveCoordinatorMe";
import useActiveDeanMe from "@/hooks/useActiveDeanMe";
import useActiveFacultyMe from "@/hooks/useActiveFacultyMe";
import useActiveIDDCoordinatorMe from "@/hooks/useActiveIDDCoordinatorMe";
import useTabCount from "@/hooks/useTabCount";
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
    <div className='h-full overflow-y-auto flex flex-col pb-10 bg-palette_blue text-white'>
      <div className="h-10 flex justify-center items-center border-b border-palette_white">
        <Link
          href={(activeCoordinator || activeChairperson || activeDean || activeIDDCoordinator || activeCITLDirector) ? '/' : '/department/my_ims'}
          className='sticky top-0 bg-palette_blue text-lg block'
        >
          BUKSU IMD DMS
        </Link>
      </div>
      {(activeFaculty || activeIDDCoordinator || activeCITLDirector) && (
        <div className='my-2 px-1'>
          <div className='flex flex-col'>
            {activeFaculty && (
              <Link
                href='/department'
                className='rounded hover:bg-palette_grey my-1 px-1'
              >
                My Department
              </Link>
            )}
            {activeFaculty && (
              <Link
                href='/department/my_ims'
                className='rounded hover:bg-palette_grey my-1 px-1'
              >
                <span className='font-normal'>{myIMsCount}</span> My IM&apos;s
              </Link>
            )}

            {(activeCoordinator || activeChairperson) && (
              <Link
                href='/department/all_ims'
                className='rounded hover:bg-palette_grey my-1 px-1'
              >
                <span className='font-normal'>{departmentIMsCount}</span>{" "}
                Department IMs
              </Link>
            )}
            {activeDean && (
              <Link
                href='/college/all_ims'
                className='rounded hover:bg-palette_grey my-1 px-1'
              >
                <span className='font-normal'>{collegeIMsCount}</span> College
                IM&apos;s
              </Link>
            )}
            {(activeCITLDirector || activeIDDCoordinator) && (
              <Link
                href='/citl/all_ims'
                className='rounded hover:bg-palette_grey my-1 px-1'
              >
                <span className='font-normal'>{cITLIMsCount}</span> All
                IM&apos;s
              </Link>
            )}
          </div>
          <hr />
          <p className='text-xs text-center'>IMPLEMENTATION PHASE</p>
          {activeFaculty && (
            <div className='flex flex-col'>
              <p className='font-bold text-sm'>DEPARTMENT</p>
              {activeFaculty && (
                <Link
                  href='/department/to_revise'
                  className='rounded hover:bg-palette_grey my-1 px-1'
                >
                  <span className='font-normal'>{toReviseCount}</span> To Revise
                </Link>
              )}
              {activeFaculty && (
                <Link
                  href='/department/to_review'
                  className='rounded hover:bg-palette_grey my-1 px-1'
                >
                  <span className='font-normal'>{toReviewCount}</span> To Review
                </Link>
              )}
              {activeFaculty && (
                <Link
                  href='/department/reviewed'
                  className='rounded hover:bg-palette_grey my-1 px-1'
                >
                  <span className='font-normal'>{reviewedCount}</span> Reviewed
                </Link>
              )}
              {activeCoordinator && (
                <Link
                  href='/department/to_endorse'
                  className='rounded hover:bg-palette_grey my-1 px-1'
                >
                  <span className='font-normal'>
                    {coordinatorToEndorseCount}
                  </span>{" "}
                  To Endorse
                </Link>
              )}
              {activeCoordinator && (
                <Link
                  href='/department/endorsed'
                  className='rounded hover:bg-palette_grey my-1 px-1'
                >
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
              <p className='font-bold text-sm'>COLLEGE</p>

              {activeDean && (
                <Link
                  href='/college/to_endorse'
                  className='rounded hover:bg-palette_grey my-1 px-1'
                >
                  <span className='font-normal'>{deanToEndorseCount}</span> To
                  Endorse
                </Link>
              )}
              {activeDean && (
                <Link
                  href='/college/endorsed'
                  className='rounded hover:bg-palette_grey my-1 px-1'
                >
                  <span className='font-normal'>{deanEndorsedCount}</span>{" "}
                  Endorsed
                </Link>
              )}
            </div>
          )}
          {(activeFaculty || activeIDDCoordinator || activeCITLDirector) && (
            <div className='flex flex-col'>
              <p className='font-bold text-sm'>CITL</p>

              {activeFaculty && (
                <Link
                  href='/citl/to_revise'
                  className='rounded hover:bg-palette_grey my-1 px-1'
                >
                  <span className='font-normal'>{cITLToReviseCount}</span> To
                  Revise
                </Link>
              )}
              {activeIDDCoordinator && (
                <div className='flex flex-col'>
                  <p className='font-bold text-xs'>IDD Coordinator</p>
                  <Link
                    href='/citl/to_review'
                    className='rounded hover:bg-palette_grey my-1 px-1'
                  >
                    <span className='font-normal'>{cITLToReviewCount}</span> To
                    Review
                  </Link>
                  <Link
                    href='/citl/reviewed'
                    className='rounded hover:bg-palette_grey my-1 px-1'
                  >
                    <span className='font-normal'>{cITLReviewedCount}</span>{" "}
                    Reviewed
                  </Link>
                </div>
              )}
              {activeIDDCoordinator && (
                <Link
                  href='/citl/to_endorse'
                  className='rounded hover:bg-palette_grey my-1 px-1'
                >
                  <span className='font-normal'>{cITLIDDToEndorseCount}</span>{" "}
                  To Endorse
                </Link>
              )}
              {activeIDDCoordinator && (
                <Link
                  href='/citl/endorsed'
                  className='rounded hover:bg-palette_grey my-1 px-1'
                >
                  <span className='font-normal'>{cITLIDDEndorsedCount}</span>{" "}
                  Endorsed
                </Link>
              )}
              {activeCITLDirector && (
                <div className='flex flex-col'>
                  <p className='font-bold text-xs'>CITL Director</p>
                  <Link
                    href='/citl/citl_director_to_endorse'
                    className='rounded hover:bg-palette_grey my-1 px-1'
                  >
                    <span className='font-normal'>
                      {cITLDirectorToEndorseCount}
                    </span>{" "}
                    To Endorse
                  </Link>{" "}
                  <Link
                    href='/citl/citl_director_endorsed'
                    className='rounded hover:bg-palette_grey my-1 px-1'
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
          <hr />
          <p className='text-xs text-center'>IMERC</p>
          {activeFaculty && (
            <div className='flex flex-col'>
              <p className='font-bold text-sm'>DEPARTMENT</p>

              {activeFaculty && (
                <Link
                  href='/imerc/department/to_revise'
                  className='rounded hover:bg-palette_grey my-1 px-1'
                >
                  <span className='font-normal'>{iMERCToReviseCount}</span> To
                  Revise
                </Link>
              )}
              {activeContentSpecialist && (
                <Link
                  href='/imerc/department/to_review'
                  className='rounded hover:bg-palette_grey my-1 px-1'
                >
                  <span className='font-normal'>{iMERCToReviewCount}</span> To
                  Review
                </Link>
              )}
              {activeContentSpecialist && (
                <Link
                  href='/imerc/department/reviewed'
                  className='rounded hover:bg-palette_grey my-1 px-1'
                >
                  <span className='font-normal'>{iMERCReviewedCount}</span>{" "}
                  Reviewed
                </Link>
              )}
              {(activeCoordinator || activeChairperson) && (
                <Link
                  href='/imerc/department/to_endorse'
                  className='rounded hover:bg-palette_grey my-1 px-1'
                >
                  <span className='font-normal'>{iMERCToEndorseCount}</span> To
                  Endorse
                </Link>
              )}
              {(activeCoordinator || activeChairperson) && (
                <Link
                  href='/imerc/department/endorsed'
                  className='rounded hover:bg-palette_grey my-1 px-1'
                >
                  <span className='font-normal'>{iMERCEndorsedCount}</span>{" "}
                  Endorsed
                </Link>
              )}
            </div>
          )}
          {activeDean && (
            <div className='flex flex-col'>
              <p className='font-bold text-sm'>COLLEGE</p>

              <Link
                href='/imerc/college/to_endorse'
                className='rounded hover:bg-palette_grey my-1 px-1'
              >
                <span className='font-normal'>
                  {iMERCCollegeToEndorseCount}
                </span>{" "}
                To Endorse
              </Link>
              <Link
                href='/imerc/college/endorsed'
                className='rounded hover:bg-palette_grey my-1 px-1'
              >
                <span className='font-normal'>{iMERCCollegeEndorsedCount}</span>{" "}
                Endorsed
              </Link>
            </div>
          )}

          {(activeFaculty || activeIDDCoordinator || activeCITLDirector) && (
            <div className='flex flex-col'>
              <p className='font-bold text-sm'>CITL</p>

              {activeFaculty && (
                <Link
                  href='/imerc/citl/to_revise'
                  className='rounded hover:bg-palette_grey my-1 px-1'
                >
                  <span className='font-normal'>{iMERCCITLToReviseCount}</span>{" "}
                  To Revise
                </Link>
              )}
              {(activeIDDCoordinator || activeCITLDirector) && (
                <Link
                  href='/imerc/citl/to_review'
                  className='rounded hover:bg-palette_grey my-1 px-1'
                >
                  <span className='font-normal'>{iMERCCITLToReviewCount}</span>{" "}
                  To Review
                </Link>
              )}
              {(activeIDDCoordinator || activeCITLDirector) && (
                <Link
                  href='/imerc/citl/reviewed'
                  className='rounded hover:bg-palette_grey my-1 px-1'
                >
                  <span className='font-normal'>
                    {iMERCReviewedByCITLCount}
                  </span>{" "}
                  Reviewed
                </Link>
              )}
              {activeIDDCoordinator && (
                <div className='flex flex-col'>
                  <p className='font-bold text-xs'>IDD Coordinator</p>
                  <Link
                    href='/imerc/citl/to_endorse'
                    className='rounded hover:bg-palette_grey my-1 px-1'
                  >
                    <span className='font-normal'>
                      {iMERCCITLToEndorseCount}
                    </span>{" "}
                    To Endorse
                  </Link>
                  <Link
                    href='/imerc/citl/endorsed'
                    className='rounded hover:bg-palette_grey my-1 px-1'
                  >
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
                    className='rounded hover:bg-palette_grey my-1 px-1'
                  >
                    <span className='font-normal'>
                      {iMERCCITLDirectorToEndorseCount}
                    </span>{" "}
                    To Endorse
                  </Link>
                  <Link
                    href='/imerc/citl/citl_director_endorsed'
                    className='rounded hover:bg-palette_grey my-1 px-1'
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
