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
    <div>
      <input
        type='text'
        onChange={onSearch}
        placeholder='Search department'
        disabled={disabled}
      />
      <select {...props} disabled={disabled}>
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
