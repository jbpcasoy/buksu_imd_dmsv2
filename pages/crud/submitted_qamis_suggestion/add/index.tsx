import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddSubmittedQAMISSuggestionPage() {
  const formik = useFormik({
    initialValues: {
      qAMISSuggestionId: "",
    },
    validationSchema: Yup.object({
      qAMISSuggestionId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/submitted_qamis_suggestion", values)
        .then(() => {
          alert("SubmittedQAMISSuggestion has been added successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add SubmittedQAMISSuggestion</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='qAMISSuggestionId'
          {...formik.getFieldProps("qAMISSuggestionId")}
        />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}
