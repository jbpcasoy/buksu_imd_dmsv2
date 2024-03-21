import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddReturnedCITLRevisionSuggestionItemPage() {
  const formik = useFormik({
    initialValues: {
      pageNumber: 0,
      returnedCITLRevisionId: "",
      suggestion: "",
      remarks: "",
    },
    validationSchema: Yup.object({
      pageNumber: Yup.number().min(0).required(),
      returnedCITLRevisionId: Yup.string().required(),
      suggestion: Yup.string().required(),
      remarks: Yup.string(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/returned_citl_revision_suggestion_item", values)
        .then(() => {
          alert(
            "ReturnedCITLRevisionSuggestionItem has been added successfully"
          );
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add ReturnedCITLRevisionSuggestionItem</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          placeholder="returnedCITLRevisionId"
          {...formik.getFieldProps("returnedCITLRevisionId")}
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
