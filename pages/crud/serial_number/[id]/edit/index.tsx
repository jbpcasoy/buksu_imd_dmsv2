import CrudLayout from "@/components/CrudLayout";
import useSerialNumber from "@/hooks/useSerialNumber";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function EditSerialNumberPage() {
  const router = useRouter();
  const serialNumberId = router.query.id;
  const serialNumber = useSerialNumber({ id: serialNumberId as string });

  const formik = useFormik({
    initialValues: {
      value: "",
    },
    validationSchema: Yup.object({
      value: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .put(`/api/serial_number/${serialNumberId}`, values)
        .then(() => {
          alert("Serial number has been updated successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });

  useEffect(() => {
    if (!serialNumber) return;
    let subscribe = true;

    formik.setValues({
      value: serialNumber.value,
    });

    return () => {
      subscribe = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serialNumber]);

  return (
    <CrudLayout>
      <h2>Edit Serial Number</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          placeholder="Serial Number"
          {...formik.getFieldProps("value")}
        />
        <input type="submit" value="Submit" className="rounded border" />
      </form>
    </CrudLayout>
  );
}
