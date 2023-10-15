import { useEffect, useState } from "react";
import { QAMISDepartmentEndorsement, IM } from "@prisma/client";
import axios from "axios";

export interface useQAMISDepartmentEndorsementParams {
  id: string;
}
export default function useQAMISDepartmentEndorsement({ id }: useQAMISDepartmentEndorsementParams) {
  const [state, setState] = useState<QAMISDepartmentEndorsement | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/qamis_department_endorsement/${id}`)
      .then((res) => {
        if(!subscribe) return;
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
