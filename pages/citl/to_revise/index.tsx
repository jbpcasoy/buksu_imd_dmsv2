import IMTable from "@/components/IMTable";
import MainLayout from "@/components/MainLayout";
import useCITLToRevise from "@/hooks/useCITLToRevise";
import { useState } from "react";

export default function CITLToRevisePage() {
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

  const { iMs, count } = useCITLToRevise(state);

  return (
    <MainLayout>
      <IMTable
        count={count}
        iMs={iMs}
        title='To Revise'
        onChangeState={(state) => setState(state)}
      />
    </MainLayout>
  );
}
