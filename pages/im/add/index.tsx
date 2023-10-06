import MainLayout from "@/components/MainLayout";
import ActiveFacultyContext from "@/contexts/ActiveFacultyContext";
import axios from "axios";
import { useFormik } from "formik";
import { useContext } from "react";
import * as Yup from "yup";

export default function AddIM() {
  const activeFaculty = useContext(ActiveFacultyContext);

  const formik = useFormik({
    initialValues: {
      title: "",
      type: "MODULE",
    },
    validationSchema: Yup.object({
      title: Yup.string().required(),
      type: Yup.string().oneOf([
        "MODULE",
        "COURSE_FILE",
        "WORKTEXT",
        "TEXTBOOK",
      ]).required(),
    }),

    onSubmit: (values) => {
      axios.post("/api/im", 
        {...values, activeFacultyId: activeFaculty?.id}
      ).then(() => {
        alert("IM Uploaded")
      });
    },
  });

  return (
    <MainLayout>
      <h2>Add IM</h2>

      <form onSubmit={formik.handleSubmit} noValidate>
        <input placeholder='Title' {...formik.getFieldProps("title")} />
        <select  {...formik.getFieldProps("type")}>
          <option value='MODULE'>Module</option>
          <option value='COURSE_FILE'>Course File</option>
          <option value='WORKTEXT'>Worktext</option>
          <option value='TEXTBOOK'>Textbook</option>
        </select>
        <input type='submit' value='Submit' disabled={!formik.isValid} className="border rounded" />
      </form>
    </MainLayout>
  );
}
