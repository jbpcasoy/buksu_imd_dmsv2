import CollegeSelector from "@/components/CollegeSelector";
import CrudLayout from "@/components/CrudLayout";
import ActiveFacultySelector from "@/components/ActiveFacultySelector";
import axios from "axios";
import { useFormik } from "formik";
import { useEffect } from "react";
import * as Yup from "yup";
import useIM from "@/hooks/useIM";
import { useRouter } from "next/router";

export default function EditIMPage() {
  const router = useRouter();
  const iMId = router.query.id;
  const iM = useIM({ id: iMId as string });
  const formik = useFormik({
    initialValues: {
      title: "",
      type: "MODULE",
    },
    validationSchema: Yup.object({
      title: Yup.string().required(),
      type: Yup.string()
        .oneOf(["MODULE", "COURSE_FILE", "WORKTEXT", "TEXTBOOK"])
        .required(),
    }),
    onSubmit: (values) => {
      axios
        .put(`/api/im/${iMId}`, values)
        .then(() => {
          alert("IM Added Successfully");
        })
        .catch((error) => {
          alert(error.message);
        });
    },
  });

  useEffect(() => {
    if (!iM) return;

    formik.setValues({
      title: iM.title,
      type: iM.type,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iM]);

  useEffect(() => {
    console.log(formik.values);
  }, [formik.values]);

  return (
    <CrudLayout>
      <h2>Add IM</h2>

      <form onSubmit={formik.handleSubmit} noValidate>
        <input
          type='text'
          placeholder='title'
          {...formik.getFieldProps("title")}
        />
        <select>
          <option value='MODULE'>MODULE</option>
          <option value='COURSE_FILE'>COURSE_FILE</option>
          <option value='WORKTEXT'>WORKTEXT</option>
          <option value='TEXTBOOK'>TEXTBOOK</option>
        </select>
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}
