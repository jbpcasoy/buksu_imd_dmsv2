import ActiveFacultySelector from "@/components/ActiveFacultySelector";
import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddDeanEndorsementPage() {
  const formik = useFormik({
    initialValues: {
      coordinatorEndorsementId: "",
      activeDeanId: "",
    },
    validationSchema: Yup.object({
        coordinatorEndorsementId: Yup.string().required(),
      activeDeanId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/dean_endorsement", values)
        .then(() => {
          alert("DeanEndorsement Added Successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add DeanEndorsement</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='coordinatorEndorsementId'
          {...formik.getFieldProps("coordinatorEndorsementId")}
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
