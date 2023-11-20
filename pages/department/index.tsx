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
      <div className="h-full overflow-auto border border-palette_grey rounded p-1 bg-opacity-10">
        <div className='flex justify-between items-center space-x-1'>
          <div className='flex'>
            <h2 className='flex-1 border-b-2 pb-1 px-2 uppercase border-palette_orange'>
              {department?.name}
            </h2>
          </div>
          <div>
            <input
              placeholder='Name'
              className='py-1 rounded'
              onChange={handleNameChange}
            />
          </div>
        </div>
        <table className='table-auto w-full'>
          <thead>
            <tr>
              <th>IMAGE</th>
              <th>NAME</th>
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
        <div className='flex justify-end space-x-1'>
          <p>
            {state.skip} - {state.skip + state.take} of {count}
          </p>
          <button className='border rounded' onClick={previousHandler}>
            prev
          </button>
          <button className='border rounded' onClick={nextHandler}>
            next
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
        <div className='flex items-center h-full'>
          <p className='text-palette_grey'>{user?.name}</p>
        </div>
      </td>
    </tr>
  );
}
