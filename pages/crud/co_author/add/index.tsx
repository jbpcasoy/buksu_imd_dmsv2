import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddCoAuthorPage() {
  const formik = useFormik({
    initialValues: {
      iMId: "",
      activeFacultyId: "",
    },
    validationSchema: Yup.object({
      iMId: Yup.string().required(),
      activeFacultyId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/co_author", values)
        .then(() => {
          alert("CoAuthor has been added successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add CoAuthor</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          placeholder="iMId"
          {...formik.getFieldProps("iMId")}
        />
        <input
          type="text"
          placeholder="activeFacultyId"
          {...formik.getFieldProps("activeFacultyId")}
        />
        <input type="submit" value="Submit" className="rounded border" />
      </form>
    </CrudLayout>
  );
}
