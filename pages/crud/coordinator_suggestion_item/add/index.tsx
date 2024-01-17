import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddCoordinatorSuggestionItemPage() {
  const formik = useFormik({
    initialValues: {
      pageNumber: 0,
      coordinatorSuggestionId: "",
      suggestion: "",
      remarks: "",
    },
    validationSchema: Yup.object({
      pageNumber: Yup.number().min(0).required(),
      coordinatorSuggestionId: Yup.string().required(),
      suggestion: Yup.string().required(),
      remarks: Yup.string(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/coordinator_suggestion_item", values)
        .then(() => {
          alert("CoordinatorSuggestionItem has been added successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add CoordinatorSuggestionItem</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          placeholder="coordinatorSuggestionId"
          {...formik.getFieldProps("coordinatorSuggestionId")}
        />
        <input
          type="text"
          placeholder="suggestion"
          {...formik.getFieldProps("suggestion")}
        />
        <input
          type="text"
          placeholder="pageNumber"
          {...formik.getFieldProps("pageNumber")}
        />
        <input
          type="text"
          placeholder="remarks"
          {...formik.getFieldProps("remarks")}
        />
        <input type="submit" value="Submit" className="rounded border" />
      </form>
    </CrudLayout>
  );
}
