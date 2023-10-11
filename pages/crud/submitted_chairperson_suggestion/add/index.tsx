import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddSubmittedChairpersonSuggestionPage() {
  const formik = useFormik({
    initialValues: {
      chairpersonSuggestionId: "",
    },
    validationSchema: Yup.object({
      chairpersonSuggestionId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/submitted_chairperson_suggestion", values)
        .then(() => {
          alert("SubmittedChairpersonSuggestion Added Successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add SubmittedChairpersonSuggestion</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='chairpersonSuggestionId'
          {...formik.getFieldProps("chairpersonSuggestionId")}
        />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}
