import CrudLayout from "@/components/CrudLayout";
import usePeerSuggestionItem from "@/hooks/usePeerSuggestionItem";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function EditPeerSuggestionItemPage() {
  const router = useRouter();
  const peerSuggestionItemId = router.query.id;
  const peerSuggestionItem = usePeerSuggestionItem({
    id: peerSuggestionItemId as string,
  });

  const formik = useFormik({
    initialValues: {
      suggestion: "",
      actionTaken: "",
      remarks: "",
    },
    validationSchema: Yup.object({
      suggestion: Yup.string().required(),
      actionTaken: Yup.string(),
      remarks: Yup.string(),
    }),
    onSubmit: (values) => {
      axios
        .put(`/api/peer_suggestion_item/${peerSuggestionItemId}`, values)
        .then(() => {
          alert("PeerSuggestionItem Updated Successfully");
        })
        .catch((error) => {
          alert(error.message);
        });
    },
  });

  useEffect(() => {
    if (!peerSuggestionItem) return;
    let subscribe = true;

    formik.setValues({
      suggestion: peerSuggestionItem.suggestion,
      actionTaken: peerSuggestionItem?.actionTaken ?? "",
      remarks: peerSuggestionItem?.remarks ?? "",
    });

    return () => {
      subscribe = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peerSuggestionItem]);

  return (
    <CrudLayout>
      <h2>Add PeerSuggestionItem</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='suggestion'
          {...formik.getFieldProps("suggestion")}
        />
        <input
          type='text'
          placeholder='actionTaken'
          {...formik.getFieldProps("actionTaken")}
        />
        <input
          type='text'
          placeholder='remarks'
          {...formik.getFieldProps("remarks")}
        />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}
