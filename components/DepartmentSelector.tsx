import useDepartments from "@/hooks/useDepartments";
import { FieldInputProps } from "formik";
import { ChangeEventHandler, useEffect, useState } from "react";

interface DepartmentSelectorProps extends FieldInputProps<any> {
  collegeId?: string;
  disabled?: boolean;
  compact?: boolean;
}

export default function DepartmentSelector({
  collegeId,
  disabled = false,
  compact = false,
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


  const findDepartmentName = (departmentId?: string) => {
    if (!departmentId) return "";
    let name = "";

    departments?.forEach((department) => {
      if (department.id === departmentId) {
        name = department.name;
        return;
      }
    })

    return name;
  }

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
    <div className={`flex flex-col ${compact ? "w-full" : "w-full sm:w-44"}`}>
      {/* <input
        type='text'
        onChange={onSearch}
        placeholder='Search Department'
        disabled={disabled}
        className='rounded-t p-1'
      /> */}
      <select
        {...props}
        disabled={disabled}
        className={`text-ellipsis overflow-hidden rounded-lg border border-palette_light_grey disabled:border-opacity-80 text-sm focus:border-palette_light_grey focus:outline-0 focus:ring-0 ${compact ? "" : "p-2 pr-7"}`}
        title={findDepartmentName(props?.value)}
      >
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
