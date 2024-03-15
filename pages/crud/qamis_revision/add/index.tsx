import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddQAMISRevisionPage() {
  const formik = useFormik({
    initialValues: {
      iMFileId: "",
      qAMISFileId: "",
    },
    validationSchema: Yup.object({
      iMFileId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/qamis_revision", values)
        .then(() => {
          alert("QAMISRevision has been added successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add QAMISRevision</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          placeholder="iMFileId"
          {...formik.getFieldProps("iMFileId")}
        />
        <input
          type="text"
          placeholder="qAMISFileId"
          {...formik.getFieldProps("qAMISFileId")}
        />
        <input type="submit" value="Submit" className="rounded border" />
      </form>
    </CrudLayout>
  );
}
