import CrudLayout from "@/components/CrudLayout";
import useQAMISRevisions from "@/hooks/useQAMISRevisions";
import Link from "next/link";
import { useState } from "react";

export default function QAMISRevisionsPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { qAMISRevisions, count } = useQAMISRevisions(state);

  const handleNext = () => {
    setState((prev) => {
      const nextVal = prev.skip + prev.take;
      return { ...prev, skip: nextVal <= count ? nextVal : prev.skip };
    });
  };

  const handlePrev = () => {
    setState((prev) => {
      const nextVal = prev.skip - prev.take;
      return { ...prev, skip: nextVal >= 0 ? nextVal : prev.skip };
    });
  };

  return (
    <CrudLayout>
      <div className="flex justify-between">
        <h2>QAMISRevision</h2>
        <Link className="border rounded" href={`/crud/qamis_revision/add`}>
          Add
        </Link>
      </div>

      <div>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th>id</th>
              <th>createdAt</th>
              <th>updatedAt</th>
              <th>qAMISFileId</th>
              <th>iMFileId</th>
              <th>submittedQAMISSuggestionId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {qAMISRevisions.map((qAMISRevision) => {
              return (
                <tr key={qAMISRevision.id}>
                  <td>{qAMISRevision.id}</td>
                  <td>{new Date(qAMISRevision.createdAt).toLocaleString()}</td>
                  <td>{new Date(qAMISRevision.updatedAt).toLocaleString()}</td>
                  <td>
                    <Link
                      href={`/crud/qamis_file/${qAMISRevision.qAMISFileId}`}
                      className="underline"
                    >
                      {qAMISRevision.qAMISFileId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/im_file/${qAMISRevision.iMFileId}`}
                      className="underline"
                    >
                      {qAMISRevision.iMFileId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/submitted_qamis_suggestion/${qAMISRevision.submittedQAMISSuggestionId}`}
                      className="underline"
                    >
                      {qAMISRevision.submittedQAMISSuggestionId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/qamis_revision/${qAMISRevision.id}`}
                      className="border rounded"
                    >
                      view
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex justify-end space-x-1">
          <p>
            {state.skip} - {state.skip + state.take} of {count}
          </p>
          <button className="border rounded" onClick={handlePrev}>
            prev
          </button>
          <button className="border rounded" onClick={handleNext}>
            next
          </button>
        </div>
      </div>
    </CrudLayout>
  );
}
