import useFaculties from "@/hooks/useFaculties";
import useFaculty from "@/hooks/useFaculty";
import useUser from "@/hooks/useUser";
import { FieldInputProps } from "formik";
import { ChangeEventHandler, useState } from "react";

interface FacultySelectorItemProps {
  id: string;
}
function FacultySelectorItem({ id }: FacultySelectorItemProps) {
  const faculty = useFaculty({ id });
  const user = useUser({ id: faculty?.userId ?? "" });

  if (!user || !faculty || !faculty) return null;

  return (
    <option key={faculty.id} value={faculty.id}>
      {user.name}
    </option>
  );
}

export default function FacultySelector(props: FieldInputProps<any>) {
  const [state, setState] = useState({
    name: "",
  });
  const { faculties, count } = useFaculties({
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
      <input type='text' onChange={onSearch} placeholder='Search faculty' />
      <select {...props}>
        <option value=''>Select</option>
        {faculties.map((faculty) => {
          return <FacultySelectorItem key={faculty.id} id={faculty.id} />;
        })}
      </select>
    </div>
  );
}
