import CrudLayout from "@/components/CrudLayout";
import useIMAll from "@/hooks/useIMAll";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function IMPage() {
  const router = useRouter();
  const iMId = router.query.id;
  const iM = useIMAll({ id: iMId as string });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/im/${iMId}`)
      .then(() => {
        alert("IM has been deleted successfully");
      })
      .catch((error) => {
        alert(error.response?.data?.error?.message);
      });
  };

  if (!iM) return null;

  return (
    <CrudLayout>
      <div className="flex">
        <h2 className="flex-1">IM</h2>
        <div className="space-x-1">
          <Link className="border rounded" href={`/crud/im/${iMId}/edit`}>
            edit
          </Link>
          <button className="border rounded" onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>

      {/* <DynamicReactJson src={iM} collapsed={2}/> */}
      <pre>{JSON.stringify(iM, undefined, 4)}</pre>;
    </CrudLayout>
  );
}
