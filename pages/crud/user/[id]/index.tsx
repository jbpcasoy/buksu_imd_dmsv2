import CrudLayout from "@/components/CrudLayout";
import useUser from "@/hooks/useUser";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function UserPage() {
  const router = useRouter();
  const userId = router.query.id;
  const user = useUser({ id: userId as string });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios.delete(`/api/user/${userId}`).then(() => {
      alert("User deleted successfully.");
    }).catch(error => {
      alert(error.message)
    });
  };

  if (!user) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>User</h2>
        <div className='space-x-1'>
          <Link className='border rounded' href={`/crud/user/${userId}/edit`}>edit</Link>
        </div>
      </div>
      <p>id: {user.id}</p>
      <p>name: {user.name}</p>
      <p>email: {user.email}</p>
    </CrudLayout>
  );
}
