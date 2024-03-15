import useActiveFaculties from "@/hooks/useActiveFaculties";
import useActiveFaculty from "@/hooks/useActiveFaculty";
import useFaculty from "@/hooks/useFaculty";
import useUser from "@/hooks/useUser";
import { FieldInputProps } from "formik";
import { ChangeEventHandler, useState } from "react";

interface FacultySelectorItemProps {
  id: string;
}
function FacultySelectorItem({ id }: FacultySelectorItemProps) {
  const activeFaculty = useActiveFaculty({ id });
  const faculty = useFaculty({ id: activeFaculty?.facultyId ?? "" });
  const user = useUser({ id: faculty?.userId ?? "" });

  if (!user || !faculty || !activeFaculty) return null;

  return (
    <option key={activeFaculty.id} value={activeFaculty.id}>
      {user.name}
    </option>
  );
}

export default function ActiveFacultySelector(props: FieldInputProps<any>) {
  const [state, setState] = useState({
    name: "",
  });
  const { activeFaculties, count } = useActiveFaculties({
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
    <div className="flex flex-col">
      <input
        type="text"
        onChange={onSearch}
        placeholder="Search Faculty"
        className="rounded-t py-1"
      />
      <select {...props} className="rounded-b py-1">
        <option value="">Select</option>
        {activeFaculties.map((faculty) => {
          return <FacultySelectorItem key={faculty.id} id={faculty.id} />;
        })}
      </select>
    </div>
  );
}
