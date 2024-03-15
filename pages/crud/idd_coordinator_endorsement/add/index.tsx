import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddIDDCoordinatorEndorsementPage() {
  const formik = useFormik({
    initialValues: {
      cITLRevisionId: "",
      activeIDDCoordinatorId: "",
    },
    validationSchema: Yup.object({
      cITLRevisionId: Yup.string().required(),
      activeIDDCoordinatorId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/idd_coordinator_endorsement", values)
        .then(() => {
          alert("IDDCoordinatorEndorsement has been added successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add IDDCoordinatorEndorsement</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          placeholder="cITLRevisionId"
          {...formik.getFieldProps("cITLRevisionId")}
        />
        <input
          type="text"
          placeholder="activeIDDCoordinatorId"
          {...formik.getFieldProps("activeIDDCoordinatorId")}
        />
        <input type="submit" value="Submit" className="rounded border" />
      </form>
    </CrudLayout>
  );
}
