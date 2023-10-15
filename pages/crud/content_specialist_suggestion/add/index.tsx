import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddContentSpecialistSuggestionPage() {
  const formik = useFormik({
    initialValues: {
      contentSpecialistReviewId: "",
    },
    validationSchema: Yup.object({
        contentSpecialistReviewId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/content_specialist_suggestion", values)
        .then(() => {
          alert("ContentSpecialistSuggestion Added Successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add ContentSpecialistSuggestion</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='contentSpecialistReviewId'
          {...formik.getFieldProps("contentSpecialistReviewId")}
        />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}
