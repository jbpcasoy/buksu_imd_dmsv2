import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import { useEffect } from "react";
import * as Yup from "yup";

export default function AddCITLDirectorPage() {
  const formik = useFormik({
    initialValues: {
      userId: "",
    },
    validationSchema: Yup.object({
      userId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/citl_director", values)
        .then(() => {
          alert("CITLDirector has been added successfully");
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
      <h2>Add CITLDirector</h2>

      <form onSubmit={formik.handleSubmit} noValidate>
        <input
          type='text'
          placeholder='userId'
          {...formik.getFieldProps("userId")}
        />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}
