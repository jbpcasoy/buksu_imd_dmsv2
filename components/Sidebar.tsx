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
      {(activeFaculty || activeIDDCoordinator || activeCITLDirector) && (
        <div className='my-2 px-1'>
          <div className='flex flex-col'>
            {activeFaculty && (
              // <Link
              //   href='/department'
              //   className='rounded hover:bg-palette_grey my-1 px-1'
              // >
              //   My Department
              // </Link>

              <Link
                href='/department'
                className='rounded hover:bg-palette_grey my-1 px-1 flex justify-between items-center py-1 px-2'
              >
                <span className='flex items-center space-x-4'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    height='1em'
                    viewBox='0 0 384 512'
                    className="fill-palette_white"
                  >
                    <path d='M48 0C21.5 0 0 21.5 0 48V464c0 26.5 21.5 48 48 48h96V432c0-26.5 21.5-48 48-48s48 21.5 48 48v80h96c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48H48zM64 240c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V240zm112-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16V240c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H272c-8.8 0-16-7.2-16-16V240zM80 96h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16V112zM272 96h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H272c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16z' />
                  </svg>
                  <span>My Department</span>
                </span>
              </Link>
            )}
            {activeFaculty && (
              <MenuItem
                count={myIMsCount}
                label="My IM's"
                link='/department/my_ims'
              />
            )}

            {(activeCoordinator || activeChairperson) && (
              <MenuItem
                count={departmentIMsCount}
                label='Department IMs'
                link='/department/all_ims'
              />
            )}
            {activeDean && (
              <MenuItem
                count={collegeIMsCount}
                label="College IM's"
                link='/college/all_ims'
              />
            )}
            {(activeCITLDirector || activeIDDCoordinator) && (
              <MenuItem
                count={cITLIMsCount}
                label="All IM's"
                link='/citl/all_ims'
              />
            )}
          </div>
          <hr />
          <p className='text-xs text-center'>IMPLEMENTATION PHASE</p>
          {activeFaculty && (
            <div className='flex flex-col'>
              <p className='font-bold text-sm'>DEPARTMENT</p>
              {activeFaculty && (
                <MenuItem
                  count={toReviseCount}
                  label='To Revise'
                  link='/department/to_revise'
                />
              )}
              {activeFaculty && (
                <MenuItem
                  count={toReviewCount}
                  label='To Review'
                  link='/department/to_review'
                />
              )}
              {activeFaculty && (
                <MenuItem
                  count={reviewedCount}
                  label='Reviewed'
                  link='/department/reviewed'
                />
              )}
              {activeCoordinator && (
                <MenuItem
                  count={coordinatorToEndorseCount}
                  label='To Endorse'
                  link='/department/to_endorse'
                />
              )}
              {activeCoordinator && (
                <MenuItem
                  count={coordinatorEndorsedCount}
                  label='Endorsed'
                  link='/department/endorsed'
                />
              )}
            </div>
          )}
          {activeDean && (
            <div className='flex flex-col'>
              <p className='font-bold text-sm'>COLLEGE</p>

              {activeDean && (
                <MenuItem
                  count={deanToEndorseCount}
                  label='To Endorse'
                  link='/college/to_endorse'
                />
              )}
              {activeDean && (
                <MenuItem
                  count={deanEndorsedCount}
                  label='Endorsed'
                  link='/college/endorsed'
                />
              )}
            </div>
          )}
          {(activeFaculty || activeIDDCoordinator || activeCITLDirector) && (
            <div className='flex flex-col'>
              <p className='font-bold text-sm'>CITL</p>

              {activeFaculty && (
                <MenuItem
                  count={cITLToReviseCount}
                  label='To Revise'
                  link='/citl/to_revise'
                />
              )}
              {activeIDDCoordinator && (
                <div className='flex flex-col'>
                  <p className='font-bold text-xs'>IDD Coordinator</p>
                  <MenuItem
                    count={cITLToReviewCount}
                    label='To Review'
                    link='/citl/to_review'
                  />
                  <MenuItem
                    count={cITLReviewedCount}
                    label='Reviewed'
                    link='/citl/reviewed'
                  />
                </div>
              )}
              {activeIDDCoordinator && (
                <MenuItem
                  count={cITLIDDToEndorseCount}
                  label='To Endorse'
                  link='/citl/to_endorse'
                />
              )}
              {activeIDDCoordinator && (
                <MenuItem
                  count={cITLIDDEndorsedCount}
                  label='Endorsed'
                  link='/citl/endorsed'
                />
              )}
              {activeCITLDirector && (
                <div className='flex flex-col'>
                  <p className='font-bold text-xs'>CITL Director</p>
                  <MenuItem
                    count={cITLDirectorToEndorseCount}
                    label='To Endorse'
                    link='/citl/citl_director_to_endorse'
                  />
                  <MenuItem
                    count={cITLDirectorEndorsedCount}
                    label='Endorsed'
                    link='/citl/citl_director_endorsed'
                  />
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
                <MenuItem
                  count={iMERCToReviseCount}
                  label='To Revise'
                  link='/imerc/department/to_revise'
                />
              )}
              {activeContentSpecialist && (
                <MenuItem
                  count={iMERCToReviewCount}
                  label='To Review'
                  link='/imerc/department/to_review'
                />
              )}
              {activeContentSpecialist && (
                <MenuItem
                  count={iMERCReviewedCount}
                  label='Reviewed'
                  link='/imerc/department/reviewed'
                />
              )}
              {(activeCoordinator || activeChairperson) && (
                <MenuItem
                  count={iMERCToEndorseCount}
                  label='To Endorse'
                  link='/imerc/department/to_endorse'
                />
              )}
              {(activeCoordinator || activeChairperson) && (
                <MenuItem
                  count={iMERCEndorsedCount}
                  label='Endorsed'
                  link='/imerc/department/endorsed'
                />
              )}
            </div>
          )}
          {activeDean && (
            <div className='flex flex-col'>
              <p className='font-bold text-sm'>COLLEGE</p>
              <MenuItem
                count={iMERCCollegeToEndorseCount}
                label='To Endorse'
                link='/imerc/college/to_endorse'
              />
              <MenuItem
                count={iMERCCollegeEndorsedCount}
                label='Endorsed'
                link='/imerc/college/endorsed'
              />
            </div>
          )}

          {(activeFaculty || activeIDDCoordinator || activeCITLDirector) && (
            <div className='flex flex-col'>
              <p className='font-bold text-sm'>CITL</p>

              {activeFaculty && (
                <MenuItem
                  count={iMERCCITLToReviseCount}
                  label='To Revise'
                  link='/imerc/citl/to_revise'
                />
              )}
              {(activeIDDCoordinator || activeCITLDirector) && (
                <MenuItem
                  count={iMERCCITLToReviewCount}
                  label='To Review'
                  link='/imerc/citl/to_review'
                />
              )}
              {(activeIDDCoordinator || activeCITLDirector) && (
                <MenuItem
                  count={iMERCReviewedByCITLCount}
                  label='Reviewed'
                  link='/imerc/citl/reviewed'
                />
              )}
              {activeIDDCoordinator && (
                <div className='flex flex-col'>
                  <p className='font-bold text-xs'>IDD Coordinator</p>
                  <MenuItem
                    count={iMERCCITLToEndorseCount}
                    label='To Endorse'
                    link='/imerc/citl/to_endorse'
                  />
                  <MenuItem
                    count={iMERCCITLEndorsedCount}
                    label='Endorsed'
                    link='/imerc/citl/endorsed'
                  />
                </div>
              )}
              {activeCITLDirector && (
                <div className='flex flex-col'>
                  <p className='font-bold text-xs'>CITL Director</p>
                  <MenuItem
                    count={iMERCCITLDirectorToEndorseCount}
                    label='To Endorse'
                    link='/imerc/citl/citl_director_to_endorse'
                  />
                  <MenuItem
                    count={iMERCCITLDirectorEndorsedCount}
                    label='Endorsed'
                    link='/imerc/citl/citl_director_endorsed'
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
interface MenuItemProps {
  link: string;
  label: string;
  count: number;
}
function MenuItem({ count, label, link }: MenuItemProps) {
  return (
    <Link
      href={link}
      className='rounded hover:bg-palette_grey my-1 px-1 flex justify-between items-center py-1 px-2'
    >
      <span className='flex items-center space-x-4'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          height='1.2em'
          viewBox='0 0 448 512'
          className='fill-palette_white'
        >
          <path d='M96 0C43 0 0 43 0 96V416c0 53 43 96 96 96H384h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V384c17.7 0 32-14.3 32-32V32c0-17.7-14.3-32-32-32H384 96zm0 384H352v64H96c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16zm16 48H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16s7.2-16 16-16z' />
        </svg>
        <span>{label}</span>
      </span>
      {count > 0 && (
        <div className='inline-flex items-center justify-center px-1 bg-palette_orange rounded-full text-xs font-semibold text-palette_blue '>
          {count <= 99 ? count : "99+"}
        </div>
      )}
    </Link>
  );
}
