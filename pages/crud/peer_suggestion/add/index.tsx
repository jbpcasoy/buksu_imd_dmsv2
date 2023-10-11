import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddPeerSuggestionPage() {
  const formik = useFormik({
    initialValues: {
      peerReviewId: "",
    },
    validationSchema: Yup.object({
        peerReviewId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/peer_suggestion", values)
        .then(() => {
          alert("PeerSuggestion Added Successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add PeerSuggestion</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='peerReviewId'
          {...formik.getFieldProps("peerReviewId")}
        />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}
