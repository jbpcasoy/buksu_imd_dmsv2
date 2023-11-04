import CrudLayout from "@/components/CrudLayout";
import usePlagiarismFiles from "@/hooks/usePlagiarismFiles";
import Link from "next/link";
import { useState } from "react";

export default function PlagiarismFilesPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { plagiarismFiles, count } = usePlagiarismFiles(state);

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
        <h2>PlagiarismFile</h2>
        <Link className='border rounded' href={`/crud/plagiarism_file/add`}>
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
              <th>iMId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {plagiarismFiles.map((plagiarismFile) => {
              return (
                <tr key={plagiarismFile.id}>
                  <td>{plagiarismFile.id}</td>
                  <td>{new Date(plagiarismFile.createdAt).toLocaleString()}</td>
                  <td>{new Date(plagiarismFile.updatedAt).toLocaleString()}</td>
                  <td>{plagiarismFile.filename}</td>
                  <td>{plagiarismFile.mimetype}</td>
                  <td>{plagiarismFile.size}</td>
                  <td>{plagiarismFile.originalFilename}</td>
                  <td>
                    <Link
                      href={`/crud/im/${plagiarismFile.iMId}`}
                      className='underline'
                    >
                      {plagiarismFile.iMId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/plagiarism_file/${plagiarismFile.id}`}
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
