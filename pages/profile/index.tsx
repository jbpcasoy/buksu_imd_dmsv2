import MainLayout from "@/components/MainLayout";
import { SnackbarContext } from "@/components/SnackbarProvider";
import useCollege from "@/hooks/useCollege";
import useDepartmentMe from "@/hooks/useDepartmentMe";
import { ProfilePictureFile } from "@prisma/client";
import axios from "axios";
import { useFormik } from "formik";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ChangeEventHandler, useContext, useEffect, useState } from "react";
import * as Yup from "yup";

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);

  axios.interceptors.request.use(
    function (config) {
      setLoading(true);
      return config;
    },
    function (error) {
      console.log({ error });
      setLoading(false);
      return Promise.reject(error);
    }
  );
  axios.interceptors.response.use(
    function (response) {
      setLoading(false);
      return response;
    },
    function (error) {
      console.log({ error });
      setLoading(false);
      return Promise.reject(error);
    }
  );
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
          image: profilePicture
            ? `/api/profile_picture_file/${profilePicture?.id}/image`
            : undefined,
        })
        .then((res) => {
          addSnackbar("Profile has been updated successfully");
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
      <div className="h-full flex flex-col space-y-1 bg-palette_white p-4 rounded-2xl">

        <div className="h-full">
          <form noValidate onSubmit={formik.handleSubmit} className="h-full">
            <div className="h-full flex justify-center items-center">
              <div className="space-x-1 flex flex-row justify-center items-stretch space-y-1 mx-auto border rounded-lg shadow overflow-hidden">
                <div>
                  <input
                    id="profile-picture"
                    type="file"
                    accept="image/*"
                    hidden={true}
                    onChange={showProfilePreview}
                  />
                  <div className="h-64 w-64 object-cover rounded-l-lg bg-palette_white flex justify-center items-center">
                    <label
                      htmlFor="profile-picture"
                      className="cursor-pointer hover:opacity-95"
                    >
                      <picture>
                        <img
                          src={
                            state?.previewUrl ??
                            session?.user?.image ??
                            "/images/buksu-logo-min-512x512.png"
                          }
                          onError={(e) => {
                            e.currentTarget.src =
                              "/images/buksu-logo-min-512x512.png";
                          }}
                          className="h-48 w-48 object-cover rounded-full"
                          alt="User avatar"
                        />
                      </picture>

                    </label>
                  </div>
                </div>
                <div className="flex flex-col space-y-1 justify-between p-9">
                  <div className="flex-1 flex flex-col justify-center items-center space-y-2">
                    <input
                      type="text"
                      required
                      placeholder="Name"
                      {...formik.getFieldProps("name")}
                      className="w-full border-0 border-b focus:border-b focus:border-b-current focus:ring-0 p-0 font-medium text-center"
                    />
                    <div className="text-center">
                      {department && college && (
                        <p className="text-sm">
                          {department?.name} | {college?.name}
                        </p>
                      )}
                      <p className="text-xs text-palette_grey">{session?.user?.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <input
                      type="submit"
                      value="Save"
                      disabled={loading}
                      className="bg-palette_blue text-palette_white w-full py-1 rounded cursor-pointer"
                    />
                  </div>
                </div>

              </div>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}
