import { useState } from "react";

export default function useRefresh() {
  const [state, setState] = useState({
    refreshFlag: 0,
  });

  const refresh = () => {
    setState((prev) => ({ ...prev, refreshFlag: prev.refreshFlag + 1 }));
  };

  return { refreshFlag: state.refreshFlag, refresh };
}
