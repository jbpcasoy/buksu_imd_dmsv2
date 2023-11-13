import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddReturnedIMERCCITLRevisionSuggestionItemActionTakenPage() {
  const formik = useFormik({
    initialValues: {
      value: "",
      returnedIMERCCITLRevisionSuggestionItemId: "",
    },
    validationSchema: Yup.object({
      value: Yup.string().required(),
      returnedIMERCCITLRevisionSuggestionItemId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/returned_imerc_citl_revision_suggestion_item_action_taken", values)
        .then(() => {
          alert("ReturnedIMERCCITLRevisionSuggestionItemActionTaken Added Successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add ReturnedIMERCCITLRevisionSuggestionItemActionTaken</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='returnedIMERCCITLRevisionSuggestionItemId'
          {...formik.getFieldProps("returnedIMERCCITLRevisionSuggestionItemId")}
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
