import useUsers from "@/hooks/useUsers";
import { FieldInputProps } from "formik";
import { ChangeEventHandler, useState } from "react";

export default function UserSelector(props: FieldInputProps<any>) {
  const [state, setState] = useState({
    name: "",
  });
  const { users, count } = useUsers({
    skip: 0,
    take: 10,
    filter: state,
  });

  const onSearch: ChangeEventHandler<HTMLInputElement> = (e) => {
    console.log(e.target.value);
    setState((prev) => {
      return { ...prev, name: e.target.value };
    });
  };

  return (
    <div>
      <input type='text' onChange={onSearch} placeholder="search"/>
      <select {...props}>
        <option value=''>Select</option>
        {users.map((user) => {
          return (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          );
        })}
      </select>
    </div>
  );
}
