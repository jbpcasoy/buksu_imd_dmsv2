import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddQAMISChairpersonEndorsementPage() {
  const formik = useFormik({
    initialValues: {
      qAMISRevisionId: "",
      activeChairpersonId: "",
    },
    validationSchema: Yup.object({
      qAMISRevisionId: Yup.string().required(),
      activeChairpersonId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/qamis_chairperson_endorsement", values)
        .then(() => {
          alert("QAMISChairpersonEndorsement Added Successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add QAMISChairpersonEndorsement</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='qAMISRevisionId'
          {...formik.getFieldProps("qAMISRevisionId")}
        />
        <input
          type='text'
          placeholder='activeChairpersonId'
          {...formik.getFieldProps("activeChairpersonId")}
        />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}
