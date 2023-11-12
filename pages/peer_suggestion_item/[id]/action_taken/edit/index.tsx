import MainLayout from "@/components/MainLayout";
import usePeerSuggestionItemActionTakenPeerSuggestionItem from "@/hooks/usePeerSuggestionItemActionTakenPeerSuggestionItem";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function PeerSuggestionItemEditPage() {
  const router = useRouter();
  const peerSuggestionItemId = router.query.id;
  const peerSuggestionItemActionTaken =
    usePeerSuggestionItemActionTakenPeerSuggestionItem({
      id: peerSuggestionItemId as string,
    });
  const formik = useFormik({
    initialValues: {
      value: "",
    },
    validationSchema: Yup.object({
      value: Yup.string().required(),
    }),
    onSubmit: (values) => {
      if (peerSuggestionItemActionTaken) {
        axios
          .put(
            `/api/peer_suggestion_item_action_taken/${peerSuggestionItemActionTaken.id}`,
            values
          )
          .then(() => {
            alert("Suggestion updated successfully");
            router.reload();
          });
      } else {
        axios
          .post(`/api/peer_suggestion_item_action_taken`, {
            peerSuggestionItemId: peerSuggestionItemId,
            value: values.value,
          })
          .then(() => {
            alert("Suggestion updated successfully");
            router.reload();
          });
      }
    },
  });

  useEffect(() => {
    if (!peerSuggestionItemActionTaken) return;
    formik.setValues({
      value: peerSuggestionItemActionTaken.value ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peerSuggestionItemActionTaken]);

  return (
    <MainLayout>
      <div>
        <h2>Peer Review</h2>
        <form noValidate onSubmit={formik.handleSubmit}>
          <textarea placeholder='value' {...formik.getFieldProps("value")} />
          <br />
          <input type='submit' value='Submit' className='border rounded' />
        </form>
      </div>
    </MainLayout>
  );
}
