import CrudLayout from "@/components/CrudLayout";
import useChairpersonSuggestionItem from "@/hooks/useChairpersonSuggestionItem";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function EditChairpersonSuggestionItemPage() {
  const router = useRouter();
  const chairpersonSuggestionItemId = router.query.id;
  const chairpersonSuggestionItem = useChairpersonSuggestionItem({
    id: chairpersonSuggestionItemId as string,
  });

  const formik = useFormik({
    initialValues: {
      suggestion: "",
      actionTaken: "",
      remarks: "",
    },
    validationSchema: Yup.object({
      suggestion: Yup.string().required(),
      actionTaken: Yup.string(),
      remarks: Yup.string(),
    }),
    onSubmit: (values) => {
      axios
        .put(
          `/api/chairperson_suggestion_item/${chairpersonSuggestionItemId}`,
          values
        )
        .then(() => {
          alert("ChairpersonSuggestionItem Updated Successfully");
        })
        .catch((error) => {
          alert(error.message);
        });
    },
  });

  useEffect(() => {
    if (!chairpersonSuggestionItem) return;
    let subscribe = true;

    formik.setValues({
      suggestion: chairpersonSuggestionItem.suggestion,
      actionTaken: chairpersonSuggestionItem?.actionTaken ?? "",
      remarks: chairpersonSuggestionItem?.remarks ?? "",
    });

    return () => {
      subscribe = false;
    };
  }, [chairpersonSuggestionItem]);

  return (
    <CrudLayout>
      <h2>Add ChairpersonSuggestionItem</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='suggestion'
          {...formik.getFieldProps("suggestion")}
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