import ActiveFacultyContext from "@/contexts/ActiveFacultyContext";
import { useContext } from "react";

export default function Sidebar() {
  const activeFaculty = useContext(ActiveFacultyContext);

  return (
    <div>
      {activeFaculty && <a href="/my_ims">My IM's</a>}
    </div>
  );
}
