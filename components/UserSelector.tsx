import useUsers from "@/hooks/useUsers";
import { FieldInputProps } from "formik";
import { ChangeEventHandler, useState } from "react";

export default function UserSelector(props: FieldInputProps<any>) {
  const [state, setState] = useState({
    email: "",
    name: "",
  });
  const { users, count } = useUsers({
    skip: 0,
    take: 10,
    filter: state,
  });

  const onSearchEmail: ChangeEventHandler<HTMLInputElement> = (e) => {
    console.log(e.target.value);
    setState((prev) => {
      return { ...prev, email: e.target.value };
    });
  };

  const onSearchName: ChangeEventHandler<HTMLInputElement> = (e) => {
    console.log(e.target.value);
    setState((prev) => {
      return { ...prev, name: e.target.value };
    });
  };

  return (
    <div className='flex flex-col w-full'>
      <div className='flex w-full'>
        <input
          type='text'
          onChange={onSearchEmail}
          placeholder='Search User Email'
          className='rounded-tl py-1 flex-1 w-1/2'
        />
        <input
          type='text'
          onChange={onSearchName}
          placeholder='Search User Name'
          className='rounded-tr py-1 flex-1 w-1/2'
        />
      </div>
      <select {...props} className='rounded-b py-1'>
        <option value=''>Select</option>
        {users.map((user) => {
          return (
            <option key={user.id} value={user.id}>
              {user.email} | {user.name}
            </option>
          );
        })}
      </select>
    </div>
  );
}
