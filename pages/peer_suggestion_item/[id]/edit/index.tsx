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
      suggestion: "",
      pageNumber: 0,
      remarks: "",
    },
    validationSchema: Yup.object({
      suggestion: Yup.string().required(),
      pageNumber: Yup.number().min(0).required(),
      remarks: Yup.string(),
    }),
    onSubmit: (values) => {
      axios
        .put(`/api/peer_suggestion_item/${peerSuggestionItemId}`, values)
        .then(() => {
          alert("Suggestion updated successfully");
          router.reload();
        });
    },
  });

  useEffect(() => {
    if (!peerSuggestionItem) return;
    formik.setValues({
      pageNumber: peerSuggestionItem.pageNumber,
      remarks: peerSuggestionItem?.remarks ?? "",
      suggestion: peerSuggestionItem.suggestion,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peerSuggestionItem]);

  return (
    <MainLayout>
      <div>
        <h2>Peer Review</h2>
        <form noValidate onSubmit={formik.handleSubmit}>
          <textarea
            placeholder='suggestion'
            {...formik.getFieldProps("suggestion")}
          />
          <br />
          <input
            type='number'
            placeholder='pageNumber'
            {...formik.getFieldProps("pageNumber")}
          />
          <br />
          <textarea
            placeholder='remarks'
            {...formik.getFieldProps("remarks")}
          />
          <br />
          <input type='submit' value='Submit' className='border rounded' />
        </form>
      </div>
    </MainLayout>
  );
}
