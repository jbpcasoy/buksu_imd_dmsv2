import CrudLayout from "@/components/CrudLayout";
import useReturnedCITLRevisionSuggestionItem from "@/hooks/useReturnedCITLRevisionSuggestionItem";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function EditReturnedCITLRevisionSuggestionItemPage() {
  const router = useRouter();
  const returnedCITLRevisionSuggestionItemId = router.query.id;
  const returnedCITLRevisionSuggestionItem = useReturnedCITLRevisionSuggestionItem({
    id: returnedCITLRevisionSuggestionItemId as string,
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
          `/api/returned_citl_revision_suggestion_item/${returnedCITLRevisionSuggestionItemId}`,
          values
        )
        .then(() => {
          alert("ReturnedCITLRevisionSuggestionItem Updated Successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });

  useEffect(() => {
    if (!returnedCITLRevisionSuggestionItem) return;
    let subscribe = true;

    formik.setValues({
      pageNumber: returnedCITLRevisionSuggestionItem.pageNumber,
      suggestion: returnedCITLRevisionSuggestionItem.suggestion,
      actionTaken: returnedCITLRevisionSuggestionItem?.actionTaken ?? "",
      remarks: returnedCITLRevisionSuggestionItem?.remarks ?? "",
    });

    return () => {
      subscribe = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returnedCITLRevisionSuggestionItem]);

  return (
    <CrudLayout>
      <h2>Add ReturnedCITLRevisionSuggestionItem</h2>

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
