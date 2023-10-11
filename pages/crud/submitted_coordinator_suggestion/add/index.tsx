import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddSubmittedCoordinatorSuggestionPage() {
  const formik = useFormik({
    initialValues: {
      coordinatorSuggestionId: "",
    },
    validationSchema: Yup.object({
      coordinatorSuggestionId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/submitted_coordinator_suggestion", values)
        .then(() => {
          alert("SubmittedCoordinatorSuggestion Added Successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add SubmittedCoordinatorSuggestion</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='coordinatorSuggestionId'
          {...formik.getFieldProps("coordinatorSuggestionId")}
        />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}
