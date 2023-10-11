import CrudLayout from "@/components/CrudLayout";
import useCollege from "@/hooks/useCollege";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function EditCollegePage() {
  const router = useRouter();
  const collegeId = router.query.id;
  const college = useCollege({id: collegeId as string})

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .put(`/api/college/${collegeId}`, values)
        .then(() => {
          alert("College updated successfully");
        })
        .catch((error) => {
          alert(error.message);
        });
    },
  });

  
  useEffect(() => {
    if(!college) return;
    let subscribe = true;
    
    formik.setValues({
      name: college.name
    })

    return () => {
      subscribe = false;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [college])


  return (
    <CrudLayout>
      <h2>Edit College</h2>

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
