import MainLayout from "@/components/MainLayout";
import useActiveFaculties from "@/hooks/useActiveFaculties";
import useDepartmentMe from "@/hooks/useDepartmentMe";
import useUserActiveFaculty from "@/hooks/useUserActiveFaculty";
import { ActiveFaculty } from "@prisma/client";
import { ChangeEventHandler, useState } from "react";

export default function DepartmentPage() {
  const [state, setState] = useState({
    take: 10,
    skip: 0,
    filter: {
      name: "",
    },
  });
  const department = useDepartmentMe();
  const { activeFaculties, count } = useActiveFaculties(state);

  const nextHandler = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return { ...prev, skip: nextVal < count ? nextVal : prev.skip };
    });
  };

  const previousHandler = () => {
    setState((prev) => {
      const nextVal = prev.skip - prev.take;
      console.log({ prev, nextVal });

      return { ...prev, skip: nextVal >= 0 ? nextVal : prev.skip };
    });
  };

  const handleNameChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setState((prev) => ({
      ...prev,
      filter: {
        ...prev.filter,
        name: e.target.value,
      },
    }));
  };

  return (
    <MainLayout>
      <div className="h-full overflow-auto bg-palette_white rounded-2xl p-4 flex flex-col">
        <div className="flex justify-between items-center space-x-1 overflow-auto">
          <div className="flex border rounded-lg p-2 border-palette_orange space-x-2 items-center justify-center font-bold">
            <svg
              width="18"
              height="20"
              viewBox="0 0 18 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-palette_grey"
            >
              <path
                d="M0.75 19H17.25M1.5 1H16.5M2.25 1V19M15.75 1V19M6 4.75H7.5M6 7.75H7.5M6 10.75H7.5M10.5 4.75H12M10.5 7.75H12M10.5 10.75H12M6 19V15.625C6 15.004 6.504 14.5 7.125 14.5H10.875C11.496 14.5 12 15.004 12 15.625V19"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h2 className="flex-1 text-sm font-semibold  whitespace-nowrap">
              {department?.name}
            </h2>
          </div>
          <div className="p-2 flex items-center justify-center bg-palette_light_grey rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>

            <input
              placeholder="Search"
              className="p-2 border-0 focus:border-0 focus:ring-0 bg-palette_light_grey "
              onChange={handleNameChange}
            />
          </div>
        </div>
        <table className="table-auto w-full ">
          {/* <thead>
            <tr>
              <th className="font-normal">IMAGE</th>
              <th className="font-normal">NAME</th>
            </tr>
          </thead> */}
          <tbody>
            {activeFaculties.map((activeFaculty) => {
              return (
                <ActiveFacultyItem
                  activeFaculty={activeFaculty}
                  key={activeFaculty.id}
                />
              );
            })}
          </tbody>
        </table>
        <div className="flex-1"></div>
        <div className="flex justify-end items-center space-x-1 ">
          <p className="">
            {state.skip} - {state.skip + state.take} of {count}
          </p>
          <button
            disabled={state.skip - state.take < 0}
            className="rounded bg-palette_blue text-palette_white fill-palette_white flex space-x-1 items-center px-1 hover:bg-opacity-90 disabled:bg-opacity-50 "
            onClick={previousHandler}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 448 512"
            >
              <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
            </svg>
            <span>Previous</span>
          </button>
          <button
            disabled={state.skip + state.take >= count}
            className="rounded bg-palette_blue text-palette_white fill-palette_white flex space-x-1 items-center px-1 hover:bg-opacity-90 disabled:bg-opacity-50 "
            onClick={nextHandler}
          >
            <span>Next</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 448 512"
              className="fill-inherit"
            >
              <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
            </svg>
          </button>
        </div>
      </div>
    </MainLayout>
  );
}

function ActiveFacultyItem({
  activeFaculty,
}: {
  activeFaculty: ActiveFaculty;
}) {
  const user = useUserActiveFaculty({ id: activeFaculty.id });
  return (
    <tr className="border-b">
      <td className="w-20">
        <div className="flex justify-center">
          <picture>
            <img
              src={user?.image ?? "/images/buksu-logo-min-512x512.png"}
              onError={(e) => {
                e.currentTarget.src = "/images/buksu-logo-min-512x512.png";
              }}
              className="h-10 w-10 rounded-full m-1 object-cover"
              alt="User avatar"
            />
          </picture>
        </div>
      </td>
      <td>
        <p className="text-palette_grey text-left">{user?.name}</p>
      </td>
    </tr>
  );
}
