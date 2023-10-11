import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddCoordinatorSuggestionPage() {
  const formik = useFormik({
    initialValues: {
      coordinatorReviewId: "",
    },
    validationSchema: Yup.object({
      coordinatorReviewId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/coordinator_suggestion", values)
        .then(() => {
          alert("CoordinatorSuggestion Added Successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add CoordinatorSuggestion</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='coordinatorReviewId'
          {...formik.getFieldProps("coordinatorReviewId")}
        />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}
