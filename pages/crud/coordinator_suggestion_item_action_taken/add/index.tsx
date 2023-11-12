import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddCoordinatorSuggestionItemActionTakenPage() {
  const formik = useFormik({
    initialValues: {
      value: "",
      coordinatorSuggestionItemId: "",
    },
    validationSchema: Yup.object({
      value: Yup.string().required(),
      coordinatorSuggestionItemId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/coordinator_suggestion_item_action_taken", values)
        .then(() => {
          alert("CoordinatorSuggestionItemActionTaken Added Successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add CoordinatorSuggestionItemActionTaken</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='coordinatorSuggestionItemId'
          {...formik.getFieldProps("coordinatorSuggestionItemId")}
        />
        <input
          type='text'
          placeholder='value'
          {...formik.getFieldProps("value")}
        />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}
