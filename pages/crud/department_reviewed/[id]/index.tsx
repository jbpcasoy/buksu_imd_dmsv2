import CrudLayout from "@/components/CrudLayout";
import useDepartmentReviewed from "@/hooks/useDepartmentReviewed";
import useDepartmentRevieweds from "@/hooks/useDepartmentRevieweds";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function DepartmentReviewedPage() {
  const router = useRouter();
  const departmentReviewedId = router.query.id;
  const departmentReviewed = useDepartmentReviewed({
    id: departmentReviewedId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/department_reviewed/${departmentReviewedId}`)
      .then(() => {
        alert("DepartmentReviewed deleted successfully.");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  if (!departmentReviewed) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>DepartmentReviewed</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
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
          href={`/crud/submitted_peer_suggestion/${departmentReviewed.submittedChairpersonSuggestionId}`}
          className='underline'
        >
          {departmentReviewed.submittedChairpersonSuggestionId}
        </Link>
      </p>
      <p>
        submittedCoordinatorSuggestionId:
        <Link
          href={`/crud/submitted_peer_suggestion/${departmentReviewed.submittedCoordinatorSuggestionId}`}
          className='underline'
        >
          {departmentReviewed.submittedCoordinatorSuggestionId}
        </Link>
      </p>
      <p>
        submittedPeerSuggestionId:
        <Link
          href={`/crud/submitted_peer_suggestion/${departmentReviewed.submittedPeerSuggestionId}`}
          className='underline'
        >
          {departmentReviewed.submittedPeerSuggestionId}
        </Link>
      </p>
    </CrudLayout>
  );
}
