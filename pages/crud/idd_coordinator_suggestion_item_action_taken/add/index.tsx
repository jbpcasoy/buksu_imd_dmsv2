import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddIDDCoordinatorSuggestionItemActionTakenPage() {
  const formik = useFormik({
    initialValues: {
      value: "",
      iDDCoordinatorSuggestionItemId: "",
    },
    validationSchema: Yup.object({
      value: Yup.string().required(),
      iDDCoordinatorSuggestionItemId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/idd_coordinator_suggestion_item_action_taken", values)
        .then(() => {
          alert("IDDCoordinatorSuggestionItemActionTaken has been added successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add IDDCoordinatorSuggestionItemActionTaken</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='iDDCoordinatorSuggestionItemId'
          {...formik.getFieldProps("iDDCoordinatorSuggestionItemId")}
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
