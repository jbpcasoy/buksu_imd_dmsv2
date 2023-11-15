import IMTable from "@/components/IMTable";
import MainLayout from "@/components/MainLayout";
import useIMERCCITLToRevise from "@/hooks/useIMERCCITLToRevise";
import { useState } from "react";

export default function IMERCCITLToRevisePage() {
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

  const { iMs, count } = useIMERCCITLToRevise(state);

  return (
    <IMTable
      count={count}
      iMs={iMs}
      title='To Revise'
      onChangeState={(state) => setState(state)}
    />
  );
}