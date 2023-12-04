import CrudLayout from "@/components/CrudLayout";
import useActiveChairperson from "@/hooks/useActiveChairperson";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ActiveChairpersonPage() {
  const router = useRouter();
  const activeChairpersonId = router.query.id;
  const activeChairperson = useActiveChairperson({ id: activeChairpersonId as string });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/active_chairperson/${activeChairpersonId}`)
      .then(() => {
        alert("ActiveChairperson deleted successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!activeChairperson) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>ActiveChairperson</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {activeChairperson.id}</p>
      <p>createdAt: {new Date(activeChairperson.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(activeChairperson.updatedAt).toLocaleString()}</p>
      <p>
        chairpersonId:{" "}
        <Link
          href={`/crud/chairperson/${activeChairperson.chairpersonId}`}
          className='underline'
        >
          {activeChairperson.chairpersonId}
        </Link>
      </p>
    </CrudLayout>
  );
}
