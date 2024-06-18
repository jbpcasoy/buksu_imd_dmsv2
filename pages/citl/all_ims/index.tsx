import IMTable from "@/components/IMTable";
import MainLayout from "@/components/MainLayout";
import SidebarIcons, { SIDEBAR_ICON_LABELS } from "@/components/SidebarIcons";
import useCITLIMs from "@/hooks/useCITLIMs";
import { useState } from "react";

export default function CITLIMsPage() {
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
    <MainLayout>
      <IMTable
        icon={<SidebarIcons label={SIDEBAR_ICON_LABELS.ALL_IMS} />}
        count={count}
        iMs={iMs}
        title="All IMs"
        onChangeState={(state) => setState(state)}
      />
    </MainLayout>
  );
}
