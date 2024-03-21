import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddQAMISCoordinatorEndorsementPage() {
  const formik = useFormik({
    initialValues: {
      qAMISRevisionId: "",
      activeCoordinatorId: "",
    },
    validationSchema: Yup.object({
      qAMISRevisionId: Yup.string().required(),
      activeCoordinatorId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/qamis_coordinator_endorsement", values)
        .then(() => {
          alert("QAMISCoordinatorEndorsement has been added successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add QAMISCoordinatorEndorsement</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          placeholder="qAMISRevisionId"
          {...formik.getFieldProps("qAMISRevisionId")}
        />
        <input
          type="text"
          placeholder="activeCoordinatorId"
          {...formik.getFieldProps("activeCoordinatorId")}
        />
        <input type="submit" value="Submit" className="rounded border" />
      </form>
    </CrudLayout>
  );
}
