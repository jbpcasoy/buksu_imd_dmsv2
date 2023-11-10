import MainLayout from "@/components/MainLayout";
import useReturnedIMERCCITLRevisionSuggestionItem from "@/hooks/useReturnedIMERCCITLRevisionSuggestionItem";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function ReturnedIMERCCITLRevisionSuggestionItemEditPage() {
  const router = useRouter();
  const returnedIMERCCITLRevisionSuggestionItemId = router.query.id;
  const returnedIMERCCITLRevisionSuggestionItem = useReturnedIMERCCITLRevisionSuggestionItem({
    id: returnedIMERCCITLRevisionSuggestionItemId as string,
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
          `/api/returned_imerc_citl_revision_suggestion_item/${returnedIMERCCITLRevisionSuggestionItemId}`,
          values
        )
        .then(() => {
          alert("Suggestion updated successfully");
          router.reload();
        });
    },
  });

  useEffect(() => {
    if (!returnedIMERCCITLRevisionSuggestionItem) return;
    formik.setValues({
      pageNumber: returnedIMERCCITLRevisionSuggestionItem.pageNumber,
      remarks: returnedIMERCCITLRevisionSuggestionItem?.remarks ?? "",
      suggestion: returnedIMERCCITLRevisionSuggestionItem.suggestion,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returnedIMERCCITLRevisionSuggestionItem]);

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
