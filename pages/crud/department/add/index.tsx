import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import { useEffect } from "react";
import * as Yup from "yup";

export default function AddDepartmentPage() {
  const formik = useFormik({
    initialValues: {
      name: "",
      collegeId: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required(),
      collegeId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/department", values)
        .then(() => {
          alert("Department has been added successfully");
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
      <h2>Add Department</h2>

      <form onSubmit={formik.handleSubmit} noValidate>
        <input
          type='text'
          placeholder='collegeId'
          {...formik.getFieldProps("collegeId")}
        />
        <input
          type='text'
          placeholder='Name'
          {...formik.getFieldProps("name")}
        />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}
