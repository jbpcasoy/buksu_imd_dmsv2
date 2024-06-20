import useColleges from "@/hooks/useColleges";
import { FieldInputProps } from "formik";
import { ChangeEventHandler, useState } from "react";

interface CollegeSelectorProps extends FieldInputProps<any> {
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

  const findCollegeName = (collegeId?: string) => {
    if (!collegeId) return "";
    let name = "";

    colleges?.forEach((college) => {
      if (college.id === collegeId) {
        name = college.name;
        return;
      }
    })

    return name;
  }

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
        placeholder='Search College'
        disabled={disabled}
        className='rounded-t p-1'
      /> */}
      <select {...props} disabled={disabled} className="p-2 pr-7 text-ellipsis overflow-hidden rounded-lg border border-palette_light_grey disabled:border-opacity-80 text-sm focus:border-palette_light_grey focus:outline-0 focus:ring-0 " title={findCollegeName(props?.value)}>
        <option value="">College</option>
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
