import MainLayout from "@/components/MainLayout";
import useContentSpecialistSuggestionItemActionTakenContentSpecialistSuggestionItem from "@/hooks/useContentSpecialistSuggestionItemActionTakenContentSpecialistSuggestionItem";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function ContentSpecialistSuggestionItemEditPage() {
  const router = useRouter();
  const contentSpecialistSuggestionItemId = router.query.id;
  const contentSpecialistSuggestionItemActionTaken =
    useContentSpecialistSuggestionItemActionTakenContentSpecialistSuggestionItem({
      id: contentSpecialistSuggestionItemId as string,
    });
  const formik = useFormik({
    initialValues: {
      value: "",
    },
    validationSchema: Yup.object({
      value: Yup.string().required(),
    }),
    onSubmit: (values) => {
      if (contentSpecialistSuggestionItemActionTaken) {
        axios
          .put(
            `/api/content_specialist_suggestion_item_action_taken/${contentSpecialistSuggestionItemActionTaken.id}`,
            values
          )
          .then(() => {
            alert("Suggestion updated successfully");
            router.reload();
          });
      } else {
        axios
          .post(`/api/content_specialist_suggestion_item_action_taken`, {
            contentSpecialistSuggestionItemId: contentSpecialistSuggestionItemId,
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
    if (!contentSpecialistSuggestionItemActionTaken) return;
    formik.setValues({
      value: contentSpecialistSuggestionItemActionTaken.value ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentSpecialistSuggestionItemActionTaken]);

  return (
    <MainLayout>
      <div>
        <h2>ContentSpecialist Review</h2>
        <form noValidate onSubmit={formik.handleSubmit}>
          <textarea placeholder='value' {...formik.getFieldProps("value")} />
          <br />
          <input type='submit' value='Submit' className='border rounded' />
        </form>
      </div>
    </MainLayout>
  );
}
