import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddSyllabusDepartmentReview() {
  const formik = useFormik({
    initialValues: {
      syllabusFileId: "",
    },
    validationSchema: Yup.object({
      syllabusFileId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post(`/api/syllabus_department_review`, values)
        .then(() => {
          alert("SyllabusDepartmentReview has been added successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });

  return (
    <CrudLayout>
      <h2>Add SyllabusDepartmentReview</h2>

      <form onSubmit={formik.handleSubmit} noValidate>
        <input
          type="text"
          placeholder="syllabusFileId"
          {...formik.getFieldProps("syllabusFileId")}
        />
        <input type="submit" value="Submit" className="rounded border" />
      </form>
    </CrudLayout>
  );
}
