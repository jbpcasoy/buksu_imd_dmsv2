import MainLayout from "@/components/MainLayout";
import useChairpersonSuggestionItem from "@/hooks/useChairpersonSuggestionItem";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function ChairpersonSuggestionItemEditPage() {
  const router = useRouter();
  const chairpersonSuggestionItemId = router.query.id;
  const chairpersonSuggestionItem = useChairpersonSuggestionItem({
    id: chairpersonSuggestionItemId as string,
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
          `/api/chairperson_suggestion_item/${chairpersonSuggestionItemId}`,
          values
        )
        .then(() => {
          alert("Suggestion updated successfully");
          router.reload();
        });
    },
  });

  useEffect(() => {
    if (!chairpersonSuggestionItem) return;
    formik.setValues({
      actionTaken: chairpersonSuggestionItem.actionTaken ?? "",
    });
  }, [chairpersonSuggestionItem]);

  return (
    <MainLayout>
      <div>
        <h2>Chairperson Review</h2>
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
