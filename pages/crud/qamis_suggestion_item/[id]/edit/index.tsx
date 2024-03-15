import CrudLayout from "@/components/CrudLayout";
import useQAMISSuggestionItem from "@/hooks/useQAMISSuggestionItem";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function EditQAMISSuggestionItemPage() {
  const router = useRouter();
  const qAMISSuggestionItemId = router.query.id;
  const qAMISSuggestionItem = useQAMISSuggestionItem({
    id: qAMISSuggestionItemId as string,
  });

  const formik = useFormik({
    initialValues: {
      suggestion: "",
      actionTaken: "",
      remarks: "",
      pageNumber: 0,
    },
    validationSchema: Yup.object({
      suggestion: Yup.string().required(),
      actionTaken: Yup.string(),
      remarks: Yup.string(),
      pageNumber: Yup.number().min(0).required(),
    }),
    onSubmit: (values) => {
      axios
        .put(`/api/qamis_suggestion_item/${qAMISSuggestionItemId}`, values)
        .then(() => {
          alert("QAMISSuggestionItem has been updated successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });

  useEffect(() => {
    if (!qAMISSuggestionItem) return;
    let subscribe = true;

    formik.setValues({
      pageNumber: qAMISSuggestionItem.pageNumber,
      suggestion: qAMISSuggestionItem.suggestion,
      actionTaken: qAMISSuggestionItem?.actionTaken ?? "",
      remarks: qAMISSuggestionItem?.remarks ?? "",
    });

    return () => {
      subscribe = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qAMISSuggestionItem]);

  return (
    <CrudLayout>
      <h2>Add QAMISSuggestionItem</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          placeholder="suggestion"
          {...formik.getFieldProps("suggestion")}
        />
        <input
          type="text"
          placeholder="pageNumber"
          {...formik.getFieldProps("pageNumber")}
        />
        <input
          type="text"
          placeholder="actionTaken"
          {...formik.getFieldProps("actionTaken")}
        />
        <input
          type="text"
          placeholder="remarks"
          {...formik.getFieldProps("remarks")}
        />
        <input type="submit" value="Submit" className="rounded border" />
      </form>
    </CrudLayout>
  );
}
