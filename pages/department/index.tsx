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
      <div className='flex'>
        <h2 className='flex-1'>{department?.name}</h2>
      </div>
      <div>
        <input placeholder='Name' onChange={handleNameChange} />
      </div>
      <table className='table-auto w-full'>
        <thead>
          <tr>
            <th>id</th>
            <th>createdAt</th>
            <th>updatedAt</th>
            <th>facultyId</th>
            <th>name</th>
            <th>image</th>
            {/* <th>actions</th> */}
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
      <td>{activeFaculty.id}</td>
      <td>{new Date(activeFaculty.createdAt).toLocaleString()}</td>
      <td>{new Date(activeFaculty.updatedAt).toLocaleString()}</td>
      <td>{activeFaculty.facultyId}</td>
      <td>{user?.name}</td>
      <td>
        <picture>
          <img src={user?.image ?? ""} className='h-10 w-10 rounded-full m-1' alt="User avatar" />
        </picture>
      </td>
      {/* <td>
      <Link href={`/im/${activeFaculty.id}`} className='border rounded'>
        view
      </Link>
    </td> */}
    </tr>
  );
}
