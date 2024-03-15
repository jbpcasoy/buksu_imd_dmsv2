import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddContentEditorSuggestionItemActionTakenPage() {
  const formik = useFormik({
    initialValues: {
      value: "",
      contentEditorSuggestionItemId: "",
    },
    validationSchema: Yup.object({
      value: Yup.string().required(),
      contentEditorSuggestionItemId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/content_editor_suggestion_item_action_taken", values)
        .then(() => {
          alert(
            "ContentEditorSuggestionItemActionTaken has been added successfully"
          );
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add ContentEditorSuggestionItemActionTaken</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          placeholder="contentEditorSuggestionItemId"
          {...formik.getFieldProps("contentEditorSuggestionItemId")}
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
