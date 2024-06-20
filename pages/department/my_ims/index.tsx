import IMTable from "@/components/IMTable";
import MainLayout from "@/components/MainLayout";
import SidebarIcons, { SIDEBAR_ICON_LABELS } from "@/components/SidebarIcons";
import useMyIMs from "@/hooks/useMyIMs";
import { useState } from "react";

export default function MyIMsPage() {
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

  const { iMs, count } = useMyIMs(state);

  return (
    <MainLayout>
      <IMTable
        icon={<SidebarIcons label={SIDEBAR_ICON_LABELS.MY_IMS} />}
        count={count}
        iMs={iMs}
        title="My IMs"
        onChangeState={(state) => setState(state)}
      />
    </MainLayout>
  );
}
