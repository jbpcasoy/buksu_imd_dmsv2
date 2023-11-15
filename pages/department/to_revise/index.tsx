import IMTable from "@/components/IMTable";
import MainLayout from "@/components/MainLayout";
import useToRevise from "@/hooks/useToRevise";
import { useState } from "react";

export default function ToRevisePage() {
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

  const { iMs, count } = useToRevise(state);

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
