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
      <div className="h-full bg-palette_white p-4 rounded-2xl md:overflow-auto">
        <div className="h-full md:overflow-auto">
          <pre className="">{JSON.stringify(iMInfo, undefined, 4)}</pre>;
        </div>
      </div>
    </AdminLayout>
  );
}
