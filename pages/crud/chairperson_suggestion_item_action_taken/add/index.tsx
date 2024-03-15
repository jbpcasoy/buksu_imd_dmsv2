import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddChairpersonSuggestionItemActionTakenPage() {
  const formik = useFormik({
    initialValues: {
      value: "",
      chairpersonSuggestionItemId: "",
    },
    validationSchema: Yup.object({
      value: Yup.string().required(),
      chairpersonSuggestionItemId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/chairperson_suggestion_item_action_taken", values)
        .then(() => {
          alert(
            "ChairpersonSuggestionItemActionTaken has been added successfully"
          );
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add ChairpersonSuggestionItemActionTaken</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          placeholder="chairpersonSuggestionItemId"
          {...formik.getFieldProps("chairpersonSuggestionItemId")}
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
