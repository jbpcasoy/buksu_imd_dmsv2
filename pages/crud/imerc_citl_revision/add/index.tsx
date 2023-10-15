import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddIMERCCITLRevisionPage() {
  const formik = useFormik({
    initialValues: {
      iMFileId: "",
    },
    validationSchema: Yup.object({
      iMFileId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/imerc_citl_revision", values)
        .then(() => {
          alert("IMERCCITLRevision Added Successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add IMERCCITLRevision</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='iMFileId'
          {...formik.getFieldProps("iMFileId")}
        />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}
