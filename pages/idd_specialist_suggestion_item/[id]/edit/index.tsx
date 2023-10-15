import MainLayout from "@/components/MainLayout";
import useIDDSpecialistSuggestionItem from "@/hooks/useIDDSpecialistSuggestionItem";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function IDDSpecialistSuggestionItemEditPage() {
  const router = useRouter();
  const iDDSpecialistSuggestionItemId = router.query.id;
  const iDDSpecialistSuggestionItem = useIDDSpecialistSuggestionItem({
    id: iDDSpecialistSuggestionItemId as string,
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
          `/api/idd_specialist_suggestion_item/${iDDSpecialistSuggestionItemId}`,
          values
        )
        .then(() => {
          alert("Suggestion updated successfully");
        });
    },
  });

  useEffect(() => {
    if (!iDDSpecialistSuggestionItem) return;
    formik.setValues({
      pageNumber: iDDSpecialistSuggestionItem.pageNumber,
      remarks: iDDSpecialistSuggestionItem?.remarks ?? "",
      suggestion: iDDSpecialistSuggestionItem.suggestion,
    });
  }, [iDDSpecialistSuggestionItem]);

  return (
    <MainLayout>
      <div>
        <h2>IDD Specialist Review</h2>
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
