import MainLayout from "@/components/MainLayout";
import useQAMISSuggestionItem from "@/hooks/useQAMISSuggestionItem";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function QAMISSuggestionItemEditPage() {
  const router = useRouter();
  const qAMISSuggestionItemId = router.query.id;
  const qAMISSuggestionItem = useQAMISSuggestionItem({
    id: qAMISSuggestionItemId as string,
  });
  const formik = useFormik({
    initialValues: {
      suggestion: "",
      actionTaken: "",
      pageNumber: 0,
      remarks: "",
    },
    validationSchema: Yup.object({
      suggestion: Yup.string().required(),
      actionTaken: Yup.string().required(),
      pageNumber: Yup.number().min(0).required(),
      remarks: Yup.string(),
    }),
    onSubmit: (values) => {
      axios
        .put(
          `/api/qamis_suggestion_item/${qAMISSuggestionItemId}`,
          values
        )
        .then(() => {
          alert("Suggestion updated successfully");
        });
    },
  });

  useEffect(() => {
    if (!qAMISSuggestionItem) return;
    formik.setValues({
      pageNumber: qAMISSuggestionItem.pageNumber,
      actionTaken: qAMISSuggestionItem.actionTaken ?? "",
      remarks: qAMISSuggestionItem?.remarks ?? "",
      suggestion: qAMISSuggestionItem.suggestion,
    });
  }, [qAMISSuggestionItem]);

  return (
    <MainLayout>
      <div>
        <h2>Coordinator Review</h2>
        <form noValidate onSubmit={formik.handleSubmit}>
          <textarea
            placeholder='suggestion'
            {...formik.getFieldProps("suggestion")}
          />
          <br />
          <textarea
            placeholder='actionTaken'
            {...formik.getFieldProps("actionTaken")}
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
