import CrudLayout from "@/components/CrudLayout";
import useDepartmentRevision from "@/hooks/useDepartmentRevision";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function EditDepartmentRevisionPage() {
  const router = useRouter();
  const departmentRevisionId = router.query.id;
  const departmentRevision = useDepartmentRevision({
    id: departmentRevisionId as string,
  });

  const formik = useFormik({
    initialValues: {
      returned: false,
    },
    validationSchema: Yup.object({
      returned: Yup.boolean().required(),
    }),
    onSubmit: (values) => {
      axios
        .put(`/api/department_revision/${departmentRevisionId}`, values)
        .then(() => {
          alert("DepartmentRevision updated successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });

  useEffect(() => {
    if (!departmentRevision) return;
    let subscribe = true;

    formik.setValues({
      returned: departmentRevision.returned,
    });

    return () => {
      subscribe = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departmentRevision]);

  return (
    <CrudLayout>
      <h2>Edit DepartmentRevision</h2>

      <form onSubmit={formik.handleSubmit}>
        <select {...formik.getFieldProps("returned")}>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}
