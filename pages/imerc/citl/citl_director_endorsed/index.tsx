import IMTable from "@/components/IMTable";
import MainLayout from "@/components/MainLayout";
import useIMERCCITLDirectorEndorsed from "@/hooks/useIMERCCITLDirectorEndorsed";
import { useState } from "react";

export default function IMERCCITLDirectorEndorsedPage() {
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

  const { iMs, count } = useIMERCCITLDirectorEndorsed(state);

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
