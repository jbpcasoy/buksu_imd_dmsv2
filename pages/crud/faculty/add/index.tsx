import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import { useEffect } from "react";
import * as Yup from "yup";

export default function AddFacultyPage() {
  const formik = useFormik({
    initialValues: {
      userId: "",
      departmentId: "",
    },
    validationSchema: Yup.object({
      userId: Yup.string().required(),
      departmentId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/faculty", values)
        .then(() => {
          alert("Faculty has been added successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  useEffect(() => {
    console.log(formik.values);
  }, [formik.values]);
  return (
    <CrudLayout>
      <h2>Add Faculty</h2>

      <form onSubmit={formik.handleSubmit} noValidate>
        <input
          type="text"
          placeholder="departmentId"
          {...formik.getFieldProps("departmentId")}
        />
        <input
          type="text"
          placeholder="userId"
          {...formik.getFieldProps("userId")}
        />
        <input type="submit" value="Submit" className="rounded border" />
      </form>
    </CrudLayout>
  );
}
