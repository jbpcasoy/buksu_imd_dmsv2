import CrudLayout from "@/components/CrudLayout";
import useDepartment from "@/hooks/useDepartment";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function EditDepartmentPage() {
  const router = useRouter();
  const departmentId = router.query.id;
  const department = useDepartment({ id: departmentId as string });

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .put(`/api/department/${departmentId}`, values)
        .then(() => {
          alert("Department has been updated successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });

  useEffect(() => {
    if (!department) return;
    let subscribe = true;

    formik.setValues({
      name: department.name,
    });

    return () => {
      subscribe = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [department]);

  return (
    <CrudLayout>
      <h2>Edit Department</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          {...formik.getFieldProps("name")}
        />
        <input type="submit" value="Submit" className="rounded border" />
      </form>
    </CrudLayout>
  );
}
