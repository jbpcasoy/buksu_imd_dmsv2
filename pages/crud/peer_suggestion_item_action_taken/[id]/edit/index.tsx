import CrudLayout from "@/components/CrudLayout";
import usePeerSuggestionItemActionTaken from "@/hooks/usePeerSuggestionItemActionTaken";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function EditPeerSuggestionItemActionTakenPage() {
  const router = useRouter();
  const peerSuggestionItemActionTakenId = router.query.id;
  const peerSuggestionItemActionTaken = usePeerSuggestionItemActionTaken({
    id: peerSuggestionItemActionTakenId as string,
  });

  const formik = useFormik({
    initialValues: {
      value: "",
    },
    validationSchema: Yup.object({
      value: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .put(
          `/api/peer_suggestion_item_action_taken/${peerSuggestionItemActionTakenId}`,
          values
        )
        .then(() => {
          alert("PeerSuggestionItemActionTaken has been updated successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });

  useEffect(() => {
    if (!peerSuggestionItemActionTaken) return;
    let subscribe = true;

    formik.setValues({
      value: peerSuggestionItemActionTaken.value,
    });

    return () => {
      subscribe = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peerSuggestionItemActionTaken]);

  return (
    <CrudLayout>
      <h2>Edit PeerSuggestionItemActionTaken</h2>

      <form onSubmit={formik.handleSubmit}>
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
