import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddReturnedCITLRevisionSuggestionItemActionTakenPage() {
  const formik = useFormik({
    initialValues: {
      value: "",
      returnedCITLRevisionSuggestionItemId: "",
    },
    validationSchema: Yup.object({
      value: Yup.string().required(),
      returnedCITLRevisionSuggestionItemId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post(
          "/api/returned_citl_revision_suggestion_item_action_taken",
          values
        )
        .then(() => {
          alert(
            "ReturnedCITLRevisionSuggestionItemActionTaken has been added successfully"
          );
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add ReturnedCITLRevisionSuggestionItemActionTaken</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          placeholder="returnedCITLRevisionSuggestionItemId"
          {...formik.getFieldProps("returnedCITLRevisionSuggestionItemId")}
        />
        <input
          type="text"
          placeholder="value"
          {...formik.getFieldProps("value")}
        />
        <input type="submit" value="Submit" className="rounded border" />
      </form>
    </CrudLayout>
  );
}
