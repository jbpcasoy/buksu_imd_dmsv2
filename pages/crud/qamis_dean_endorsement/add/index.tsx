import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddQAMISDeanEndorsementPage() {
  const formik = useFormik({
    initialValues: {
      qAMISRevisionId: "",
      activeDeanId: "",
    },
    validationSchema: Yup.object({
      qAMISRevisionId: Yup.string().required(),
      activeDeanId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/qamis_dean_endorsement", values)
        .then(() => {
          alert("QAMISDeanEndorsement has been added successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add QAMISDeanEndorsement</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='qAMISRevisionId'
          {...formik.getFieldProps("qAMISRevisionId")}
        />
        <input
          type='text'
          placeholder='activeDeanId'
          {...formik.getFieldProps("activeDeanId")}
        />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}
