import AdminLayout from "@/components/AdminLayout";
import useAnnouncement from "@/hooks/useAnnouncement";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function EditAnnouncementPage() {
  const router = useRouter();
  const announcementId = router.query.id;
  const announcement = useAnnouncement({ id: announcementId as string });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      url: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required(),
      description: Yup.string(),
      url: Yup.string(),
    }),
    onSubmit: (values) => {
      axios
        .put(`/api/announcement/${announcementId}`, values)
        .then(() => {
          alert("Announcement updated successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });

  useEffect(() => {
    if (!announcement) return;
    let subscribe = true;

    formik.setValues({
      title: announcement.title,
      description: announcement.description ?? "",
      url: announcement.url ?? "",  
    });

    return () => {
      subscribe = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [announcement]);

  return (
    <AdminLayout>
      <h2>Edit Announcement</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='title'
          {...formik.getFieldProps("title")}
        />
        <br />
        <textarea
          placeholder='description'
          {...formik.getFieldProps("description")}
        />
        <br />
        <input type='text' placeholder='url' {...formik.getFieldProps("url")} />
        <br />

        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </AdminLayout>
  );
}
