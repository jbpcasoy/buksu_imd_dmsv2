import AdminLayout from "@/components/AdminLayout";
import useIMs from "@/hooks/useIMs";
import Link from "next/link";
import { ChangeEventHandler, useState } from "react";

export default function IMsPage() {
  const [state, setState] = useState({
    skip: 0,
    take: 10,
    filter: {
      title: "",
      userName: "",
      departmentName: "",
      collegeName: "",
    },
  });
  const { iMs, count } = useIMs(state);

  const handleNext = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return { ...prev, skip: nextVal <= count ? nextVal : prev.skip };
    });
  };

  const handlePrev = () => {
    setState((prev) => {
      const nextVal = prev.skip - prev.take;
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
    <AdminLayout>
      <div className='flex justify-between'>
        <h2>IM</h2>
        <Link className='border rounded' href={`/admin/im/add`}>
          Add
        </Link>
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

      <div>
        <table className='table-auto w-full'>
          <thead>
            <tr>
              <th>id</th>
              <th>createdAt</th>
              <th>updatedAt</th>
              <th>title</th>
              <th>type</th>
              <th>faculty</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {iMs.map((iM) => {
              return (
                <tr key={iM.id}>
                  <td>{iM.id}</td>
                  <td>{new Date(iM.createdAt).toLocaleString()}</td>
                  <td>{new Date(iM.updatedAt).toLocaleString()}</td>
                  <td>{iM.title}</td>
                  <td>{iM.type}</td>
                  <td>
                    <Link
                      href={`/admin/faculty/${iM.facultyId}`}
                      className='underline'
                    >
                      {iM.facultyId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/admin/im/${iM.id}`}
                      className='border rounded'
                    >
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
          <button className='border rounded' onClick={handlePrev}>
            prev
          </button>
          <button className='border rounded' onClick={handleNext}>
            next
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
