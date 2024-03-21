import CrudLayout from "@/components/CrudLayout";
import useDepartmentReviewed from "@/hooks/useDepartmentReviewed";
import Link from "next/link";
import { useRouter } from "next/router";

export default function DepartmentReviewedPage() {
  const router = useRouter();
  const departmentReviewedId = router.query.id;
  const departmentReviewed = useDepartmentReviewed({
    id: departmentReviewedId as string,
  });

  if (!departmentReviewed) return null;

  return (
    <CrudLayout>
      <div className="flex">
        <h2 className="flex-1">DepartmentReviewed</h2>
        <div className="space-x-1"></div>
      </div>
      <p>id: {departmentReviewed.id}</p>
      <p>
        createdAt: {new Date(departmentReviewed.createdAt).toLocaleString()}
      </p>
      <p>
        updatedAt: {new Date(departmentReviewed.updatedAt).toLocaleString()}
      </p>
      <p>
        submittedChairpersonSuggestionId:
        <Link
          href={`/crud/submitted_chairperson_suggestion/${departmentReviewed.submittedChairpersonSuggestionId}`}
          className="underline"
        >
          {departmentReviewed.submittedChairpersonSuggestionId}
        </Link>
      </p>
      <p>
        submittedCoordinatorSuggestionId:
        <Link
          href={`/crud/submitted_coordinator_suggestion/${departmentReviewed.submittedCoordinatorSuggestionId}`}
          className="underline"
        >
          {departmentReviewed.submittedCoordinatorSuggestionId}
        </Link>
      </p>
      <p>
        submittedPeerSuggestionId:
        <Link
          href={`/crud/submitted_peer_suggestion/${departmentReviewed.submittedPeerSuggestionId}`}
          className="underline"
        >
          {departmentReviewed.submittedPeerSuggestionId}
        </Link>
      </p>
    </CrudLayout>
  );
}
