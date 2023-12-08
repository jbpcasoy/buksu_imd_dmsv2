import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddReturnedIMERCCITLRevisionPage() {
  const formik = useFormik({
    initialValues: {
      activeIDDCoordinatorId: "",
      iMERCCITLRevisionId: "",
    },
    validationSchema: Yup.object({
      activeIDDCoordinatorId: Yup.string().required(),
      iMERCCITLRevisionId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/returned_imerc_citl_revision", values)
        .then(() => {
          alert("ReturnedIMERCCITLRevision has been added successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add ReturnedIMERCCITLRevision</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='activeIDDCoordinatorId'
          {...formik.getFieldProps("activeIDDCoordinatorId")}
        />
        <input
          type='text'
          placeholder='iMERCCITLRevisionId'
          {...formik.getFieldProps("iMERCCITLRevisionId")}
        />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}
