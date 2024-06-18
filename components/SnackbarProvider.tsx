import { ReactNode, createContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface Snackbar {
  id: string;
  message: string;
  type: "error" | "success";
}
export const SnackbarContext = createContext<{
  snackbars: Snackbar[];
  addSnackbar: (message: string, type?: "error" | "success") => void;
}>({
  snackbars: [],
  addSnackbar: (message: string, type?: "error" | "success") => { },
});

interface SnackbarContextProviderProps {
  children: ReactNode;
}

export default function SnackbarContextProvider({
  children,
}: SnackbarContextProviderProps) {
  const [state, setState] = useState<{
    initialState: boolean;
    snackbars: Snackbar[];
  }>({
    initialState: true,
    snackbars: [],
  });

  const addSnackbar = (message: string, type?: "error" | "success") => {
    setState((prev) => ({
      ...prev,
      snackbars: [
        ...prev.snackbars.slice(-2),
        {
          id: uuidv4(),
          message,
          type: type ?? "success",
        },
      ],
    }));
  };

  const closeSnackbar = (id: string) => {
    setState((prev) => ({
      ...prev,
      snackbars: [...prev.snackbars.filter((snackbar) => snackbar.id !== id)],
    }));
  };

  useEffect(() => {
    if (state.initialState) return;
    localStorage.setItem("snackbars", JSON.stringify(state.snackbars));
  }, [state]);

  useEffect(() => {
    console.log({ state });
  }, [state]);

  useEffect(() => {
    const rawSnackbars = localStorage.getItem("snackbars");
    if (rawSnackbars) {
      const parsedSnackbars = JSON.parse(rawSnackbars);
      setState((prev) => ({
        ...prev,
        snackbars: parsedSnackbars,
        initialState: false,
      }));
    } else {
      setState((prev) => ({ ...prev, initialState: false }));
    }
  }, []);

  return (
    <SnackbarContext.Provider
      value={{
        snackbars: state.snackbars,
        addSnackbar,
      }}
    >
      <div className="h-full w-full md:w-auto">
        <div className="h-full overflow-auto">{children}</div>
        <div className="absolute bottom-0 right-0 p-2 w-full md:w-auto">
          {state.snackbars.map((snackbar) => {
            return (
              <SnackbarComponent
                key={snackbar.id} closeSnackbar={closeSnackbar} snackbar={snackbar} />
            );
          })}
        </div>
      </div>
    </SnackbarContext.Provider>
  );
}

function SnackbarComponent({ snackbar, closeSnackbar }: { snackbar: Snackbar, closeSnackbar: (id: string) => any }) {
  useEffect(() => {

    // Creating a timeout within the useEffect hook
    setTimeout(() => {
      closeSnackbar(snackbar.id)
    }, 5000);
  }, []);

  return <div
    className={`w-full md:w-96 rounded m-2 py-2 px-4 flex justify-between items-center space-x-2 ${snackbar.type === "success"
      ? "bg-palette_success"
      : "bg-palette_error"
      }`}
  >
    {snackbar.type === "success" && (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="1em"
        viewBox="0 0 448 512"
        className="fill-palette_white"
      >
        <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
      </svg>
    )}
    {snackbar.type === "error" && (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="1em"
        viewBox="0 0 64 512"
        className="fill-palette_white"
      >
        <path d="M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64V320c0 17.7 14.3 32 32 32s32-14.3 32-32V64zM32 480a40 40 0 1 0 0-80 40 40 0 1 0 0 80z" />
      </svg>
    )}
    <p className="text-palette_white flex-1 text-ellipsis overflow-hidden">
      {snackbar.message}
    </p>
    <button
      className="w-7 h-7 flex rounded-full justify-center items-center hover:bg-palette_white hover:bg-opacity-30"
      onClick={() => closeSnackbar(snackbar.id)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="1em"
        viewBox="0 0 384 512"
        className="fill-palette_white"
      >
        <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
      </svg>
    </button>
  </div>
}