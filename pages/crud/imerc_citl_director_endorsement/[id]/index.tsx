import CrudLayout from "@/components/CrudLayout";
import useIMERCCITLDirectorEndorsement from "@/hooks/useIMERCCITLDirectorEndorsement";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function IMERCCITLDirectorEndorsementPage() {
  const router = useRouter();
  const iMERCCITLDirectorEndorsementId = router.query.id;
  const iMERCCITLDirectorEndorsement = useIMERCCITLDirectorEndorsement({ id: iMERCCITLDirectorEndorsementId as string });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/imerc_citl_director_endorsement/${iMERCCITLDirectorEndorsementId}`)
      .then(() => {
        alert("IMERCCITLDirectorEndorsement deleted successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!iMERCCITLDirectorEndorsement) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>IMERCCITLDirectorEndorsement</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {iMERCCITLDirectorEndorsement.id}</p>
      <p>createdAt: {new Date(iMERCCITLDirectorEndorsement.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(iMERCCITLDirectorEndorsement.updatedAt).toLocaleString()}</p>
      <p>
      iMERCIDDCoordinatorEndorsementId:{" "}
        <Link
          href={`/crud/imerc_idd_coordinator_endorsement/${iMERCCITLDirectorEndorsement.iMERCIDDCoordinatorEndorsementId}`}
          className='underline'
        >
          {iMERCCITLDirectorEndorsement.iMERCIDDCoordinatorEndorsementId}
        </Link>
      </p>
      <p>
      deanId:{" "}
        <Link
          href={`/crud/citl_director/${iMERCCITLDirectorEndorsement.cITLDirectorId}`}
          className='underline'
        >
          {iMERCCITLDirectorEndorsement.cITLDirectorId}
        </Link>
      </p>
    </CrudLayout>
  );
}
