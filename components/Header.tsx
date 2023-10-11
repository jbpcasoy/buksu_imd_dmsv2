import { signOut } from "next-auth/react";

export default function Header() {
  const onLogout = () => {
    return signOut();
  };

  return (
    <div className='flex justify-end p-1'>
      <button
        onClick={onLogout}
        className='bg-palette_blue text-white px-1 rounded'
      >
        LOGOUT
      </button>
    </div>
  );
}
