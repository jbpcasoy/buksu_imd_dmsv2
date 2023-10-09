import CrudLayout from "@/components/CrudLayout";
import useIMFiles from "@/hooks/useIMFiles";
import Link from "next/link";
import { useState } from "react";

export default function IMFilesPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { iMFiles, count } = useIMFiles(state);

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
        <h2>IMFile</h2>
        <Link className='border rounded' href={`/crud/im_file/add`}>
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
            {iMFiles.map((iMFile) => {
              return (
                <tr key={iMFile.id}>
                  <td>{iMFile.id}</td>
                  <td>{new Date(iMFile.createdAt).toLocaleString()}</td>
                  <td>{new Date(iMFile.updatedAt).toLocaleString()}</td>
                  <td>{iMFile.filename}</td>
                  <td>{iMFile.mimetype}</td>
                  <td>{iMFile.size}</td>
                  <td>{iMFile.originalFilename}</td>
                  <td>
                    <Link
                      href={`/crud/im/${iMFile.iMId}`}
                      className='underline'
                    >
                      {iMFile.iMId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/im_file/${iMFile.id}`}
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
