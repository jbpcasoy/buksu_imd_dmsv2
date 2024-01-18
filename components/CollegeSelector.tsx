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
    take: Number(process.env.NEXT_PUBLIC_MAX_QUERY_TAKE),
    filter: state,
  });

  const onSearch: ChangeEventHandler<HTMLInputElement> = (e) => {
    console.log(e.target.value);
    setState((prev) => {
      return { ...prev, name: e.target.value };
    });
  };

  return (
    <div className="flex flex-col w-full">
      {/* <input
        type='text'
        onChange={onSearch}
        placeholder='Search College'
        disabled={disabled}
        className='rounded-t p-1'
      /> */}
      <select {...props} disabled={disabled} className='rounded py-1'>
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
