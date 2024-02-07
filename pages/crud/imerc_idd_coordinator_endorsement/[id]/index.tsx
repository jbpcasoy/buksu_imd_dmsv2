import CrudLayout from "@/components/CrudLayout";
import useIMERCIDDCoordinatorEndorsement from "@/hooks/useIMERCIDDCoordinatorEndorsement";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function IMERCIDDCoordinatorEndorsementPage() {
  const router = useRouter();
  const iMERCIDDCoordinatorEndorsementId = router.query.id;
  const iMERCIDDCoordinatorEndorsement = useIMERCIDDCoordinatorEndorsement({
    id: iMERCIDDCoordinatorEndorsementId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(
        `/api/imerc_idd_coordinator_endorsement/${iMERCIDDCoordinatorEndorsementId}`
      )
      .then(() => {
        alert("IMERCIDDCoordinatorEndorsement has been deleted successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!iMERCIDDCoordinatorEndorsement) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>IMERCIDDCoordinatorEndorsement</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {iMERCIDDCoordinatorEndorsement.id}</p>
      <p>
        createdAt:{" "}
        {new Date(iMERCIDDCoordinatorEndorsement.createdAt).toLocaleString()}
      </p>
      <p>
        updatedAt:{" "}
        {new Date(iMERCIDDCoordinatorEndorsement.updatedAt).toLocaleString()}
      </p>
      <p>
        departmentRevisionId:{" "}
        <Link
          href={`/crud/imerc_citl_revision/${iMERCIDDCoordinatorEndorsement.iMERCCITLRevisionId}`}
          className='underline'
        >
          {iMERCIDDCoordinatorEndorsement.iMERCCITLRevisionId}
        </Link>
      </p>
      <p>
        coordinatorId:{" "}
        <Link
          href={`/crud/idd_coordinator/${iMERCIDDCoordinatorEndorsement.iDDCoordinatorId}`}
          className='underline'
        >
          {iMERCIDDCoordinatorEndorsement.iDDCoordinatorId}
        </Link>
      </p>
    </CrudLayout>
  );
}
