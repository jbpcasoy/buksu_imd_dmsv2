import useDepartments from "@/hooks/useDepartments";
import { FieldInputProps } from "formik";
import { ChangeEventHandler, useEffect, useState } from "react";

interface DepartmentSelectorProps extends FieldInputProps<any> {
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
    take: Number(process.env.NEXT_PUBLIC_MAX_QUERY_TAKE),
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
    <div className="flex flex-col w-44">
      {/* <input
        type='text'
        onChange={onSearch}
        placeholder='Search Department'
        disabled={disabled}
        className='rounded-t p-1'
      /> */}
      <select {...props} disabled={disabled} className="rounded p-3">
        <option value="">Department</option>
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
