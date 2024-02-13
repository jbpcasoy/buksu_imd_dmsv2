import AdminLayout from "@/components/AdminLayout";
import Loading from "@/components/Loading";
import useIMAll from "@/hooks/useIMAll";
import { useRouter } from "next/router";

export default function IMInfo() {
  const router = useRouter();
  const iMId = router.query.id as string;

  const iMInfo = useIMAll({ id: iMId });

  if (!iMInfo) {
    return (
      <AdminLayout>
        <Loading />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* <DynamicReactJson src={iMInfo} collapsed={2} />; */}
      <pre className="text-xs">{JSON.stringify(iMInfo, undefined, 4)}</pre>;
    </AdminLayout>
  );
}
