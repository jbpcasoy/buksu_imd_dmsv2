import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddSubmittedReturnedDepartmentRevisionPage() {
  const formik = useFormik({
    initialValues: {
      returnedDepartmentRevisionId: "",
    },
    validationSchema: Yup.object({
      returnedDepartmentRevisionId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/submitted_returned_department_revision", values)
        .then(() => {
          alert(
            "SubmittedReturnedDepartmentRevision has been added successfully"
          );
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add SubmittedReturnedDepartmentRevision</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          placeholder="returnedDepartmentRevisionId"
          {...formik.getFieldProps("returnedDepartmentRevisionId")}
        />
        <input type="submit" value="Submit" className="rounded border" />
      </form>
    </CrudLayout>
  );
}
