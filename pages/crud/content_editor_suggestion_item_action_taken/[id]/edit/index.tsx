import CrudLayout from "@/components/CrudLayout";
import useContentEditorSuggestionItemActionTaken from "@/hooks/useContentEditorSuggestionItemActionTaken";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function EditContentEditorSuggestionItemActionTakenPage() {
  const router = useRouter();
  const contentEditorSuggestionItemActionTakenId = router.query.id;
  const contentEditorSuggestionItemActionTaken = useContentEditorSuggestionItemActionTaken({
    id: contentEditorSuggestionItemActionTakenId as string,
  });

  const formik = useFormik({
    initialValues: {
      value: "",
      contentEditorSuggestionItemId: "",
    },
    validationSchema: Yup.object({
      value: Yup.string().required(),
      contentEditorSuggestionItemId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .put(
          `/api/content_editor_suggestion_item_action_taken/${contentEditorSuggestionItemActionTakenId}`,
          values
        )
        .then(() => {
          alert("ContentEditorSuggestionItemActionTaken has been updated successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });

  useEffect(() => {
    if (!contentEditorSuggestionItemActionTaken) return;
    let subscribe = true;

    formik.setValues({
      value: contentEditorSuggestionItemActionTaken.value,
      contentEditorSuggestionItemId: contentEditorSuggestionItemActionTaken.contentEditorSuggestionItemId,
    });

    return () => {
      subscribe = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentEditorSuggestionItemActionTaken]);

  return (
    <CrudLayout>
      <h2>Edit ContentEditorSuggestionItemActionTaken</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='contentEditorSuggestionItemId'
          {...formik.getFieldProps("contentEditorSuggestionItemId")}
        />
        <input
          type='text'
          placeholder='value'
          {...formik.getFieldProps("value")}
        />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}
