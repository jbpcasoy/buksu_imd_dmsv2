import React, { useContext, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ActiveFacultyContext from "@/contexts/ActiveFacultyContext";

export interface MainLayoutProps {
  children: React.ReactNode;
}
export default function MainLayout({ children }: MainLayoutProps) {
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
            <Sidebar />
          </div>
          <div className='flex-1'>{children}</div>
        </div>
      </div>
    </div>
  );
}
