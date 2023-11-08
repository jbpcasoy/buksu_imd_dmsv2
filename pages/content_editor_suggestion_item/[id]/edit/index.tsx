import MainLayout from "@/components/MainLayout";
import useContentEditorSuggestionItem from "@/hooks/useContentEditorSuggestionItem";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function ContentEditorSuggestionItemEditPage() {
  const router = useRouter();
  const contentEditorSuggestionItemId = router.query.id;
  const contentEditorSuggestionItem = useContentEditorSuggestionItem({
    id: contentEditorSuggestionItemId as string,
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
          `/api/content_editor_suggestion_item/${contentEditorSuggestionItemId}`,
          values
        )
        .then(() => {
          alert("Suggestion updated successfully");
          router.reload();
        });
    },
  });

  useEffect(() => {
    if (!contentEditorSuggestionItem) return;
    formik.setValues({
      pageNumber: contentEditorSuggestionItem.pageNumber,
      remarks: contentEditorSuggestionItem?.remarks ?? "",
      suggestion: contentEditorSuggestionItem.suggestion,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentEditorSuggestionItem]);

  return (
    <MainLayout>
      <div>
        <h2>Content Editor Review</h2>
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
