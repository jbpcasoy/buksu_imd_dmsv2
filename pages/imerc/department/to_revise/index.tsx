import IMTable from "@/components/IMTable";
import MainLayout from "@/components/MainLayout";
import useIMERCToRevise from "@/hooks/useIMERCToRevise";
import { useState } from "react";

export default function IMERCToRevisePage() {
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

  const { iMs, count } = useIMERCToRevise(state);

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