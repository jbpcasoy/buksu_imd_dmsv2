import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddSubmittedContentSpecialistSuggestionPage() {
  const formik = useFormik({
    initialValues: {
      contentSpecialistSuggestionId: "",
    },
    validationSchema: Yup.object({
      contentSpecialistSuggestionId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/submitted_content_specialist_suggestion", values)
        .then(() => {
          alert(
            "SubmittedContentSpecialistSuggestion has been added successfully"
          );
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add SubmittedContentSpecialistSuggestion</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          placeholder="contentSpecialistSuggestionId"
          {...formik.getFieldProps("contentSpecialistSuggestionId")}
        />
        <input type="submit" value="Submit" className="rounded border" />
      </form>
    </CrudLayout>
  );
}
