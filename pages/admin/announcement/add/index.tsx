import AdminLayout from "@/components/AdminLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddAnnouncementPage() {
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
        .post("/api/announcement", values)
        .then(() => {
          alert("Announcement Added Successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <AdminLayout>
      <h2>Add Announcement</h2>

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
