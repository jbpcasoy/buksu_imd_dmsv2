import axios from "axios";
import { useEffect, useState } from "react";

export default function useIMERCCITLToReviseCount() {
  const [state, setState] = useState<{ count: number}>({
    count: 0,
  });

  useEffect(() => {
    axios
      .get("/api/im/imerc/citl/to_revise/count")
      .then((res) => {
        setState(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return state;
}
