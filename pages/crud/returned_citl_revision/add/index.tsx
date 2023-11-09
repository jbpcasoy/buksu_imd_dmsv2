import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddReturnedCITLRevisionPage() {
  const formik = useFormik({
    initialValues: {
      activeIDDCoordinatorId: "",
      cITLRevisionId: "",
    },
    validationSchema: Yup.object({
      activeIDDCoordinatorId: Yup.string().required(),
      cITLRevisionId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/returned_citl_revision", values)
        .then(() => {
          alert("ReturnedCITLRevision Added Successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add ReturnedCITLRevision</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='activeIDDCoordinatorId'
          {...formik.getFieldProps("activeIDDCoordinatorId")}
        />
        <input
          type='text'
          placeholder='cITLRevisionId'
          {...formik.getFieldProps("cITLRevisionId")}
        />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}
