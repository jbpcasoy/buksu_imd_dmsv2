import MainLayout from "@/components/MainLayout";
import Link from "next/link";

export default function MyIMsPage() {
  return <MainLayout>
    <h2>My IMs</h2>
    <Link href="add_im">Add</Link>
  </MainLayout>;
}
