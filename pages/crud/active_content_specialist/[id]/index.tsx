import CrudLayout from "@/components/CrudLayout";
import useActiveContentSpecialist from "@/hooks/useActiveContentSpecialist";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ActiveContentSpecialistPage() {
  const router = useRouter();
  const activeContentSpecialistId = router.query.id;
  const activeContentSpecialist = useActiveContentSpecialist({
    id: activeContentSpecialistId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/active_content_specialist/${activeContentSpecialistId}`)
      .then(() => {
        alert("ActiveContentSpecialist deleted successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!activeContentSpecialist) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>ActiveContentSpecialist</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {activeContentSpecialist.id}</p>
      <p>
        createdAt:{" "}
        {new Date(activeContentSpecialist.createdAt).toLocaleString()}
      </p>
      <p>
        updatedAt:{" "}
        {new Date(activeContentSpecialist.updatedAt).toLocaleString()}
      </p>
      <p>
        contentSpecialistId:{" "}
        <Link
          href={`/crud/active_content_specialist/${activeContentSpecialist.contentSpecialistId}`}
          className='underline'
        >
          {activeContentSpecialist.contentSpecialistId}
        </Link>
      </p>
    </CrudLayout>
  );
}
