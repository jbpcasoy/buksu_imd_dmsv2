import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddSubmittedContentEditorSuggestionPage() {
  const formik = useFormik({
    initialValues: {
      contentEditorSuggestionId: "",
    },
    validationSchema: Yup.object({
      contentEditorSuggestionId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/submitted_content_editor_suggestion", values)
        .then(() => {
          alert("SubmittedContentEditorSuggestion Added Successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add SubmittedContentEditorSuggestion</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='contentEditorSuggestionId'
          {...formik.getFieldProps("contentEditorSuggestionId")}
        />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}
