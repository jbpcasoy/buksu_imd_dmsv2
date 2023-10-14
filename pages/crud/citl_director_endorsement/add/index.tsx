import ActiveFacultySelector from "@/components/ActiveFacultySelector";
import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddCITLDirectorEndorsementPage() {
  const formik = useFormik({
    initialValues: {
      iDDCoordinatorEndorsementId: "",
      activeCITLDirectorId: "",
    },
    validationSchema: Yup.object({
      iDDCoordinatorEndorsementId: Yup.string().required(),
      activeCITLDirectorId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/citl_director_endorsement", values)
        .then(() => {
          alert("CITLDirectorEndorsement Added Successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add CITLDirectorEndorsement</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='iDDCoordinatorEndorsementId'
          {...formik.getFieldProps("iDDCoordinatorEndorsementId")}
        />
        <input
          type='text'
          placeholder='activeCITLDirectorId'
          {...formik.getFieldProps("activeCITLDirectorId")}
        />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}
