import CrudLayout from "@/components/CrudLayout";
import useSerialNumber from "@/hooks/useSerialNumber";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function SerialNumberPage() {
  const router = useRouter();
  const serialNumberId = router.query.id;
  const serialNumber = useSerialNumber({ id: serialNumberId as string });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/serial_number/${serialNumberId}`)
      .then(() => {
        alert("Serial number has been deleted successfully");
      })
      .catch((error) => {
        alert(error.response?.data?.error?.message);
      });
  };

  if (!serialNumber) return null;

  return (
    <CrudLayout>
      <div className="flex">
        <h2 className="flex-1">Serial Number</h2>
        <div className="space-x-1">
          <Link
            className="border rounded"
            href={`/crud/serial_number/${serialNumberId}/edit`}
          >
            edit
          </Link>
          <button className="border rounded" onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {serialNumber.id}</p>
      <p>createdAt: {new Date(serialNumber.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(serialNumber.updatedAt).toLocaleString()}</p>
      <p>value: {serialNumber.value}</p>
      <p>
        iMERCCITLDirectorEndorsementId:{" "}
        <Link
          href={`/crud/imerc_citl_director_endorsement/${serialNumber.iMERCCITLDirectorEndorsementId}`}
          className="underline"
        >
          {serialNumber.iMERCCITLDirectorEndorsementId}
        </Link>
      </p>
    </CrudLayout>
  );
}
