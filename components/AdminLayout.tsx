import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

interface AdminLayoutProps {
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
    <div className="flex flex-col h-screen w-screen">
      <div className="flex flex-col w-full h-full overflow-auto">
        <AdminHeader onToggleSidebar={setOpenSidebar} />

        <div className="flex-1 flex flex-col md:flex-row h-full overflow-auto">
          {openSidebar && (
            <div className="w-full md:w-96 h-full md:overflow-auto">
              <AdminSidebar />
            </div>
          )}
          <div className="flex-1 flex flex-col h-full md:overflow-auto p-4 bg-palette_dirty_white">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
