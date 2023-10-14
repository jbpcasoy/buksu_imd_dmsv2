import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddQAMISSuggestionPage() {
  const formik = useFormik({
    initialValues: {
      cITLDirectorEndorsementId: "",
    },
    validationSchema: Yup.object({
        cITLDirectorEndorsementId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/qamis_suggestion", values)
        .then(() => {
          alert("QAMISSuggestion Added Successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add QAMISSuggestion</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='cITLDirectorEndorsementId'
          {...formik.getFieldProps("cITLDirectorEndorsementId")}
        />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}
