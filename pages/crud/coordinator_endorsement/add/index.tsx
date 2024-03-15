import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddCoordinatorEndorsementPage() {
  const formik = useFormik({
    initialValues: {
      departmentRevisionId: "",
      activeCoordinatorId: "",
    },
    validationSchema: Yup.object({
      departmentRevisionId: Yup.string().required(),
      activeCoordinatorId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/coordinator_endorsement", values)
        .then(() => {
          alert("CoordinatorEndorsement has been added successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add CoordinatorEndorsement</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          placeholder="departmentRevisionId"
          {...formik.getFieldProps("departmentRevisionId")}
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
