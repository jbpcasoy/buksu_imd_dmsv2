import MainLayout from "@/components/MainLayout";
import useContentEditorSuggestionItemActionTakenContentEditorSuggestionItem from "@/hooks/useContentEditorSuggestionItemActionTakenContentEditorSuggestionItem";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function ContentEditorSuggestionItemEditPage() {
  const router = useRouter();
  const contentEditorSuggestionItemId = router.query.id;
  const contentEditorSuggestionItemActionTaken =
    useContentEditorSuggestionItemActionTakenContentEditorSuggestionItem({
      id: contentEditorSuggestionItemId as string,
    });
  const formik = useFormik({
    initialValues: {
      value: "",
    },
    validationSchema: Yup.object({
      value: Yup.string().required(),
    }),
    onSubmit: (values) => {
      if (contentEditorSuggestionItemActionTaken) {
        axios
          .put(
            `/api/content_editor_suggestion_item_action_taken/${contentEditorSuggestionItemActionTaken.id}`,
            values
          )
          .then(() => {
            alert("Suggestion updated successfully");
            router.reload();
          });
      } else {
        axios
          .post(`/api/content_editor_suggestion_item_action_taken`, {
            contentEditorSuggestionItemId: contentEditorSuggestionItemId,
            value: values.value,
          })
          .then(() => {
            alert("Suggestion updated successfully");
            router.reload();
          });
      }
    },
  });

  useEffect(() => {
    if (!contentEditorSuggestionItemActionTaken) return;
    formik.setValues({
      value: contentEditorSuggestionItemActionTaken.value ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentEditorSuggestionItemActionTaken]);

  return (
    <MainLayout>
      <div>
        <h2>ContentEditor Review</h2>
        <form noValidate onSubmit={formik.handleSubmit}>
          <textarea placeholder='value' {...formik.getFieldProps("value")} />
          <br />
          <input type='submit' value='Submit' className='border rounded' />
        </form>
      </div>
    </MainLayout>
  );
}
