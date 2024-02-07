import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddSubmittedReturnedCITLRevisionPage() {
  const formik = useFormik({
    initialValues: {
      returnedCITLRevisionId: "",
    },
    validationSchema: Yup.object({
      returnedCITLRevisionId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/submitted_returned_citl_revision", values)
        .then(() => {
          alert("SubmittedReturnedCITLRevision has been added successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add SubmittedReturnedCITLRevision</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='returnedCITLRevisionId'
          {...formik.getFieldProps("returnedCITLRevisionId")}
        />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}
