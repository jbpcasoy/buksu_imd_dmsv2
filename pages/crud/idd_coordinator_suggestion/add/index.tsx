import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddIDDCoordinatorSuggestionPage() {
  const formik = useFormik({
    initialValues: {
      activeIDDCoordinatorId: "",
      deanEndorsementId: "",
    },
    validationSchema: Yup.object({
      activeIDDCoordinatorId: Yup.string().required(),
      deanEndorsementId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/idd_coordinator_suggestion", values)
        .then(() => {
          alert("IDDCoordinatorSuggestion has been added successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add IDDCoordinatorSuggestion</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          placeholder="activeIDDCoordinatorId"
          {...formik.getFieldProps("activeIDDCoordinatorId")}
        />
        <input
          type="text"
          placeholder="deanEndorsementId"
          {...formik.getFieldProps("deanEndorsementId")}
        />
        <input type="submit" value="Submit" className="rounded border" />
      </form>
    </CrudLayout>
  );
}
