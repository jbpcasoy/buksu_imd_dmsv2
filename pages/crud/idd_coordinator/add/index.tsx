import CollegeSelector from "@/components/CollegeSelector";
import CrudLayout from "@/components/CrudLayout";
import DepartmentSelector from "@/components/DepartmentSelector";
import UserSelector from "@/components/UserSelector";
import axios from "axios";
import { useFormik } from "formik";
import { useEffect } from "react";
import * as Yup from "yup";

export default function AddIDDCoordinatorPage() {
  const formik = useFormik({
    initialValues: {
      userId: "",
    },
    validationSchema: Yup.object({
      userId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/idd_coordinator", values)
        .then(() => {
          alert("IDDCoordinator Added Successfully");
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
      <h2>Add IDDCoordinator</h2>

      <form onSubmit={formik.handleSubmit} noValidate>
        <UserSelector {...formik.getFieldProps("userId")} />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}
