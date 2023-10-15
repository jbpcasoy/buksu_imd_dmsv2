import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddIDDSpecialistSuggestionPage() {
  const formik = useFormik({
    initialValues: {
      iDDSpecialistReviewId: "",
    },
    validationSchema: Yup.object({
        iDDSpecialistReviewId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/idd_specialist_suggestion", values)
        .then(() => {
          alert("IDDSpecialistSuggestion Added Successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add IDDSpecialistSuggestion</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='iDDSpecialistReviewId'
          {...formik.getFieldProps("iDDSpecialistReviewId")}
        />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}
