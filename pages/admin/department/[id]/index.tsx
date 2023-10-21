import AdminLayout from "@/components/AdminLayout";
import useDepartment from "@/hooks/useDepartment";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function DepartmentPage() {
  const router = useRouter();
  const departmentId = router.query.id;
  const department = useDepartment({ id: departmentId as string });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios.delete(`/api/department/${departmentId}`).then(() => {
      alert("Department deleted successfully.");
    }).catch(error => {
      alert(error.message)
    });
  };

  if (!department) return null;

  return (
    <AdminLayout>
      <div className='flex'>
        <h2 className='flex-1'>Department</h2>
        <div className='space-x-1'>
          <Link className='border rounded' href={`/admin/department/${departmentId}/edit`}>edit</Link>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {department.id}</p>
      <p>createdAt: {new Date(department.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(department.updatedAt).toLocaleString()}</p>
      <p>name: {department.name}</p>
      <p>collegeId: <Link href={`/admin/college/${department.collegeId}`} className="underline">{department.collegeId}</Link></p>
    </AdminLayout>
  );
}
