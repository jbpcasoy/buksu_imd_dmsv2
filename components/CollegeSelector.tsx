import useColleges from "@/hooks/useColleges";
import { FieldInputProps } from "formik";
import { ChangeEventHandler, useState } from "react";

export default function CollegeSelector(props: FieldInputProps<any>) {
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
    <div>
      <input type='text' onChange={onSearch} placeholder="Search college"/>
      <select {...props}>
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
