import MainLayout from "@/components/MainLayout";
import Link from "next/link";

export default function FormsPage() {
  return (
    <MainLayout>
      <div className="flex flex-col">
        <Link href="/forms/F001.pdf" className="underline">
          F001 - Endorsement of the Instructional Material (Implementation
          Phase)
        </Link>
        <Link href="/forms/F003.pdf" className="underline">
          F003 - Suggestions and Action Taken
        </Link>
        <Link href="/forms/F004.pdf" className="underline">
          F004 - Student Opinionnaire
        </Link>
        <Link href="/forms/F005.pdf" className="underline">
          F005 - Teacher-User Evaluation
        </Link>
        <Link href="/forms/F011.pdf" className="underline">
          F011 - Endorsement of the Instructional Material (Implementation
          Phase)
        </Link>
        <Link href="/forms/F012.pdf" className="underline">
          F012 - Endorsement of Request for Instructional Material Evaluation
          and Publication (for IPTTU Endorsement and Publication)
        </Link>
        <Link href="/forms/F013.pdf" className="underline">
          F013 - Instructional Materials Review Form (Implementation Phase)
        </Link>
      </div>
    </MainLayout>
  );
}
