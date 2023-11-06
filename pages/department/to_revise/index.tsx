import MainLayout from "@/components/MainLayout";
import useToRevise from "@/hooks/useToRevise";
import Link from "next/link";
import { ChangeEventHandler, useState } from "react";

export default function ToReviewPage() {
  const [state, setState] = useState({
    take: 10,
    skip: 0,
    filter: {
      title: "",
      userName: "",
      departmentName: "",
      collegeName: "",
    },
  });

  const { iMs, count } = useToRevise(state);

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
  const handleTitleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setState((prev) => ({
      ...prev,
      filter: {
        ...prev.filter,
        title: e.target.value ?? "",
      },
    }));
  };
  const handleUserNameChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setState((prev) => ({
      ...prev,
      filter: {
        ...prev.filter,
        userName: e.target.value ?? "",
      },
    }));
  };
  const handleDepartmentNameChange: ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    setState((prev) => ({
      ...prev,
      filter: {
        ...prev.filter,
        departmentName: e.target.value ?? "",
      },
    }));
  };
  const handleCollegeNameChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setState((prev) => ({
      ...prev,
      filter: {
        ...prev.filter,
        collegeName: e.target.value ?? "",
      },
    }));
  };

  return (
    <MainLayout>
      <div className='flex'>
        <h2 className='flex-1'>To Revise</h2>
      </div>
      <div>
        <input type='text' placeholder='title' onChange={handleTitleChange} />
        <input
          type='text'
          placeholder='userName'
          onChange={handleUserNameChange}
        />
        <input
          type='text'
          placeholder='departmentName'
          onChange={handleDepartmentNameChange}
        />
        <input
          type='text'
          placeholder='collegeName'
          onChange={handleCollegeNameChange}
        />
      </div>
      <table className='table-auto w-full'>
        <thead>
          <tr>
            <th>id</th>
            <th>createdAt</th>
            <th>updatedAt</th>
            <th>facultyId</th>
            <th>title</th>
            <th>type</th>
            <th>actions</th>
          </tr>
        </thead>
        <tbody>
          {iMs.map((iM) => {
            return (
              <tr key={iM.id}>
                <td>{iM.id}</td>
                <td>{new Date(iM.createdAt).toLocaleString()}</td>
                <td>{new Date(iM.updatedAt).toLocaleString()}</td>
                <td>{iM.facultyId}</td>
                <td>{iM.title}</td>
                <td>{iM.type}</td>
                <td>
                  <Link href={`/im/${iM.id}`} className='border rounded'>
                    view
                  </Link>
                </td>
              </tr>
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
