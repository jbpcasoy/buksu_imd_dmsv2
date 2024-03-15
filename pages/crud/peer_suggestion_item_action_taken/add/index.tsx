import CrudLayout from "@/components/CrudLayout";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function AddPeerSuggestionItemActionTakenPage() {
  const formik = useFormik({
    initialValues: {
      value: "",
      peerSuggestionItemId: "",
    },
    validationSchema: Yup.object({
      value: Yup.string().required(),
      peerSuggestionItemId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .post("/api/peer_suggestion_item_action_taken", values)
        .then(() => {
          alert("PeerSuggestionItemActionTaken has been added successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });
  return (
    <CrudLayout>
      <h2>Add PeerSuggestionItemActionTaken</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          placeholder="peerSuggestionItemId"
          {...formik.getFieldProps("peerSuggestionItemId")}
        />
        <input
          type="text"
          placeholder="value"
          {...formik.getFieldProps("value")}
        />
        <input type="submit" value="Submit" className="rounded border" />
      </form>
    </CrudLayout>
  );
}
