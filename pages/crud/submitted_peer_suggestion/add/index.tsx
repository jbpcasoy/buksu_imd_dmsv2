import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddSubmittedPeerSuggestionPage() {
  const formik = useFormik({
    initialValues: {
      peerSuggestionId: "",
    },
    validationSchema: Yup.object({
      peerSuggestionId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/submitted_peer_suggestion", values)
        .then(() => {
          alert("SubmittedPeerSuggestion has been added successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add SubmittedPeerSuggestion</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='peerSuggestionId'
          {...formik.getFieldProps("peerSuggestionId")}
        />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}
