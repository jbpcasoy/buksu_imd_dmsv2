import CrudLayout from "@/components/CrudLayout";
import useGrammarlyFiles from "@/hooks/useGrammarlyFiles";
import Link from "next/link";
import { useState } from "react";

export default function GrammarlyFilesPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { grammarlyFiles, count } = useGrammarlyFiles(state);

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
        <h2>GrammarlyFile</h2>
        <Link className='border rounded' href={`/crud/grammarly_file/add`}>
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
            {grammarlyFiles.map((grammarlyFile) => {
              return (
                <tr key={grammarlyFile.id}>
                  <td>{grammarlyFile.id}</td>
                  <td>{new Date(grammarlyFile.createdAt).toLocaleString()}</td>
                  <td>{new Date(grammarlyFile.updatedAt).toLocaleString()}</td>
                  <td>{grammarlyFile.filename}</td>
                  <td>{grammarlyFile.mimetype}</td>
                  <td>{grammarlyFile.size}</td>
                  <td>{grammarlyFile.originalFilename}</td>
                  <td>
                    <Link
                      href={`/crud/im/${grammarlyFile.iMId}`}
                      className='underline'
                    >
                      {grammarlyFile.iMId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/grammarly_file/${grammarlyFile.id}`}
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
