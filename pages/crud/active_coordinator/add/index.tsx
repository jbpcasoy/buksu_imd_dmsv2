import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddActiveCoordinatorPage() {
  const formik = useFormik({
    initialValues: {
      activeFacultyId: "",
    },
    validationSchema: Yup.object({
      activeFacultyId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/active_coordinator", values)
        .then(() => {
          alert("ActiveCoordinator Added Successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });

  return (
    <CrudLayout>
      <h2>Add ActiveCoordinator</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='activeFacultyId'
          {...formik.getFieldProps("activeFacultyId")}
        />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}
