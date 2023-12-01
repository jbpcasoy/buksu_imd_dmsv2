import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import AdminSidebar from "./AdminSidebar";
import Header from "./Header";
import AdminHeader from "./AdminHeader";

export interface AdminLayoutProps {
  children: ReactNode;
}
export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session } = useSession({
    required: true,
  });
  const router = useRouter();

  useEffect(() => {
    if (session?.user && !session?.user?.isAdmin && router) {
      router.replace("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return (
    <div className='flex flex-col h-screen'>
      <div className='flex flex-col h-full overflow-auto'>
        <AdminHeader />

        <div className='flex-1 flex h-full overflow-y-clip overflow-x-auto'>
          <div className='w-56 h-full overflow-auto'>
            <AdminSidebar />
          </div>
          <div className='flex-1 flex flex-col h-full overflow-auto m-2'>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
