import CrudLayout from "@/components/CrudLayout";
import useIMERCCITLRevision from "@/hooks/useIMERCCITLRevision";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function EditIMERCCITLRevisionPage() {
  const router = useRouter();
  const iMERCCITLRevisionId = router.query.id;
  const iMERCCITLRevision = useIMERCCITLRevision({
    id: iMERCCITLRevisionId as string,
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
        .put(`/api/imerc_citl_revision/${iMERCCITLRevisionId}`, values)
        .then(() => {
          alert("IMERCCITLRevision updated successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });

  useEffect(() => {
    if (!iMERCCITLRevision) return;
    let subscribe = true;

    formik.setValues({
      returned: iMERCCITLRevision.returned,
    });

    return () => {
      subscribe = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iMERCCITLRevision]);

  return (
    <CrudLayout>
      <h2>Edit IMERCCITLRevision</h2>

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
