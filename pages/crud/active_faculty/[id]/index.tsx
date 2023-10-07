import CrudLayout from "@/components/CrudLayout";
import useActiveFaculty from "@/hooks/useActiveFaculty";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ActiveFacultyPage() {
  const router = useRouter();
  const activeFacultyId = router.query.id;
  const activeFaculty = useActiveFaculty({ id: activeFacultyId as string });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/active_faculty/${activeFacultyId}`)
      .then(() => {
        alert("ActiveFaculty deleted successfully.");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  if (!activeFaculty) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>ActiveFaculty</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {activeFaculty.id}</p>
      <p>createdAt: {new Date(activeFaculty.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(activeFaculty.updatedAt).toLocaleString()}</p>
      <p>
        facultyId:{" "}
        <Link
          href={`/crud/faculty/${activeFaculty.facultyId}`}
          className='underline'
        >
          {activeFaculty.facultyId}
        </Link>
      </p>
    </CrudLayout>
  );
}
