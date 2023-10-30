import ActiveFacultySelector from "@/components/ActiveFacultySelector";
import AdminLayout from "@/components/AdminLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddCoordinatorPage() {
  const formik = useFormik({
    initialValues: {
      activeFacultyId: "",
    },
    validationSchema: Yup.object({
      activeFacultyId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/coordinator", values)
        .then(() => {
          alert("Coordinator Added Successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <AdminLayout>
      <h2>Add Coordinator</h2>

      <form onSubmit={formik.handleSubmit}>
        <ActiveFacultySelector {...formik.getFieldProps("activeFacultyId")} />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </AdminLayout>
  );
}
