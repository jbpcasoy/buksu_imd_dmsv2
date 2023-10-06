import ActiveFacultyContext from "@/contexts/ActiveFacultyContext";
import Link from "next/link";
import { useContext } from "react";

export default function Sidebar() {
  const activeFaculty = useContext(ActiveFacultyContext);

  return (
    <div>
      {activeFaculty && <Link href="/my_ims" className="underline">My IM's</Link>}
    </div>
  );
}
