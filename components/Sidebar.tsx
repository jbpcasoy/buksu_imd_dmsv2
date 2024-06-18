import useActiveCITLDirectorMe from "@/hooks/useActiveCITLDirectorMe";
import useActiveChairpersonMe from "@/hooks/useActiveChairpersonMe";
import useActiveContentSpecialistMe from "@/hooks/useActiveContentSpecialistMe";
import useActiveCoordinatorMe from "@/hooks/useActiveCoordinatorMe";
import useActiveDeanMe from "@/hooks/useActiveDeanMe";
import useActiveFacultyMe from "@/hooks/useActiveFacultyMe";
import useActiveIDDCoordinatorMe from "@/hooks/useActiveIDDCoordinatorMe";
import useTabCount from "@/hooks/useTabCount";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import SidebarIcons, { SIDEBAR_ICON_LABELS } from "./SidebarIcons";

export default function Sidebar() {
  const activeFaculty = useActiveFacultyMe();
  const activeDean = useActiveDeanMe();
  const activeIDDCoordinator = useActiveIDDCoordinatorMe();
  const activeCITLDirector = useActiveCITLDirectorMe();
  const activeCoordinator = useActiveCoordinatorMe();
  const activeChairperson = useActiveChairpersonMe();
  const activeContentSpecialist = useActiveContentSpecialistMe();
  const router = useRouter();
  const {
    cITLDirectorEndorsedCount,
    cITLDirectorToEndorseCount,
    cITLIDDEndorsedCount,
    cITLIDDToEndorseCount,
    cITLIMsCount,
    cITLReviewedCount,
    cITLToReviewCount,
    cITLToReviseCount,
    coAuthoredIMsCount,
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
    <div className="h-full w-full overflow-auto flex flex-col bg-palette_white text-palette_blue px-1">
      <div className="mt-2 flex-1 h-full overflow-auto w-full p-6">
        {(activeFaculty || activeIDDCoordinator || activeCITLDirector) && (
          <div>
            <div className="flex flex-col">
              {activeFaculty && (
                <Link
                  href="/department"
                  className={`rounded my-1 flex justify-between items-center py-1 px-2 hover:bg-palette_light_grey ${router.pathname === "/department"
                    ? "bg-palette_light_grey_2"
                    : ""
                    }`}
                >
                  <span className="flex items-center space-x-4 stroke-palette_grey">
                    <svg
                      width="18"
                      height="20"
                      viewBox="0 0 18 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.75 19H17.25M1.5 1H16.5M2.25 1V19M15.75 1V19M6 4.75H7.5M6 7.75H7.5M6 10.75H7.5M10.5 4.75H12M10.5 7.75H12M10.5 10.75H12M6 19V15.625C6 15.004 6.504 14.5 7.125 14.5H10.875C11.496 14.5 12 15.004 12 15.625V19"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="font-semibold">My Department</span>
                  </span>
                </Link>
              )}
              {activeFaculty && (
                <MenuItem
                  count={myIMsCount}
                  label="My IMs"
                  link="/department/my_ims"
                  icon={<SidebarIcons label={SIDEBAR_ICON_LABELS.MY_IMS} />}
                />
              )}
              {activeFaculty && (
                <MenuItem
                  count={coAuthoredIMsCount}
                  label="Co-authored IMs"
                  link="/department/co_authored"
                  icon={
                    <SidebarIcons label={SIDEBAR_ICON_LABELS.CO_AUTHORED} />
                  }
                />
              )}

              {(activeCoordinator || activeChairperson) && (
                <MenuItem
                  count={departmentIMsCount}
                  label="Department IMs"
                  link="/department/all_ims"
                  icon={
                    <SidebarIcons label={SIDEBAR_ICON_LABELS.DEPARTMENT_IMS} />
                  }
                />
              )}
              {activeDean && (
                <MenuItem
                  count={collegeIMsCount}
                  label="College IMs"
                  link="/college/all_ims"
                  icon={
                    <SidebarIcons label={SIDEBAR_ICON_LABELS.COLLEGE_IMS} />
                  }
                />
              )}
              {(activeCITLDirector || activeIDDCoordinator) && (
                <MenuItem
                  count={cITLIMsCount}
                  label="All IMs"
                  link="/citl/all_ims"
                  icon={<SidebarIcons label={SIDEBAR_ICON_LABELS.ALL_IMS} />}
                />
              )}
            </div>
            <p className=" text-palette_grey py-2 font-light text-sm">
              IMPLEMENTATION PHASE
            </p>
            {activeFaculty && (
              <div className="flex flex-col">
                <p className=" text-palette_grey py-2 font-light text-sm">
                  DEPARTMENT
                </p>
                {activeFaculty && (
                  <MenuItem
                    count={toReviseCount}
                    label="To Revise"
                    link="/department/to_revise"
                    icon={
                      <SidebarIcons label={SIDEBAR_ICON_LABELS.TO_REVISE} />
                    }
                  />
                )}
                {activeFaculty && (
                  <MenuItem
                    count={toReviewCount}
                    label="To Review"
                    link="/department/to_review"
                    icon={
                      <SidebarIcons label={SIDEBAR_ICON_LABELS.TO_REVIEW} />
                    }
                  />
                )}
                {activeFaculty && (
                  <MenuItem
                    count={reviewedCount}
                    label="Reviewed"
                    link="/department/reviewed"
                    icon={<SidebarIcons label={SIDEBAR_ICON_LABELS.REVIEWED} />}
                  />
                )}
                {activeCoordinator && (
                  <MenuItem
                    count={coordinatorToEndorseCount}
                    label="To Endorse"
                    link="/department/to_endorse"
                    icon={
                      <SidebarIcons label={SIDEBAR_ICON_LABELS.TO_ENDORSE} />
                    }
                  />
                )}
                {activeCoordinator && (
                  <MenuItem
                    count={coordinatorEndorsedCount}
                    label="Endorsed"
                    link="/department/endorsed"
                    icon={<SidebarIcons label={SIDEBAR_ICON_LABELS.ENDORSED} />}
                  />
                )}
              </div>
            )}
            {activeDean && (
              <div className="flex flex-col">
                <p className=" text-palette_grey py-2 font-light text-sm">COLLEGE</p>

                {activeDean && (
                  <MenuItem
                    count={deanToEndorseCount}
                    label="To Endorse"
                    link="/college/to_endorse"
                    icon={
                      <SidebarIcons label={SIDEBAR_ICON_LABELS.TO_ENDORSE} />
                    }
                  />
                )}
                {activeDean && (
                  <MenuItem
                    count={deanEndorsedCount}
                    label="Endorsed"
                    link="/college/endorsed"
                    icon={<SidebarIcons label={SIDEBAR_ICON_LABELS.ENDORSED} />}
                  />
                )}
              </div>
            )}
            {(activeFaculty || activeIDDCoordinator || activeCITLDirector) && (
              <div className="flex flex-col">
                <p className=" text-palette_grey py-2 font-light text-sm">CITL</p>

                {activeFaculty && (
                  <MenuItem
                    count={cITLToReviseCount}
                    label="To Revise"
                    link="/citl/to_revise"
                    icon={
                      <SidebarIcons label={SIDEBAR_ICON_LABELS.TO_REVISE} />
                    }
                  />
                )}
                {activeIDDCoordinator && (
                  <div className="flex flex-col">
                    <p className=" text-palette_grey py-2 font-light text-sm">
                      IDD COORDINATOR
                    </p>

                    <MenuItem
                      count={cITLToReviewCount}
                      label="To Review"
                      link="/citl/to_review"
                      icon={
                        <SidebarIcons label={SIDEBAR_ICON_LABELS.TO_REVIEW} />
                      }
                    />
                    <MenuItem
                      count={cITLReviewedCount}
                      label="Reviewed"
                      link="/citl/reviewed"
                      icon={
                        <SidebarIcons label={SIDEBAR_ICON_LABELS.REVIEWED} />
                      }
                    />
                  </div>
                )}
                {activeIDDCoordinator && (
                  <MenuItem
                    count={cITLIDDToEndorseCount}
                    label="To Endorse"
                    link="/citl/to_endorse"
                    icon={
                      <SidebarIcons label={SIDEBAR_ICON_LABELS.TO_ENDORSE} />
                    }
                  />
                )}
                {activeIDDCoordinator && (
                  <MenuItem
                    count={cITLIDDEndorsedCount}
                    label="Endorsed"
                    link="/citl/endorsed"
                    icon={<SidebarIcons label={SIDEBAR_ICON_LABELS.ENDORSED} />}
                  />
                )}
                {activeCITLDirector && (
                  <div className="flex flex-col">
                    <p className=" text-palette_grey py-2 font-light text-sm">
                      CITL DIRECTOR
                    </p>
                    <MenuItem
                      count={cITLDirectorToEndorseCount}
                      label="To Endorse"
                      link="/citl/citl_director_to_endorse"
                      icon={
                        <SidebarIcons label={SIDEBAR_ICON_LABELS.TO_ENDORSE} />
                      }
                    />
                    <MenuItem
                      count={cITLDirectorEndorsedCount}
                      label="Endorsed"
                      link="/citl/citl_director_endorsed"
                      icon={
                        <SidebarIcons label={SIDEBAR_ICON_LABELS.ENDORSED} />
                      }
                    />
                  </div>
                )}
              </div>
            )}
            <hr />

            <p className=" text-palette_grey py-2 font-light text-sm">IMERC</p>
            {activeFaculty && (
              <div className="flex flex-col">
                <p className=" text-palette_grey py-2 font-light text-sm">
                  DEPARTMENT
                </p>
                {activeFaculty && (
                  <MenuItem
                    count={iMERCToReviseCount}
                    label="To Revise"
                    link="/imerc/department/to_revise"
                    icon={
                      <SidebarIcons label={SIDEBAR_ICON_LABELS.TO_REVISE} />
                    }
                  />
                )}
                {activeContentSpecialist && (
                  <MenuItem
                    count={iMERCToReviewCount}
                    label="To Review"
                    link="/imerc/department/to_review"
                    icon={
                      <SidebarIcons label={SIDEBAR_ICON_LABELS.TO_REVIEW} />
                    }
                  />
                )}
                {activeContentSpecialist && (
                  <MenuItem
                    count={iMERCReviewedCount}
                    label="Reviewed"
                    link="/imerc/department/reviewed"
                    icon={<SidebarIcons label={SIDEBAR_ICON_LABELS.REVIEWED} />}
                  />
                )}
                {(activeCoordinator || activeChairperson) && (
                  <MenuItem
                    count={iMERCToEndorseCount}
                    label="To Endorse"
                    link="/imerc/department/to_endorse"
                    icon={
                      <SidebarIcons label={SIDEBAR_ICON_LABELS.TO_ENDORSE} />
                    }
                  />
                )}
                {(activeCoordinator || activeChairperson) && (
                  <MenuItem
                    count={iMERCEndorsedCount}
                    label="Endorsed"
                    link="/imerc/department/endorsed"
                    icon={<SidebarIcons label={SIDEBAR_ICON_LABELS.ENDORSED} />}
                  />
                )}
              </div>
            )}
            {activeDean && (
              <div className="flex flex-col">
                <p className=" text-palette_grey py-2 font-light text-sm">COLLEGE</p>
                <MenuItem
                  count={iMERCCollegeToEndorseCount}
                  label="To Endorse"
                  link="/imerc/college/to_endorse"
                  icon={<SidebarIcons label={SIDEBAR_ICON_LABELS.TO_ENDORSE} />}
                />
                <MenuItem
                  count={iMERCCollegeEndorsedCount}
                  label="Endorsed"
                  link="/imerc/college/endorsed"
                  icon={<SidebarIcons label={SIDEBAR_ICON_LABELS.ENDORSED} />}
                />
              </div>
            )}

            {(activeFaculty || activeIDDCoordinator || activeCITLDirector) && (
              <div className="flex flex-col">
                <p className=" text-palette_grey py-2 font-light text-sm">CITL</p>

                {activeFaculty && (
                  <MenuItem
                    count={iMERCCITLToReviseCount}
                    label="To Revise"
                    link="/imerc/citl/to_revise"
                    icon={
                      <SidebarIcons label={SIDEBAR_ICON_LABELS.TO_REVISE} />
                    }
                  />
                )}
                {(activeIDDCoordinator || activeCITLDirector) && (
                  <MenuItem
                    count={iMERCCITLToReviewCount}
                    label="To Review"
                    link="/imerc/citl/to_review"
                    icon={
                      <SidebarIcons label={SIDEBAR_ICON_LABELS.TO_REVIEW} />
                    }
                  />
                )}
                {(activeIDDCoordinator || activeCITLDirector) && (
                  <MenuItem
                    count={iMERCReviewedByCITLCount}
                    label="Reviewed"
                    link="/imerc/citl/reviewed"
                    icon={<SidebarIcons label={SIDEBAR_ICON_LABELS.REVIEWED} />}
                  />
                )}
                {activeIDDCoordinator && (
                  <div className="flex flex-col">
                    <p className=" text-palette_grey py-2 font-light text-sm">
                      IDD Coordinator
                    </p>
                    <MenuItem
                      count={iMERCCITLToEndorseCount}
                      label="To Endorse"
                      link="/imerc/citl/to_endorse"
                      icon={
                        <SidebarIcons label={SIDEBAR_ICON_LABELS.TO_ENDORSE} />
                      }
                    />
                    <MenuItem
                      count={iMERCCITLEndorsedCount}
                      label="Endorsed"
                      link="/imerc/citl/endorsed"
                      icon={
                        <SidebarIcons label={SIDEBAR_ICON_LABELS.ENDORSED} />
                      }
                    />
                  </div>
                )}
                {activeCITLDirector && (
                  <div className="flex flex-col">
                    <p className=" text-palette_grey py-2 font-light text-sm">
                      CITL Director
                    </p>
                    <MenuItem
                      count={iMERCCITLDirectorToEndorseCount}
                      label="To Endorse"
                      link="/imerc/citl/citl_director_to_endorse"
                      icon={
                        <SidebarIcons label={SIDEBAR_ICON_LABELS.TO_ENDORSE} />
                      }
                    />
                    <MenuItem
                      count={iMERCCITLDirectorEndorsedCount}
                      label="Endorsed"
                      link="/imerc/citl/citl_director_endorsed"
                      icon={
                        <SidebarIcons label={SIDEBAR_ICON_LABELS.ENDORSED} />
                      }
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <hr />
      <div className="text-xs text-palette_grey pt-3 w-full text-center">
        <p>
          Bukidnon State University |{" "}
          <span title="Center for Innovative Teaching and Learning">CITL</span>
        </p>
        <div className="flex justify-center space-x-4 py-2">
          <Link href="https://m.me/110429694111266" target="_blank">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="2em"
              viewBox="0 0 512 512"
              className="fill-palette_grey"
            >
              <path d="M256.55 8C116.52 8 8 110.34 8 248.57c0 72.3 29.71 134.78 78.07 177.94 8.35 7.51 6.63 11.86 8.05 58.23A19.92 19.92 0 0 0 122 502.31c52.91-23.3 53.59-25.14 62.56-22.7C337.85 521.8 504 423.7 504 248.57 504 110.34 396.59 8 256.55 8zm149.24 185.13l-73 115.57a37.37 37.37 0 0 1-53.91 9.93l-58.08-43.47a15 15 0 0 0-18 0l-78.37 59.44c-10.46 7.93-24.16-4.6-17.11-15.67l73-115.57a37.36 37.36 0 0 1 53.91-9.93l58.06 43.46a15 15 0 0 0 18 0l78.41-59.38c10.44-7.98 24.14 4.54 17.09 15.62z" />
            </svg>
          </Link>

          <Link href="https://buksu.edu.ph" target="_blank">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="2em"
              viewBox="0 0 512 512"
              className="fill-palette_grey"
            >
              <path d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z" />
            </svg>
          </Link>
          <Link href="mailto:citl@buksu.edu.ph" target="_blank">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="2em"
              viewBox="0 0 512 512"
              className="fill-palette_grey"
            >
              <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
interface MenuItemProps {
  link: string;
  label: string;
  count: number;
  icon?: ReactNode;
}

const DefaultIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="1.2em"
      viewBox="0 0 448 512"
      className="fill-palette_grey"
    >
      <path d="M96 0C43 0 0 43 0 96V416c0 53 43 96 96 96H384h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V384c17.7 0 32-14.3 32-32V32c0-17.7-14.3-32-32-32H384 96zm0 384H352v64H96c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16zm16 48H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H144c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
    </svg>
  );
};
function MenuItem({
  count,
  label,
  link,
  icon = <DefaultIcon />,
}: MenuItemProps) {
  const router = useRouter();
  return (
    <Link
      href={link}
      className={`rounded my-1 flex justify-between items-center py-1 px-2 hover:bg-palette_light_grey ${router.pathname === link ? "bg-palette_light_grey_2" : ""
        }`}
    >
      <span className="flex items-center space-x-4">
        <span className="stroke-palette_grey">{icon}</span>
        <span className="font-semibold">{label}</span>
      </span>
      {count > 0 && (
        <div className="flex items-center justify-center bg-palette_orange rounded-full text-xs font-semibold text-palette_blue h-5 w-5 lg:h-6 lg:w-6">
          {count <= 99 ? count : "99+"}
        </div>
      )}
    </Link>
  );
}
