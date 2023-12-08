import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddIMERCIDDCoordinatorEndorsementPage() {
  const formik = useFormik({
    initialValues: {
      iMERCCITLRevisionId: "",
      activeIDDCoordinatorId: "",
    },
    validationSchema: Yup.object({
      iMERCCITLRevisionId: Yup.string().required(),
      activeIDDCoordinatorId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/imerc_idd_coordinator_endorsement", values)
        .then(() => {
          alert("IMERCIDDCoordinatorEndorsement has been added successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add IMERCIDDCoordinatorEndorsement</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='iMERCCITLRevisionId'
          {...formik.getFieldProps("iMERCCITLRevisionId")}
        />
        <input
          type='text'
          placeholder='activeIDDCoordinatorId'
          {...formik.getFieldProps("activeIDDCoordinatorId")}
        />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}
