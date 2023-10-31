import { IM } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function useDeanToEndorseCount() {
  const [state, setState] = useState<{ count: number }>({
    count: 0,
  });

  useEffect(() => {
    axios
      .get("/api/im/college/to_endorse/count")
      .then((res) => {
        setState(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return state;
}
