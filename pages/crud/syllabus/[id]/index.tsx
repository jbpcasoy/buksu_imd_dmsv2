import CrudLayout from "@/components/CrudLayout";
import useSyllabus from "@/hooks/useSyllabus";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function SyllabusPage() {
  const router = useRouter();
  const syllabusId = router.query.id as string;
  const syllabus = useSyllabus({ id: syllabusId });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/syllabus/${syllabusId}`)
      .then(() => {
        alert("Syllabus has been delete Successfully");
      })
      .catch((error: any) => {
        alert(error.response?.data?.error?.message?.message);
      });
  };

  if (!syllabus) return null;

  return (
    <CrudLayout>
      <div className="flex">
        <h2 className="flex-1">Syllabus</h2>
        <div className="space-x-1">
          <Link
            className="border rounded"
            href={`/crud/syllabus/${syllabusId}/edit`}
          >
            edit
          </Link>
          <button className="border rounded" onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {syllabus.id}</p>
      <p>createdAt: {new Date(syllabus.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(syllabus.updatedAt).toLocaleString()}</p>
      <p>courseTitle: {syllabus.courseTitle}</p>
      <p>courseCode: {syllabus.courseCode}</p>
      <p>faculty: {syllabus.facultyId}</p>
    </CrudLayout>
  );
}
