import CrudLayout from "@/components/CrudLayout";
import useQAMISSuggestion from "@/hooks/useQAMISSuggestion";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function QAMISSuggestionPage() {
  const router = useRouter();
  const qAMISSuggestionId = router.query.id;
  const qAMISSuggestion = useQAMISSuggestion({
    id: qAMISSuggestionId as string,
  });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/qamis_suggestion/${qAMISSuggestionId}`)
      .then(() => {
        alert("QAMISSuggestion deleted successfully.");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!qAMISSuggestion) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>QAMISSuggestion</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {qAMISSuggestion.id}</p>
      <p>createdAt: {new Date(qAMISSuggestion.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(qAMISSuggestion.updatedAt).toLocaleString()}</p>
      <p>
        cITLDirectorEndorsementId:{" "}
        <Link
          href={`/crud/citl_director_endorsement/${qAMISSuggestion.cITLDirectorEndorsementId}`}
          className='underline'
        >
          {qAMISSuggestion.cITLDirectorEndorsementId}{" "}
        </Link>
      </p>{" "}
    </CrudLayout>
  );
}
