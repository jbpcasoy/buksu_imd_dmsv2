import CrudLayout from "@/components/CrudLayout";
import useProfilePictureFile from "@/hooks/useProfilePictureFile";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ProfilePictureFilePage() {
  const router = useRouter();
  const profilePictureFileId = router.query.id;
  const profilePictureFile = useProfilePictureFile({ id: profilePictureFileId as string });

  const deleteHandler = () => {
    const ok = confirm("Are you sure?");

    if (!ok) {
      return;
    }

    axios
      .delete(`/api/profile_picture_file/${profilePictureFileId}`)
      .then(() => {
        alert("ProfilePictureFile deleted successfully");
      })
      .catch((error) => {
        alert(error?.response?.data?.error?.message);
      });
  };

  if (!profilePictureFile) return null;

  return (
    <CrudLayout>
      <div className='flex'>
        <h2 className='flex-1'>ProfilePictureFile</h2>
        <div className='space-x-1'>
          <button className='border rounded' onClick={deleteHandler}>
            delete
          </button>
        </div>
      </div>
      <p>id: {profilePictureFile.id}</p>
      <p>createdAt: {new Date(profilePictureFile.createdAt).toLocaleString()}</p>
      <p>updatedAt: {new Date(profilePictureFile.updatedAt).toLocaleString()}</p>
      <p>
        userId:{" "}
        <Link href={`/crud/user/${profilePictureFile.userId}`} className='underline'>
          {profilePictureFile.userId}
        </Link>
      </p>
      <p>filename: {profilePictureFile.filename}</p>
      <p>mimetype: {profilePictureFile.mimetype}</p>
      <p>originalFilename: {profilePictureFile.originalFilename}</p>
      <p>size: {profilePictureFile.size}</p>
    </CrudLayout>
  );
}
