import IMTable from "@/components/IMTable";
import MainLayout from "@/components/MainLayout";
import SidebarIcons, { SIDEBAR_ICON_LABELS } from "@/components/SidebarIcons";
import useIMERCToEndorse from "@/hooks/useIMERCToEndorse";
import { useState } from "react";

export default function IMERCToEndorsePage() {
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

  const { iMs, count } = useIMERCToEndorse(state);

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
