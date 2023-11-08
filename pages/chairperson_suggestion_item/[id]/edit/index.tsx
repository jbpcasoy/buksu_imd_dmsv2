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
      pageNumber: chairpersonSuggestionItem.pageNumber,
      remarks: chairpersonSuggestionItem?.remarks ?? "",
      suggestion: chairpersonSuggestionItem.suggestion,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chairpersonSuggestionItem]);

  return (
    <MainLayout>
      <div>
        <h2>Chairperson Review</h2>
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
