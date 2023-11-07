import MainLayout from "@/components/MainLayout";
import useIM from "@/hooks/useIM";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function IMEdit() {
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
      axios.put(`/api/im/${iMId}`, values).then(() => {
        alert("IM Updated");
      }).catch(error => {
        alert(error.response.data.error.message);
      }) ;
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
    console.log({ iM });
  }, [iM]);

  return (
    <MainLayout>
      <h2>Edit IM</h2>

      <form onSubmit={formik.handleSubmit} noValidate>
        <input placeholder='Title' {...formik.getFieldProps("title")} />
        <select {...formik.getFieldProps("type")}>
          <option value='MODULE'>Module</option>
          <option value='COURSE_FILE'>Course File</option>
          <option value='WORKTEXT'>Worktext</option>
          <option value='TEXTBOOK'>Textbook</option>
        </select>
        <input
          type='submit'
          value='Submit'
          disabled={!formik.isValid}
          className='border rounded'
        />
      </form>
    </MainLayout>
  );
}
