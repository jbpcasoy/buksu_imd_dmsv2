import CollegeSelector from "@/components/CollegeSelector";
import CrudLayout from "@/components/CrudLayout";
import DepartmentSelector from "@/components/DepartmentSelector";
import UserSelector from "@/components/UserSelector";
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
          alert("Faculty Added Successfully");
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
        <DepartmentSelector {...formik.getFieldProps("departmentId")} />
        <UserSelector {...formik.getFieldProps("userId")} />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}
