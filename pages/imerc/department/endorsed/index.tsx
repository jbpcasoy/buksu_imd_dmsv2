import IMTable from "@/components/IMTable";
import MainLayout from "@/components/MainLayout";
import SidebarIcons, { SIDEBAR_ICON_LABELS } from "@/components/SidebarIcons";
import useIMERCEndorsed from "@/hooks/useIMERCEndorsed";
import { useState } from "react";

export default function IMERCEndorsedPage() {
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

  const { iMs, count } = useIMERCEndorsed(state);

  return (
    <MainLayout>
      <IMTable
        icon={<SidebarIcons label={SIDEBAR_ICON_LABELS.ENDORSED} />}
        count={count}
        iMs={iMs}
        title="Endorsed"
        onChangeState={(state) => setState(state)}
      />
    </MainLayout>
  );
}
