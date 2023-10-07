import React, { ReactNode, useContext, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ActiveFacultyContext from "@/contexts/ActiveFacultyContext";
import { useSession } from "next-auth/react";
import CrudSidebar from "./CrudSidebar";

export interface CrudLayoutProps {
  children: ReactNode;
}
export default function CrudLayout({ children }: CrudLayoutProps) {
  const {data: session} = useSession({
    required: true
  })
  const activeFaculty = useContext(ActiveFacultyContext);

  useEffect(() => {
    console.log({ activeFaculty });
  }, [activeFaculty]);

  return (
    <div>
      <div className='flex flex-col min-h-screen'>
        <Header />
        <div className='flex-1 flex h-full'>
          <div className='w-40'>
            <CrudSidebar />
          </div>
          <div className='flex-1'>{children}</div>
        </div>
      </div>
    </div>
  );
}
