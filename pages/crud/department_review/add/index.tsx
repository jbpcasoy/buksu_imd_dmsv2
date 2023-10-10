import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddDepartmentReviewPage() {
  const formik = useFormik({
    initialValues: {
      iMFileId: "",
    },
    validationSchema: Yup.object({
      iMFileId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/department_review", values)
        .then(() => {
          alert("DepartmentReview Added Successfully");
        })
        .catch((error) => {
          alert(error.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add DepartmentReview</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='iMFileId'
          {...formik.getFieldProps("iMFileId")}
        />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}
