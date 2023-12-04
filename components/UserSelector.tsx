import useUsers from "@/hooks/useUsers";
import { FieldInputProps } from "formik";
import { ChangeEventHandler, useState } from "react";

export default function UserSelector(props: FieldInputProps<any>) {
  const [state, setState] = useState({
    email: "",
  });
  const { users, count } = useUsers({
    skip: 0,
    take: 10,
    filter: state,
  });

  const onSearch: ChangeEventHandler<HTMLInputElement> = (e) => {
    console.log(e.target.value);
    setState((prev) => {
      return { ...prev, email: e.target.value };
    });
  };

  return (
    <div className='flex flex-col'>
      <input
        type='text'
        onChange={onSearch}
        placeholder='Search User Email'
        className='rounded-t py-1'
      />
      <select {...props} className='rounded-b py-1'>
        <option value=''>Select</option>
        {users.map((user) => {
          return (
            <option key={user.id} value={user.id}>
              {user.email}
            </option>
          );
        })}
      </select>
    </div>
  );
}
