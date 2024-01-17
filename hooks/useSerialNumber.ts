import { SerialNumber } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useSerialNumberParams {
  id?: string;
}
export default function useSerialNumber({ id }: useSerialNumberParams) {
  const [state, setState] = useState<SerialNumber | null>();

  useEffect(() => {
    if (!id) return;

    let subscribe = true;

    axios
      .get(`/api/serial_number/${id}`)
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
