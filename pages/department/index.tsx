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
      <div className='h-full overflow-auto border border-palette_grey rounded p-1 bg-opacity-10 flex flex-col'>
        <div className='flex justify-between items-center space-x-1 overflow-auto'>
          <div className='flex'>
            <h2 className='flex-1 border-b-2 pb-1 px-2 uppercase border-palette_orange whitespace-nowrap'>
              {department?.name}
            </h2>
          </div>
          <div>
            <input
              placeholder='Name'
              className='py-1 rounded focus:border-palette_grey focus:ring-palette_grey'
              onChange={handleNameChange}
            />
          </div>
        </div>
        <table className='table-auto w-full flex-1 h-full text-sm'>
          <thead>
            <tr>
              <th className='font-normal'>IMAGE</th>
              <th className='font-normal'>NAME</th>
            </tr>
          </thead>
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
        <div className='flex justify-end items-center space-x-1 text-sm'>
          <p className='text-xs'>
            {state.skip} - {state.skip + state.take} of {count}
          </p>
          <button
            disabled={state.skip - state.take < 0}
            className='rounded bg-palette_blue text-palette_white fill-palette_white flex space-x-1 items-center px-1 hover:bg-opacity-90 disabled:bg-opacity-50'
            onClick={previousHandler}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              height='1em'
              viewBox='0 0 448 512'
            >
              <path d='M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z' />
            </svg>
            <span>Previous</span>
          </button>
          <button
            disabled={state.skip + state.take >= count}
            className='rounded bg-palette_blue text-palette_white fill-palette_white flex space-x-1 items-center px-1 hover:bg-opacity-90 disabled:bg-opacity-50'
            onClick={nextHandler}
          >
            <span>Next</span>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              height='1em'
              viewBox='0 0 448 512'
              className='fill-inherit'
            >
              <path d='M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z' />
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
    <tr>
      <td className='w-20'>
        <div className='flex justify-center'>
          <picture>
            <img
              src={user?.image ?? ""}
              className='h-10 w-10 rounded-full m-1'
              alt='User avatar'
            />
          </picture>
        </div>
      </td>
      <td>
        <p className='text-palette_grey text-center'>{user?.name}</p>
      </td>
    </tr>
  );
}
