import useDepartments from "@/hooks/useDepartments";
import { FieldInputProps } from "formik";
import { ChangeEventHandler, useEffect, useState } from "react";

export interface DepartmentSelectorProps extends FieldInputProps<any> {
  collegeId?: string;
  disabled?: boolean;
}

export default function DepartmentSelector({
  collegeId,
  disabled = false,
  ...props
}: DepartmentSelectorProps) {
  const [state, setState] = useState({
    name: "",
    collegeId,
  });

  const { departments, count } = useDepartments({
    skip: 0,
    take: 10,
    filter: state,
  });

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      collegeId,
    }));
  }, [collegeId]);

  const onSearch: ChangeEventHandler<HTMLInputElement> = (e) => {
    console.log(e.target.value);
    setState((prev) => {
      return { ...prev, name: e.target.value };
    });
  };

  return (
    <div className='flex'>
      <input
        type='text'
        onChange={onSearch}
        placeholder='Search Department'
        disabled={disabled}
        className='rounded-s p-1 w-80'
      />
      <select {...props} disabled={disabled} className='rounded-e py-1'>
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
