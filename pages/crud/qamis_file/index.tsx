import CrudLayout from "@/components/CrudLayout";
import useQAMISFiles from "@/hooks/useQAMISFiles";
import Link from "next/link";
import { useState } from "react";

export default function QAMISFilesPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { qAMISFiles, count } = useQAMISFiles(state);

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
      <div className='flex justify-between'>
        <h2>QAMISFile</h2>
        <Link className='border rounded' href={`/crud/qamis_file/add`}>
          Add
        </Link>
      </div>

      <div>
        <table className='table-auto w-full'>
          <thead>
            <tr>
              <th>id</th>
              <th>createdAt</th>
              <th>updatedAt</th>
              <th>filename</th>
              <th>mimetype</th>
              <th>size</th>
              <th>originalFilename</th>
              <th>submittedQAMISSuggestionId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {qAMISFiles.map((qAMISFile) => {
              return (
                <tr key={qAMISFile.id}>
                  <td>{qAMISFile.id}</td>
                  <td>{new Date(qAMISFile.createdAt).toLocaleString()}</td>
                  <td>{new Date(qAMISFile.updatedAt).toLocaleString()}</td>
                  <td>{qAMISFile.filename}</td>
                  <td>{qAMISFile.mimetype}</td>
                  <td>{qAMISFile.size}</td>
                  <td>{qAMISFile.originalFilename}</td>
                  <td>
                    <Link
                      href={`/crud/submitted_qamis_suggestion/${qAMISFile.submittedQAMISSuggestionId}`}
                      className='underline'
                    >
                      {qAMISFile.submittedQAMISSuggestionId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/qamis_file/${qAMISFile.id}`}
                      className='border rounded'
                    >
                      view
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className='flex justify-end space-x-1'>
          <p>
            {state.skip} - {state.skip + state.take} of {count}
          </p>
          <button className='border rounded' onClick={handlePrev}>
            prev
          </button>
          <button className='border rounded' onClick={handleNext}>
            next
          </button>
        </div>
      </div>
    </CrudLayout>
  );
}
