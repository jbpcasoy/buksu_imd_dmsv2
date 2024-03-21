import IMTable from "@/components/IMTable";
import MainLayout from "@/components/MainLayout";
import SidebarIcons, { SIDEBAR_ICON_LABELS } from "@/components/SidebarIcons";
import useCoordinatorToEndorse from "@/hooks/useCoordinatorToEndorse";
import { useState } from "react";

export default function CoordinatorToEndorsePage() {
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

  const { iMs, count } = useCoordinatorToEndorse(state);

  return (
    <MainLayout>
      <IMTable
        icon={<SidebarIcons label={SIDEBAR_ICON_LABELS.TO_ENDORSE} />}
        count={count}
        iMs={iMs}
        title="To Endorse"
        onChangeState={(state) => setState(state)}
      />
    </MainLayout>
  );
}
