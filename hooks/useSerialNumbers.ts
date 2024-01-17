import { SerialNumber } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export interface useSerialNumbersParams {
  skip: number;
  take: number;
  filter?: object;
  sort?: object;
}
export default function useSerialNumbers({
  skip,
  take,
  filter,
  sort,
}: useSerialNumbersParams) {
  const [state, setState] = useState<{
    serialNumbers: SerialNumber[];
    count: number;
  }>({
    count: 0,
    serialNumbers: [],
  });

  useEffect(() => {
    axios
      .get("/api/serial_number", {
        params: {
          skip,
          take,
          filter,
          sort,
        },
      })
      .then((res) => {
        setState(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [skip, take, filter, sort]);

  return state;
}
