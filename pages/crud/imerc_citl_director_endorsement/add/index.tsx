import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddIMERCCITLDirectorEndorsementPage() {
  const formik = useFormik({
    initialValues: {
      iMERCIDDCoordinatorEndorsementId: "",
      activeCITLDirectorId: "",
    },
    validationSchema: Yup.object({
        iMERCIDDCoordinatorEndorsementId: Yup.string().required(),
      activeCITLDirectorId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/imerc_citl_director_endorsement", values)
        .then(() => {
          alert("IMERCCITLDirectorEndorsement has been added successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add IMERCCITLDirectorEndorsement</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='iMERCIDDCoordinatorEndorsementId'
          {...formik.getFieldProps("iMERCIDDCoordinatorEndorsementId")}
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
