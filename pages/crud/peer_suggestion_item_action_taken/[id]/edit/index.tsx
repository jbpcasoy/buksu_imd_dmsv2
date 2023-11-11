import CrudLayout from "@/components/CrudLayout";
import usePeerSuggestionItemActionTaken from "@/hooks/usePeerSuggestionItemActionTaken";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function EditPeerSuggestionItemActionTakenPage() {
  const router = useRouter();
  const PeerSuggestionItemActionTakenId = router.query.id;
  const PeerSuggestionItemActionTaken = usePeerSuggestionItemActionTaken({
    id: PeerSuggestionItemActionTakenId as string,
  });

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
        .put(
          `/api/peer_suggestion_item_action_taken/${PeerSuggestionItemActionTakenId}`,
          values
        )
        .then(() => {
          alert("PeerSuggestionItemActionTaken updated successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });

  useEffect(() => {
    if (!PeerSuggestionItemActionTaken) return;
    let subscribe = true;

    formik.setValues({
      value: PeerSuggestionItemActionTaken.value,
      peerSuggestionItemId: PeerSuggestionItemActionTaken.peerSuggestionItemId,
    });

    return () => {
      subscribe = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [PeerSuggestionItemActionTaken]);

  return (
    <CrudLayout>
      <h2>Edit PeerSuggestionItemActionTaken</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='peerSuggestionItemId'
          {...formik.getFieldProps("peerSuggestionItemId")}
        />
        <input
          type='text'
          placeholder='value'
          {...formik.getFieldProps("value")}
        />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}
