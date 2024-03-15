import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddSubmittedIDDCoordinatorSuggestionPage() {
  const formik = useFormik({
    initialValues: {
      iDDCoordinatorSuggestionId: "",
    },
    validationSchema: Yup.object({
      iDDCoordinatorSuggestionId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/submitted_idd_coordinator_suggestion", values)
        .then(() => {
          alert(
            "SubmittedIDDCoordinatorSuggestion has been added successfully"
          );
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add SubmittedIDDCoordinatorSuggestion</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          placeholder="iDDCoordinatorSuggestionId"
          {...formik.getFieldProps("iDDCoordinatorSuggestionId")}
        />
        <input type="submit" value="Submit" className="rounded border" />
      </form>
    </CrudLayout>
  );
}
