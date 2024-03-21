import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddSubmittedIDDSpecialistSuggestionPage() {
  const formik = useFormik({
    initialValues: {
      iDDSpecialistSuggestionId: "",
    },
    validationSchema: Yup.object({
      iDDSpecialistSuggestionId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/submitted_idd_specialist_suggestion", values)
        .then(() => {
          alert("SubmittedIDDSpecialistSuggestion has been added successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add SubmittedIDDSpecialistSuggestion</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          placeholder="iDDSpecialistSuggestionId"
          {...formik.getFieldProps("iDDSpecialistSuggestionId")}
        />
        <input type="submit" value="Submit" className="rounded border" />
      </form>
    </CrudLayout>
  );
}
