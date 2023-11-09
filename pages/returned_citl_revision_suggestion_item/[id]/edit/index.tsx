import MainLayout from "@/components/MainLayout";
import useReturnedCITLRevisionSuggestionItem from "@/hooks/useReturnedCITLRevisionSuggestionItem";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function ReturnedCITLRevisionSuggestionItemEditPage() {
  const router = useRouter();
  const returnedCITLRevisionSuggestionItemId = router.query.id;
  const returnedCITLRevisionSuggestionItem = useReturnedCITLRevisionSuggestionItem({
    id: returnedCITLRevisionSuggestionItemId as string,
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
        .put(
          `/api/returned_citl_revision_suggestion_item/${returnedCITLRevisionSuggestionItemId}`,
          values
        )
        .then(() => {
          alert("Suggestion updated successfully");
          router.reload();
        });
    },
  });

  useEffect(() => {
    if (!returnedCITLRevisionSuggestionItem) return;
    formik.setValues({
      pageNumber: returnedCITLRevisionSuggestionItem.pageNumber,
      remarks: returnedCITLRevisionSuggestionItem?.remarks ?? "",
      suggestion: returnedCITLRevisionSuggestionItem.suggestion,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returnedCITLRevisionSuggestionItem]);

  return (
    <MainLayout>
      <div>
        <h2>Return CITL Revision</h2>
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
