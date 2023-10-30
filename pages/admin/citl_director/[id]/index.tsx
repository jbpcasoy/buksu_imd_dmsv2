import AdminLayout from "@/components/AdminLayout";
import useActiveCITLDirector from "@/hooks/useActiveCITLDirector";
import useActiveCITLDirectorByCITLDirectorId from "@/hooks/useActiveCITLDirectorByCITLDirectorId";
import useCITLDirector from "@/hooks/useCITLDirector";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function CITLDirectorPage() {
  const router = useRouter();
  const cITLDirectorId = router.query.id;
  const cITLDirector = useCITLDirector({ id: cITLDirectorId as string });
  const activeCITLDirector = useActiveCITLDirectorByCITLDirectorId({
    id: cITLDirectorId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/citl_director/${cITLDirectorId}`)
      .then(() => {
        alert("CITLDirector deleted successfully.");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  const activateHandler = async () => {
    return axios
      .post(`/api/active_citl_director`, {
        cITLDirectorId,
      })
      .then(() => {
        alert("CITLDirector has been activated successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      })
      .finally(() => {
        router.reload();
      });
  };

  const deactivateHandler = async () => {
    return axios
      .delete(`/api/active_citl_director/${activeCITLDirector?.id}`)
      .then(() => {
        alert("CITLDirector has been deactivated successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      })
      .finally(() => {
        router.reload();
      });
  };

  if (!cITLDirector) return null;

  return (
    <AdminLayout>
      <div className='flex'>
        <h2 className='flex-1'>CITLDirector</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {cITLDirector.id}</p>
      <p>createdAt: {new Date(cITLDirector.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(cITLDirector.updatedAt).toLocaleString()}</p>
      <p>
        userId:{" "}
        <Link href={`/admin/user/${cITLDirector.userId}`} className='underline'>
          {cITLDirector.userId}
        </Link>
      </p>
      {!activeCITLDirector && (
        <button className='border rounded' onClick={activateHandler}>
          Activate
        </button>
      )}

      {activeCITLDirector && (
        <button className='border rounded' onClick={deactivateHandler}>
          Deactivate
        </button>
      )}
    </AdminLayout>
  );
}
