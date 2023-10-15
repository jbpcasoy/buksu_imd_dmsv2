import CrudLayout from "@/components/CrudLayout";
import useContentEditorSuggestionItem from "@/hooks/useContentEditorSuggestionItem";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function EditContentEditorSuggestionItemPage() {
  const router = useRouter();
  const contentEditorSuggestionItemId = router.query.id;
  const contentEditorSuggestionItem = useContentEditorSuggestionItem({
    id: contentEditorSuggestionItemId as string,
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
      pageNumber: Yup.number().min(0).required()
    }),
    onSubmit: (values) => {
      axios
        .put(
          `/api/content_editor_suggestion_item/${contentEditorSuggestionItemId}`,
          values
        )
        .then(() => {
          alert("ContentEditorSuggestionItem Updated Successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });

  useEffect(() => {
    if (!contentEditorSuggestionItem) return;
    let subscribe = true;

    formik.setValues({
      pageNumber: contentEditorSuggestionItem.pageNumber,
      suggestion: contentEditorSuggestionItem.suggestion,
      actionTaken: contentEditorSuggestionItem?.actionTaken ?? "",
      remarks: contentEditorSuggestionItem?.remarks ?? "",
    });

    return () => {
      subscribe = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentEditorSuggestionItem]);

  return (
    <CrudLayout>
      <h2>Add ContentEditorSuggestionItem</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='suggestion'
          {...formik.getFieldProps("suggestion")}
        />
        <input
          type='text'
          placeholder='pageNumber'
          {...formik.getFieldProps("pageNumber")}
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
