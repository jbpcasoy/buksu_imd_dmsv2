import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import ActiveFacultySelector from "@/components/ActiveFacultySelector";

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
          alert(error.message);
        });
    },
  });
  
  return (
    <CrudLayout>
      <h2>Add ActiveCoordinator</h2>

      <form onSubmit={formik.handleSubmit}>
        <ActiveFacultySelector {...formik.getFieldProps("activeFacultyId")} />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}
