import MainLayout from "@/components/MainLayout";
import { SnackbarContext } from "@/components/SnackbarProvider";
import useCollege from "@/hooks/useCollege";
import useDepartmentMe from "@/hooks/useDepartmentMe";
import { ProfilePictureFile } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ChangeEventHandler, useContext, useEffect, useState } from "react";
import * as Yup from "yup";

export default function ProfilePage() {
  const { data: session } = useSession({
    required: true,
  });
  const router = useRouter();
  const department = useDepartmentMe();
  const college = useCollege({
    id: department?.collegeId,
  });
  const { addSnackbar } = useContext(SnackbarContext);

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
          addSnackbar("Profile updated successfully");
        })
        .catch((error) => {
          addSnackbar(
            error.response.data?.error?.message ?? "Failed to update profile",
            "error"
          );
        })
        .finally(() => {
          router.reload();
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
      <div className='h-full flex flex-col'>
        <div className='flex justify-end'>
          <button
            onClick={onLogout}
            className='bg-palette_blue text-white px-2 py-1 rounded'
          >
            LOGOUT
          </button>
        </div>

        <div className='h-full'>
          <form noValidate onSubmit={formik.handleSubmit} className='h-full'>
            <div className='h-full flex justify-center items-center'>
              <div className='space-x-1 flex flex-col justify-center items-center space-y-1 mx-auto border p-10 rounded-lg shadow'>
                <input
                  id='profile-picture'
                  type='file'
                  accept='image/*'
                  hidden={true}
                  onChange={showProfilePreview}
                />
                <label
                  htmlFor='profile-picture'
                  className='cursor-pointer hover:opacity-95'
                >
                  <picture>
                    <img
                      src={state?.previewUrl ?? session?.user?.image ?? ""}
                      className='h-32 w-32 rounded-full'
                      alt='User avatar'
                    />
                  </picture>
                </label>
                {department && college && (
                  <p className='text-sm'>
                    {department?.name} | {college?.name}
                  </p>
                )}
                <p className='text-sm'>{session?.user?.email}</p>
                <input
                  type='text'
                  required
                  placeholder='Name'
                  {...formik.getFieldProps("name")}
                  className='rounded w-full'
                />
                <input
                  type='submit'
                  value='Save'
                  className='bg-palette_blue text-palette_white w-full py-1 rounded'
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
