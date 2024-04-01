import CrudLayout from "@/components/CrudLayout";
import useSyllabusFiles from "@/hooks/useSyllabusFiles";
import Link from "next/link";
import { useState } from "react";

export default function SyllabusFilesPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });

  const { count, syllabusFiles } = useSyllabusFiles(state);

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
        <h2>SyllabusFile</h2>
        <Link className="border rounded" href={`/crud/syllabus_file/add`}>
          Add
        </Link>
      </div>
      <div>
        <table className="table-auto w-full">
          <thead>
            <th>id</th>
            <th>createdAt</th>
            <th>updatedAt</th>
            <th>filename</th>
            <th>mimetype</th>
            <th>size</th>
            <th>originalFilename</th>
            <th>syllabusId</th>
            <th>action</th>
          </thead>
          <tbody>
            {syllabusFiles.map((syllabusFile) => {
              return (
                <tr key={syllabusFile.id}>
                  <td>{syllabusFile.id}</td>
                  <td>{new Date(syllabusFile.createdAt).toLocaleString()}</td>
                  <td>{new Date(syllabusFile.updatedAt).toLocaleString()}</td>
                  <td>{syllabusFile.filename}</td>
                  <td>{syllabusFile.mimetype}</td>
                  <td>{syllabusFile.size}</td>
                  <td>{syllabusFile.originalFilename}</td>
                  <td>
                    <Link
                      href={`/crud/syllabus/${syllabusFile.syllabusId}`}
                      className="underline"
                    >
                      {syllabusFile.syllabusId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/syllabus_file/${syllabusFile.id}`}
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
