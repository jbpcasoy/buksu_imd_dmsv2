import CrudLayout from "@/components/CrudLayout";
import useSyllabus from "@/hooks/useSyllabus";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function EditSyllabus() {
  const router = useRouter();
  const syllabusId = router.query.id as string;
  const syllabus = useSyllabus({
    id: syllabusId,
  });

  const formik = useFormik({
    initialValues: {
      courseTitle: "",
      courseCode: "",
    },
    validationSchema: Yup.object({
      courseTitle: Yup.string().required(),
      courseCode: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .put(`/api/syllabus/${syllabusId}`, values)
        .then(() => {
          alert("Syllabus has been updated successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });

  useEffect(() => {
    if (!syllabus) return;
    let subscribe = true;

    formik.setValues({
      courseTitle: syllabus.courseTitle,
      courseCode: syllabus.courseCode,
    });

    return () => {
      subscribe = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syllabus]);

  return (
    <CrudLayout>
      <h2>Edit Syllabus</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          placeholder="courseTitle"
          {...formik.getFieldProps("courseTitle")}
        />
        <input
          type="text"
          placeholder="courseCode"
          {...formik.getFieldProps("courseCode")}
        />
        <input type="submit" value="Submit" className="rounded border" />
      </form>
    </CrudLayout>
  );
}
