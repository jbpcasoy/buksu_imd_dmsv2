import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddActiveCITLDirectorPage() {
  const formik = useFormik({
    initialValues: {
      cITLDirectorId: "",
    },
    validationSchema: Yup.object({
        cITLDirectorId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/active_citl_director", values)
        .then(() => {
          alert("ActiveCITLDirector has been added successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add ActiveCITLDirector</h2>

      <form onSubmit={formik.handleSubmit}>
        <input type="text" placeholder="cITLDirectorId" {...formik.getFieldProps("cITLDirectorId")} />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}
