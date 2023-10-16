import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddActiveIDDCoordinatorPage() {
  const formik = useFormik({
    initialValues: {
      iDDCoordinatorId: "",
    },
    validationSchema: Yup.object({
        iDDCoordinatorId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/active_idd_coordinator", values)
        .then(() => {
          alert("ActiveIDDCoordinator Added Successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add ActiveIDDCoordinator</h2>

      <form onSubmit={formik.handleSubmit}>
        <input type="text" placeholder="iDDCoordinatorId" {...formik.getFieldProps("iDDCoordinatorId")} />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}
