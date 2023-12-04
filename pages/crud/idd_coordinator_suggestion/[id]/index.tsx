import CrudLayout from "@/components/CrudLayout";
import useIDDCoordinatorSuggestion from "@/hooks/useIDDCoordinatorSuggestion";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function IDDCoordinatorSuggestionPage() {
  const router = useRouter();
  const iDDCoordinatorSuggestionId = router.query.id;
  const iDDCoordinatorSuggestion = useIDDCoordinatorSuggestion({
    id: iDDCoordinatorSuggestionId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/idd_coordinator_suggestion/${iDDCoordinatorSuggestionId}`)
      .then(() => {
        alert("IDDCoordinatorSuggestion deleted successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!iDDCoordinatorSuggestion) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>IDDCoordinatorSuggestion</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {iDDCoordinatorSuggestion.id}</p>
      <p>
        createdAt:{" "}
        {new Date(iDDCoordinatorSuggestion.createdAt).toLocaleString()}
      </p>
      <p>
        updatedAt:{" "}
        {new Date(iDDCoordinatorSuggestion.updatedAt).toLocaleString()}
      </p>
      <p>
        deanEndorsementId:{" "}
        <Link
          href={`/crud/dean_endorsement/${iDDCoordinatorSuggestion.deanEndorsementId}`}
          className='underline'
        >
          {iDDCoordinatorSuggestion.deanEndorsementId}{" "}
        </Link>
      </p>{" "}
      <p>
        iDDCoordinatorId:{" "}
        <Link
          href={`/crud/idd_coordinator/${iDDCoordinatorSuggestion.iDDCoordinatorId}`}
          className='underline'
        >
          {iDDCoordinatorSuggestion.iDDCoordinatorId}{" "}
        </Link>
      </p>
    </CrudLayout>
  );
}
