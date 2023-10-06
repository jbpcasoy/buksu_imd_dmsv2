import { signOut } from "next-auth/react";

export default function Header() {
  const onLogout = () => {
    return signOut();
  };

  return (
    <div className='flex justify-between p-1'>
      <h1>BUKSU IMD DMS</h1>
      <button
        onClick={onLogout}
        className='bg-palette_blue text-white px-1 rounded'
      >
        LOGOUT
      </button>
    </div>
  );
}
