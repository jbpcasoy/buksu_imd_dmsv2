import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddSubmittedReturnedIMERCCITLRevisionPage() {
  const formik = useFormik({
    initialValues: {
      returnedIMERCCITLRevisionId: "",
    },
    validationSchema: Yup.object({
      returnedIMERCCITLRevisionId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/submitted_returned_imerc_citl_revision", values)
        .then(() => {
          alert(
            "SubmittedReturnedIMERCCITLRevision has been added successfully"
          );
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add SubmittedReturnedIMERCCITLRevision</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          placeholder="returnedIMERCCITLRevisionId"
          {...formik.getFieldProps("returnedIMERCCITLRevisionId")}
        />
        <input type="submit" value="Submit" className="rounded border" />
      </form>
    </CrudLayout>
  );
}
