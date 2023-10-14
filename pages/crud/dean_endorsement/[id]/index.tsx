import CrudLayout from "@/components/CrudLayout";
import useDeanEndorsement from "@/hooks/useDeanEndorsement";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function DeanEndorsementPage() {
  const router = useRouter();
  const deanEndorsementId = router.query.id;
  const deanEndorsement = useDeanEndorsement({ id: deanEndorsementId as string });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/dean_endorsement/${deanEndorsementId}`)
      .then(() => {
        alert("DeanEndorsement deleted successfully.");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!deanEndorsement) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>DeanEndorsement</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {deanEndorsement.id}</p>
      <p>createdAt: {new Date(deanEndorsement.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(deanEndorsement.updatedAt).toLocaleString()}</p>
      <p>
      coordinatorEndorsementId:{" "}
        <Link
          href={`/crud/coordinator_endorsement/${deanEndorsement.coordinatorEndorsementId}`}
          className='underline'
        >
          {deanEndorsement.coordinatorEndorsementId}
        </Link>
      </p>
      <p>
      deanId:{" "}
        <Link
          href={`/crud/dean/${deanEndorsement.deanId}`}
          className='underline'
        >
          {deanEndorsement.deanId}
        </Link>
      </p>
    </CrudLayout>
  );
}
