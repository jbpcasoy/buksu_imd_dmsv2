import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import { useEffect } from "react";
import * as Yup from "yup";

export default function AddSyllabus() {
  const formik = useFormik({
    initialValues: {
      courseTitle: "",
      courseCode: "",
      activeFacultyId: "",
    },
    validationSchema: Yup.object({
      courseTitle: Yup.string().required(),
      courseCode: Yup.string().required(),
      activeFacultyId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/syllabus", values)
        .then(() => {
          alert("Syllabus has been added successfully");
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
      <h2>Add Syllabus</h2>

      <form onSubmit={formik.handleSubmit} noValidate>
        <input
          type="text"
          placeholder="activeFacultyId"
          {...formik.getFieldProps("activeFacultyId")}
        />
        <input
          type="text"
          placeholder="courseTitle"
          {...formik.getFieldProps("courseTitle")}
        />
        <input
          type="text"
          placeholder="courseCode"
          {...formik.getFieldProps("courseCode")}
        />
        <input type="submit" value="Submit" className="rounded border" />
      </form>
    </CrudLayout>
  );
}
