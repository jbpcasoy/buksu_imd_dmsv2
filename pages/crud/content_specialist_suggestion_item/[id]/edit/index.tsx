import CrudLayout from "@/components/CrudLayout";
import useContentSpecialistSuggestionItem from "@/hooks/useContentSpecialistSuggestionItem";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function EditContentSpecialistSuggestionItemPage() {
  const router = useRouter();
  const contentSpecialistSuggestionItemId = router.query.id;
  const contentSpecialistSuggestionItem = useContentSpecialistSuggestionItem({
    id: contentSpecialistSuggestionItemId as string,
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
          `/api/content_specialist_suggestion_item/${contentSpecialistSuggestionItemId}`,
          values
        )
        .then(() => {
          alert("ContentSpecialistSuggestionItem Updated Successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });

  useEffect(() => {
    if (!contentSpecialistSuggestionItem) return;
    let subscribe = true;

    formik.setValues({
      pageNumber: contentSpecialistSuggestionItem.pageNumber,
      suggestion: contentSpecialistSuggestionItem.suggestion,
      actionTaken: contentSpecialistSuggestionItem?.actionTaken ?? "",
      remarks: contentSpecialistSuggestionItem?.remarks ?? "",
    });

    return () => {
      subscribe = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentSpecialistSuggestionItem]);

  return (
    <CrudLayout>
      <h2>Add ContentSpecialistSuggestionItem</h2>

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
