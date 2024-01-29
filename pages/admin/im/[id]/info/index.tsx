import AdminLayout from "@/components/AdminLayout";
import Loading from "@/components/Loading";
import useIMAll from "@/hooks/useIMAll";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
const DynamicReactJson = dynamic(import("react-json-view"), { ssr: false });

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
      <DynamicReactJson src={iMInfo} collapsed={2} />;
    </AdminLayout>
  );
}
