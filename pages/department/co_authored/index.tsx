import IMTable from "@/components/IMTable";
import MainLayout from "@/components/MainLayout";
import SidebarIcons, { SIDEBAR_ICON_LABELS } from "@/components/SidebarIcons";
import useCoAuthoredIMs from "@/hooks/useCoAuthoredIMs";
import { useState } from "react";

export default function CoAuthoredIMsPage() {
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

  const { iMs, count } = useCoAuthoredIMs(state);

  return (
    <MainLayout>
      <IMTable
        icon={<SidebarIcons label={SIDEBAR_ICON_LABELS.CO_AUTHORED} />}
        count={count}
        iMs={iMs}
        title="Co-authored IM's"
        onChangeState={(state) => setState(state)}
      />
    </MainLayout>
  );
}
