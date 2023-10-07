import CrudLayout from "@/components/CrudLayout";
import DepartmentSelector from "@/components/DeparmentSelector";
import FacultySelector from "@/components/FacultySelector";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddActiveFacultyPage() {
  const formik = useFormik({
    initialValues: {
      departmentId: "",
      facultyId: "",
    },
    validationSchema: Yup.object({
      departmentId: Yup.string().required(),
      facultyId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/active_faculty", values)
        .then(() => {
          alert("ActiveFaculty Added Successfully");
        })
        .catch((error) => {
          alert(error.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add ActiveFaculty</h2>

      <form onSubmit={formik.handleSubmit}>
        <DepartmentSelector {...formik.getFieldProps("departmentId")} />
        <FacultySelector {...formik.getFieldProps("facultyId")} />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}
