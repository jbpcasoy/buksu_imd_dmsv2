import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddIMERCCITLRevisionPage() {
  const formik = useFormik({
    initialValues: {
      iMFileId: "",
      plagiarismFileId: ""
    },
    validationSchema: Yup.object({
      iMFileId: Yup.string().required(),
      plagiarismFileId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/imerc_citl_revision", values)
        .then(() => {
          alert("IMERCCITLRevision has been added successfully");
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
        <input
          type='text'
          placeholder='plagiarismFileId'
          {...formik.getFieldProps("plagiarismFileId")}
        />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}
