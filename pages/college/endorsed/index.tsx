import IMTable from "@/components/IMTable";
import MainLayout from "@/components/MainLayout";
import useDeanEndorsed from "@/hooks/useDeanEndorsed";
import { useState } from "react";

export default function DeanEndorsedPage() {
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

  const { iMs, count } = useDeanEndorsed(state);

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
