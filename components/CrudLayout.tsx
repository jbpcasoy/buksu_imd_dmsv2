import ActiveFacultyContext from "@/contexts/ActiveFacultyContext";
import { useSession } from "next-auth/react";
import { ReactNode, useContext, useEffect } from "react";
import CrudHeader from "./CrudHeader";
import CrudSidebar from "./CrudSidebar";
import Error from "next/error";

export interface CrudLayoutProps {
  children: ReactNode;
}
export default function CrudLayout({ children }: CrudLayoutProps) {
  const { data: session } = useSession({
    required: true,
  });
  const activeFaculty = useContext(ActiveFacultyContext);

  useEffect(() => {
    console.log({ activeFaculty });
  }, [activeFaculty]);

  if (!session?.user) {
    return null;
  } else if (!session.user.isAdmin) {
    return <Error statusCode={404} />;
  }

  return (
    <div className='flex flex-col h-screen'>
      <div className='flex-1 flex h-full overflow-y-clip overflow-x-auto'>
        <div className=''>
          <CrudSidebar />
        </div>
        <div className='flex-1 flex flex-col h-full overflow-auto'>
          <CrudHeader />
          <div className=''>{children}</div>
        </div>
      </div>
    </div>
  );
}
