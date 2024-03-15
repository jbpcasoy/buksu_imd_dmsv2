import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddActiveFacultyPage() {
  const formik = useFormik({
    initialValues: {
      facultyId: "",
    },
    validationSchema: Yup.object({
      facultyId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/active_faculty", values)
        .then(() => {
          alert("ActiveFaculty has been added successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add ActiveFaculty</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          placeholder="facultyId"
          {...formik.getFieldProps("facultyId")}
        />
        <input type="submit" value="Submit" className="rounded border" />
      </form>
    </CrudLayout>
  );
}
