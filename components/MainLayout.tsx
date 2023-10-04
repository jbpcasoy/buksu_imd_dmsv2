import { signOut } from "next-auth/react";
import React from "react";

export interface MainLayoutProps {
  children: React.ReactNode;
}
export default function MainLayout({ children }: MainLayoutProps) {
  const onLogout = () => {
    return signOut();
  };
  return (
    <div>
      <div className='min-h-screen'>
        <div className='flex justify-between p-1'>
          <h1>Header</h1>
          <button onClick={onLogout} className="bg-palette_blue text-white px-1 rounded">LOGOUT</button>
        </div>
        <div>{children}</div>
      </div>
      <div>Footer</div>
    </div>
  );
}
