import { QAMISDepartmentEndorsement } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useQAMISDepartmentEndorsementByIMParams {
  id?: string;
}
export default function useQAMISDepartmentEndorsementByIM({
  id,
}: useQAMISDepartmentEndorsementByIMParams) {
  const [state, setState] = useState<QAMISDepartmentEndorsement | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/qamis_department_endorsement/im/${id}`)
      .then((res) => {
        if (!subscribe) return;
        setState(res.data);
      })
      .catch((error) => {
        console.error(error);
        setState(null);
      });

    return () => {
      subscribe = false;
    };
  }, [id]);

  return state;
}
