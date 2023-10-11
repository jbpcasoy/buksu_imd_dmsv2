import CrudLayout from "@/components/CrudLayout";
import useChairperson from "@/hooks/useChairperson";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function ChairpersonPage() {
  const router = useRouter();
  const chairpersonId = router.query.id;
  const chairperson = useChairperson({ id: chairpersonId as string });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/chairperson/${chairpersonId}`)
      .then(() => {
        alert("Chairperson deleted successfully.");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!chairperson) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>Chairperson</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {chairperson.id}</p>
      <p>createdAt: {new Date(chairperson.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(chairperson.updatedAt).toLocaleString()}</p>
      <p>
        facultyId:{" "}
        <Link
          href={`/crud/faculty/${chairperson.facultyId}`}
          className='underline'
        >
          {chairperson.facultyId}
        </Link>
      </p>
    </CrudLayout>
  );
}
