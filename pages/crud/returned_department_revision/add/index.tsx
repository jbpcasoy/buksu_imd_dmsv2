import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddReturnedDepartmentRevisionPage() {
  const formik = useFormik({
    initialValues: {
      activeCoordinatorId: "",
      departmentRevisionId: "",
    },
    validationSchema: Yup.object({
      activeCoordinatorId: Yup.string().required(),
      departmentRevisionId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/returned_department_revision", values)
        .then(() => {
          alert("ReturnedDepartmentRevision has been added successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add ReturnedDepartmentRevision</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          placeholder="activeCoordinatorId"
          {...formik.getFieldProps("activeCoordinatorId")}
        />
        <input
          type="text"
          placeholder="departmentRevisionId"
          {...formik.getFieldProps("departmentRevisionId")}
        />
        <input type="submit" value="Submit" className="rounded border" />
      </form>
    </CrudLayout>
  );
}
