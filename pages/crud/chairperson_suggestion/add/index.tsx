import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddChairpersonSuggestionPage() {
  const formik = useFormik({
    initialValues: {
      chairpersonReviewId: "",
    },
    validationSchema: Yup.object({
        chairpersonReviewId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/chairperson_suggestion", values)
        .then(() => {
          alert("ChairpersonSuggestion Added Successfully");
        })
        .catch((error) => {
          alert(error.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add ChairpersonSuggestion</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='chairpersonReviewId'
          {...formik.getFieldProps("chairpersonReviewId")}
        />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}
