import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddContentSpecialistPage() {
  const formik = useFormik({
    initialValues: {
      contentSpecialistId: "",
    },
    validationSchema: Yup.object({
      contentSpecialistId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/active_content_specialist", values)
        .then(() => {
          alert("ContentSpecialist Added Successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add ContentSpecialist</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='contentSpecialistId'
          {...formik.getFieldProps("contentSpecialistId")}
        />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}
