import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

export interface AdminLayoutProps {
  children: ReactNode;
}
export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session } = useSession({
    required: true,
  });
  const router = useRouter();
  const [openSidebar, setOpenSidebar] = useState(true);

  useEffect(() => {
    if (session?.user && !session?.user?.isAdmin && router) {
      router.replace("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return (
    <div className='flex flex-col h-screen'>
      <div className='flex flex-col h-full overflow-auto'>
        <AdminHeader onToggleSidebar={setOpenSidebar} />

        <div className='flex-1 flex h-full overflow-y-clip overflow-x-auto'>
          {openSidebar && (
            <div className='w-56 h-full overflow-auto'>
              <AdminSidebar />
            </div>
          )}
          <div className='flex-1 flex flex-col h-full overflow-auto p-2'>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
