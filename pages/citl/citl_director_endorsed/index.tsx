import IMTable from "@/components/IMTable";
import MainLayout from "@/components/MainLayout";
import useCITLDirectorEndorsed from "@/hooks/useCITLDirectorEndorsed";
import { useState } from "react";

export default function CITLDirectorEndorsedPage() {
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
    }
  });

  const { iMs, count } = useCITLDirectorEndorsed(state);

  return (
    <MainLayout>
      <IMTable
        count={count}
        iMs={iMs}
        title='Endorsed'
        onChangeState={(state) => setState(state)}
      />
    </MainLayout>
  );
}
