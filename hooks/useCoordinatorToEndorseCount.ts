import { IM } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";

export default function useCoordinatorToEndorseCount() {
  const [state, setState] = useState<{ count: number }>({
    count: 0,
  });

  useEffect(() => {
    axios
      .get("/api/im/department/to_endorse/count")
      .then((res) => {
        setState(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return state;
}
