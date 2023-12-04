import AdminIMTable from "@/components/AdminIMTable";
import AdminLayout from "@/components/AdminLayout";
import IMTable from "@/components/IMTable";
import MainLayout from "@/components/MainLayout";
import useCITLIMs from "@/hooks/useCITLIMs";
import { useState } from "react";

export default function AdminIMsPage() {
  const [state, setState] = useState({
    take: 10,
    skip: 0,
    filter: {
      title: "",
      userName: "",
      departmentName: "",
      collegeName: "",
    },
    sort: {
      field: "createdAt",
      direction: "desc",
    },
  });

  const { iMs, count } = useCITLIMs(state);

  return (
    <AdminLayout>
      <AdminIMTable
        count={count}
        iMs={iMs}
        title='IM'
        onChangeState={(state) => setState(state)}
        enableAdd={false}
      />
    </AdminLayout>
  );
}
