import MainLayout from "@/components/MainLayout";
import useContentSpecialistSuggestionItem from "@/hooks/useContentSpecialistSuggestionItem";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function ContentSpecialistSuggestionItemEditPage() {
  const router = useRouter();
  const contentSpecialistSuggestionItemId = router.query.id;
  const contentSpecialistSuggestionItem = useContentSpecialistSuggestionItem({
    id: contentSpecialistSuggestionItemId as string,
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
          `/api/content_specialist_suggestion_item/${contentSpecialistSuggestionItemId}`,
          values
        )
        .then(() => {
          alert("Suggestion updated successfully");
        });
    },
  });

  useEffect(() => {
    if (!contentSpecialistSuggestionItem) return;
    formik.setValues({
      pageNumber: contentSpecialistSuggestionItem.pageNumber,
      remarks: contentSpecialistSuggestionItem?.remarks ?? "",
      suggestion: contentSpecialistSuggestionItem.suggestion,
    });
  }, [contentSpecialistSuggestionItem]);

  return (
    <MainLayout>
      <div>
        <h2>Content Specialist Review</h2>
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
