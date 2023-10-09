import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddActiveIMFilePage() {
  const formik = useFormik({
    initialValues: {
      iMFileId: "",
    },
    validationSchema: Yup.object({
        iMFileId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/active_im_file", values)
        .then(() => {
          alert("ActiveIMFile Added Successfully");
        })
        .catch((error) => {
          alert(error.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add ActiveIMFile</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='name'
          {...formik.getFieldProps("iMFileId")}
        />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}
