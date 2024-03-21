import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddContentEditorSuggestionPage() {
  const formik = useFormik({
    initialValues: {
      contentEditorReviewId: "",
    },
    validationSchema: Yup.object({
      contentEditorReviewId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/content_editor_suggestion", values)
        .then(() => {
          alert("ContentEditorSuggestion has been added successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add ContentEditorSuggestion</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          placeholder="contentEditorReviewId"
          {...formik.getFieldProps("contentEditorReviewId")}
        />
        <input type="submit" value="Submit" className="rounded border" />
      </form>
    </CrudLayout>
  );
}
