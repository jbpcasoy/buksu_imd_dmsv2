import CrudLayout from "@/components/CrudLayout";
import useFaculty from "@/hooks/useFaculty";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function FacultyPage() {
  const router = useRouter();
  const facultyId = router.query.id;
  const faculty = useFaculty({ id: facultyId as string });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/faculty/${facultyId}`)
      .then(() => {
        alert("Faculty deleted successfully.");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  if (!faculty) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>Faculty</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {faculty.id}</p>
      <p>createdAt: {new Date(faculty.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(faculty.updatedAt).toLocaleString()}</p>
      <p>
        userId:{" "}
        <Link
          href={`/crud/user/${faculty.userId}`}
          className='underline'
        >
          {faculty.userId}
        </Link>
      </p>
      <p>
        departmentId:{" "}
        <Link
          href={`/crud/department/${faculty.departmentId}`}
          className='underline'
        >
          {faculty.departmentId}
        </Link>
      </p>
    </CrudLayout>
  );
}
