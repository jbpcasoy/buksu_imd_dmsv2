import CrudLayout from "@/components/CrudLayout";
import useActiveIMFiles from "@/hooks/useActiveIMFiles";
import Link from "next/link";
import { useState } from "react";

export default function ActiveIMFilesPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { activeIMFiles, count } = useActiveIMFiles(state);

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
        <h2>ActiveIMFile</h2>
        <Link className='border rounded' href={`/crud/active_im_file/add`}>
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
              <th>iMFileId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {activeIMFiles.map((activeIMFile) => {
              return (
                <tr key={activeIMFile.id}>
                  <td>{activeIMFile.id}</td>
                  <td>{new Date(activeIMFile.createdAt).toLocaleString()}</td>
                  <td>{new Date(activeIMFile.updatedAt).toLocaleString()}</td>
                  <td>
                    <Link
                      href={`/crud/im_file/${activeIMFile.iMFileId}`}
                      className='underline'
                    >
                      {activeIMFile.iMFileId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/active_im_file/${activeIMFile.id}`}
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