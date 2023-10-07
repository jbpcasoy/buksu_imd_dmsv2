import useDepartments from "@/hooks/useDepartments";
import { FieldInputProps } from "formik";
import { ChangeEventHandler, useState } from "react";

export default function DepartmentSelector(props: FieldInputProps<any>) {
  const [state, setState] = useState({
    name: "",
  });
  const { departments, count } = useDepartments({
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
        {departments.map((department) => {
          return (
            <option key={department.id} value={department.id}>
              {department.name}
            </option>
          );
        })}
      </select>
    </div>
  );
}
