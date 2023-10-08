import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddCollegePage() {
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/college", values)
        .then(() => {
          alert("College Added Successfully");
        })
        .catch((error) => {
          alert(error.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add College</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='name'
          {...formik.getFieldProps("name")}
        />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}