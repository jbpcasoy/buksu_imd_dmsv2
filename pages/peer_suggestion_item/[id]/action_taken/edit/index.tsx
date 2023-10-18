import MainLayout from "@/components/MainLayout";
import usePeerSuggestionItem from "@/hooks/usePeerSuggestionItem";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function PeerSuggestionItemEditPage() {
  const router = useRouter();
  const peerSuggestionItemId = router.query.id;
  const peerSuggestionItem = usePeerSuggestionItem({
    id: peerSuggestionItemId as string,
  });
  const formik = useFormik({
    initialValues: {
      actionTaken: "",
    },
    validationSchema: Yup.object({
      actionTaken: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .put(
          `/api/peer_suggestion_item/${peerSuggestionItemId}`,
          values
        )
        .then(() => {
          alert("Suggestion updated successfully");
        });
    },
  });

  useEffect(() => {
    if (!peerSuggestionItem) return;
    formik.setValues({
      actionTaken: peerSuggestionItem.actionTaken ?? "",
    });
  }, [peerSuggestionItem]);

  return (
    <MainLayout>
      <div>
        <h2>Peer Review</h2>
        <form noValidate onSubmit={formik.handleSubmit}>
          <textarea
            placeholder='actionTaken'
            {...formik.getFieldProps("actionTaken")}
          />
          <br />
          <input type='submit' value='Submit' className='border rounded' />
        </form>
      </div>
    </MainLayout>
  );
}
