import { useEffect, useState } from "react";

export default function SidebarToggle({ onToggleSidebar }: { onToggleSidebar: (open: boolean) => any }) {
  const [state, setState] = useState({
    initialized: false,
    openSidebar: true,
  });

  useEffect(() => {
    if (!state.initialized) {
      return;
    }

    localStorage.setItem("openSidebar", JSON.stringify(state.openSidebar));
    onToggleSidebar(state.openSidebar);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    const rawOpenSidebar = localStorage.getItem("openSidebar");
    if (rawOpenSidebar) {
      setState((prev) => ({
        ...prev,
        openSidebar: JSON.parse(rawOpenSidebar),
        initialized: true,
      }));
    } else {
      setState((prev) => ({ ...prev, initialized: true }));
    }
  }, []);

  return <button
    className={`w-8 h-8 flex hover:fill-palette_grey justify-center items-center  hover:opacity-50 bg-palette_blue fill-palette_white absolute ${state.openSidebar ? "rounded-l-full" : " rounded-r-full"}`}
    onClick={() => {
      setState((prev) => ({ ...prev, openSidebar: !prev.openSidebar }));
    }}
    title={state.openSidebar ? "Hide Sidebar" : "Open Sidebar"}
  >

    {!state.openSidebar && <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-palette_white" viewBox="0 0 256 512"><path d="M246.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-9.2-9.2-22.9-11.9-34.9-6.9s-19.8 16.6-19.8 29.6l0 256c0 12.9 7.8 24.6 19.8 29.6s25.7 2.2 34.9-6.9l128-128z" /></svg>}

    {state.openSidebar && <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-palette_white" viewBox="0 0 256 512"><path d="M9.4 278.6c-12.5-12.5-12.5-32.8 0-45.3l128-128c9.2-9.2 22.9-11.9 34.9-6.9s19.8 16.6 19.8 29.6l0 256c0 12.9-7.8 24.6-19.8 29.6s-25.7 2.2-34.9-6.9l-128-128z" /></svg>}

  </button>;
}