import { SerialNumber } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useSerialNumberIMParams {
  id?: string;
}
export default function useSerialNumberIM({ id }: useSerialNumberIMParams) {
  const [state, setState] = useState<SerialNumber | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/serial_number/im/${id}`)
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
