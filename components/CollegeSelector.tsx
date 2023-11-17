import useColleges from "@/hooks/useColleges";
import { FieldInputProps } from "formik";
import { ChangeEventHandler, useState } from "react";

export interface CollegeSelectorProps extends FieldInputProps<any> {
  collegeId?: string;
  disabled?: boolean;
}

export default function CollegeSelector({
  collegeId,
  disabled = false,
  ...props
}: CollegeSelectorProps) {
  const [state, setState] = useState({
    name: "",
  });
  const { colleges, count } = useColleges({
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
    <div className="flex">
      <input
        type='text'
        onChange={onSearch}
        placeholder='Search College'
        disabled={disabled}
        className='rounded-s p-1 w-80'
      />
      <select {...props} disabled={disabled} className='rounded-e py-1'>
        <option value=''>Select</option>
        {colleges.map((college) => {
          return (
            <option key={college.id} value={college.id}>
              {college.name}
            </option>
          );
        })}
      </select>
    </div>
  );
}
