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
      actionTaken: "",
    },
    validationSchema: Yup.object({
      actionTaken: Yup.string().required(),
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
      actionTaken: contentSpecialistSuggestionItem.actionTaken ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentSpecialistSuggestionItem]);

  return (
    <MainLayout>
      <div>
        <h2>Content Specialist Review</h2>
        <form noValidate onSubmit={formik.handleSubmit}>
          <textarea
            placeholder='actionTaken'
            {...formik.getFieldProps("actionTaken")}
          />
          <br />
          <input type='submit' value='Submit' className='border rounded' />
        </form>
      </div>
    </MainLayout>
  );
}
