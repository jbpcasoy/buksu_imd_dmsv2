import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddSerialNumberPage() {
  const formik = useFormik({
    initialValues: {
      value: "",
      iMERCCITLDirectorEndorsementId: "",
    },
    validationSchema: Yup.object({
      value: Yup.string().required(),
      iMERCCITLDirectorEndorsementId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/serial_number", values)
        .then(() => {
          alert("Serial number has been added successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add Serial Number</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          placeholder="iMERCCITLDirectorEndorsementId"
          {...formik.getFieldProps("iMERCCITLDirectorEndorsementId")}
        />
        <input
          type="text"
          placeholder="Value"
          {...formik.getFieldProps("value")}
        />
        <input type="submit" value="Submit" className="rounded border" />
      </form>
    </CrudLayout>
  );
}
