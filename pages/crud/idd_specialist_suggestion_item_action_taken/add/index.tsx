import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddIDDSpecialistSuggestionItemActionTakenPage() {
  const formik = useFormik({
    initialValues: {
      value: "",
      iDDSpecialistSuggestionItemId: "",
    },
    validationSchema: Yup.object({
      value: Yup.string().required(),
      iDDSpecialistSuggestionItemId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/idd_specialist_suggestion_item_action_taken", values)
        .then(() => {
          alert("IDDSpecialistSuggestionItemActionTaken Added Successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add IDDSpecialistSuggestionItemActionTaken</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='iDDSpecialistSuggestionItemId'
          {...formik.getFieldProps("iDDSpecialistSuggestionItemId")}
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
