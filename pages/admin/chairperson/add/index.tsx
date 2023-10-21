import AdminLayout from "@/components/AdminLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddChairpersonPage() {
  const formik = useFormik({
    initialValues: {
      activeFacultyId: "",
    },
    validationSchema: Yup.object({
      activeFacultyId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/chairperson", values)
        .then(() => {
          alert("Chairperson Added Successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <AdminLayout>
      <h2>Add Chairperson</h2>

      <form onSubmit={formik.handleSubmit}>
        <input type="text" placeholder="activeFacultyId" {...formik.getFieldProps("activeFacultyId")} />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </AdminLayout>
  );
}
