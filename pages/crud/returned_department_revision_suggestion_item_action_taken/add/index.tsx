import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddReturnedDepartmentRevisionSuggestionItemActionTakenPage() {
  const formik = useFormik({
    initialValues: {
      value: "",
      returnedDepartmentRevisionSuggestionItemId: "",
    },
    validationSchema: Yup.object({
      value: Yup.string().required(),
      returnedDepartmentRevisionSuggestionItemId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post(
          "/api/returned_department_revision_suggestion_item_action_taken",
          values
        )
        .then(() => {
          alert(
            "ReturnedDepartmentRevisionSuggestionItemActionTaken has been added successfully"
          );
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add ReturnedDepartmentRevisionSuggestionItemActionTaken</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          placeholder="returnedDepartmentRevisionSuggestionItemId"
          {...formik.getFieldProps(
            "returnedDepartmentRevisionSuggestionItemId"
          )}
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
