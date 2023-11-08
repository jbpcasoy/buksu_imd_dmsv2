import MainLayout from "@/components/MainLayout";
import { ProfilePictureFile } from "@prisma/client";
import axios from "axios";
import { resolveObjectURL } from "buffer";
import { useFormik } from "formik";
import { signOut, useSession } from "next-auth/react";
import { ChangeEventHandler, useEffect, useState } from "react";
import * as Yup from "yup";

export default function ProfilePage() {
  const { data: session } = useSession({
    required: true,
  });

  const [state, setState] = useState<{ previewUrl?: string; file?: File }>();

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required(),
    }),
    onSubmit: async (values) => {
      if (!session?.user) return;
      let profilePicture;

      if (state?.file) {
        const formData = new FormData();
        formData.append("file", state?.file);
        const uploadRes = await axios.post<ProfilePictureFile>(
          `/api/profile_picture_file`,
          formData
        );
        profilePicture = uploadRes.data;
      }

      return axios
        .put(`/api/user/${session.user.id}`, {
          ...values,
          image: `/api/profile_picture_file/${profilePicture?.id}/image`,
        })
        .then((res) => {
          alert("Profile updated successfully");
        });
    },
  });

  const onLogout = () => {
    return signOut();
  };

  const showProfilePreview: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.item(0);
    if (!file) return;
    const newPreviewUrl = URL.createObjectURL(file);
    setState({
      file,
      previewUrl: newPreviewUrl,
    });
  };

  useEffect(() => {
    formik.setValues({
      name: session?.user?.name ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user]);

  return (
    <MainLayout>
      <div className='flex justify-between'>
        <h1>Profile</h1>
        <button
          onClick={onLogout}
          className='bg-palette_blue text-white px-1 rounded'
        >
          LOGOUT
        </button>
      </div>

      <div className='mb-10'>
        <form noValidate onSubmit={formik.handleSubmit}>
          <div className='space-x-1'>
            <picture>
              <img
                src={state?.previewUrl ?? session?.user?.image ?? ""}
                className='h-32 w-32'
                alt="User avatar"
              />
            </picture>
            <input type='file' accept='image/*' onChange={showProfilePreview} />
            <br />
            <input
              type='text'
              placeholder='Name'
              {...formik.getFieldProps("name")}
            />
            <br />
            <input type='submit' value='Save' className='border rounded' />
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
