import CollegeSelector from "@/components/CollegeSelector";
import CrudLayout from "@/components/CrudLayout";
import ActiveFacultySelector from "@/components/ActiveFacultySelector";
import axios from "axios";
import { useFormik } from "formik";
import { useEffect } from "react";
import * as Yup from "yup";

export default function AddIMPage() {
  const formik = useFormik({
    initialValues: {
      title: "",
      activeFacultyId: "",
      type: "MODULE",
    },
    validationSchema: Yup.object({
      title: Yup.string().required(),
      activeFacultyId: Yup.string().required(),
      type: Yup.string()
        .oneOf(["MODULE", "COURSE_FILE", "WORKTEXT", "TEXTBOOK"])
        .required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/im", values)
        .then(() => {
          alert("IM Added Successfully");
        })
        .catch((error) => {
          alert(error.message);
        });
    },
  });
  useEffect(() => {
    console.log(formik.values);
  }, [formik.values]);
  return (
    <CrudLayout>
      <h2>Add IM</h2>

      <form onSubmit={formik.handleSubmit} noValidate>
        <ActiveFacultySelector {...formik.getFieldProps("activeFacultyId")} />
        <input
          type='text'
          placeholder='title'
          {...formik.getFieldProps("title")}
        />
        <select>
            <option value="MODULE">MODULE</option>
            <option value="COURSE_FILE">COURSE_FILE</option>
            <option value="WORKTEXT">WORKTEXT</option>
            <option value="TEXTBOOK">TEXTBOOK</option>
        </select>
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}