import ActiveFacultySelector from "@/components/ActiveFacultySelector";
import AdminLayout from "@/components/AdminLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddDeanPage() {
  const formik = useFormik({
    initialValues: {
      activeFacultyId: "",
    },
    validationSchema: Yup.object({
      activeFacultyId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/dean", values)
        .then(() => {
          alert("Dean Added Successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  
  return (
    <AdminLayout>
      <h2>Add Dean</h2>

      <form onSubmit={formik.handleSubmit}>
        <ActiveFacultySelector {...formik.getFieldProps("activeFacultyId")} />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </AdminLayout>
  );
}
