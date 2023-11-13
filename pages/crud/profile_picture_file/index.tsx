import CrudLayout from "@/components/CrudLayout";
import useProfilePictureFiles from "@/hooks/useProfilePictureFiles";
import Link from "next/link";
import { useState } from "react";

export default function ProfilePictureFilesPage() {
  const [state, setState] = useState({ skip: 0, take: 10 });
  const { profilePictureFiles, count } = useProfilePictureFiles(state);

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
        <h2>ProfilePictureFile</h2>
        <Link className='border rounded' href={`/crud/profile_picture_file/add`}>
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
              <th>userId</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {profilePictureFiles.map((profilePictureFile) => {
              return (
                <tr key={profilePictureFile.id}>
                  <td>{profilePictureFile.id}</td>
                  <td>{new Date(profilePictureFile.createdAt).toLocaleString()}</td>
                  <td>{new Date(profilePictureFile.updatedAt).toLocaleString()}</td>
                  <td>{profilePictureFile.filename}</td>
                  <td>{profilePictureFile.mimetype}</td>
                  <td>{profilePictureFile.size}</td>
                  <td>{profilePictureFile.originalFilename}</td>
                  <td>
                    <Link
                      href={`/crud/user/${profilePictureFile.userId}`}
                      className='underline'
                    >
                      {profilePictureFile.userId}
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={`/crud/profile_picture_file/${profilePictureFile.id}`}
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
