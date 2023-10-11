import React, { ReactNode, useContext, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ActiveFacultyContext from "@/contexts/ActiveFacultyContext";
import { useSession } from "next-auth/react";

export interface MainLayoutProps {
  children: ReactNode;
}
export default function MainLayout({ children }: MainLayoutProps) {
  const { data: session } = useSession({
    required: true,
  });
  const activeFaculty = useContext(ActiveFacultyContext);

  useEffect(() => {
    console.log({ activeFaculty });
  }, [activeFaculty]);

  return (
    <div className='flex flex-col h-screen'>
      <div className='flex-1 flex h-full overflow-y-clip overflow-x-auto'>
        <div className='w-40'>
          <Sidebar />
        </div>
        <div className='flex-1 flex flex-col h-full overflow-auto'>
          <Header />
          <div className=''>{children}</div>
        </div>
      </div>
    </div>
  );
}
