import CrudLayout from "@/components/CrudLayout";
import useCITLRevision from "@/hooks/useCITLRevision";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function EditCITLRevisionPage() {
  const router = useRouter();
  const cITLRevisionId = router.query.id;
  const cITLRevision = useCITLRevision({
    id: cITLRevisionId as string,
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
        .put(`/api/citl_revision/${cITLRevisionId}`, values)
        .then(() => {
          alert("CITLRevision updated successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });

  useEffect(() => {
    if (!cITLRevision) return;
    let subscribe = true;

    formik.setValues({
      returned: cITLRevision.returned,
    });

    return () => {
      subscribe = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cITLRevision]);

  return (
    <CrudLayout>
      <h2>Edit CITLRevision</h2>

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
