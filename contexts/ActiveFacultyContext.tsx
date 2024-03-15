import { ActiveFaculty } from "@prisma/client";
import axios from "axios";
import { ReactNode, createContext, useEffect, useState } from "react";

const ActiveFacultyContext = createContext<ActiveFaculty | null | undefined>(
  null
);
interface ActiveFacultyContextProviderProps {
  children: ReactNode;
}

export function ActiveFacultyContextProvider({
  children,
}: ActiveFacultyContextProviderProps) {
  const [state, setState] = useState<ActiveFaculty | null>();

  useEffect(() => {
    let subscribe = true;

    axios
      .get("/api/active_faculty/me")
      .then((res) => {
        if (subscribe) {
          setState(res.data);
        }
      })
      .catch((error) => {
        console.error(error);
        setState(null);
      });

    return () => {
      subscribe = false;
    };
  }, []);

  return (
    <ActiveFacultyContext.Provider value={state}>
      {children}
    </ActiveFacultyContext.Provider>
  );
}

export default ActiveFacultyContext;
