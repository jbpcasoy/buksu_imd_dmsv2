import CrudLayout from "@/components/CrudLayout";
import useReturnedDepartmentRevisionSuggestionItem from "@/hooks/useReturnedDepartmentRevisionSuggestionItem";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function EditReturnedDepartmentRevisionSuggestionItemPage() {
  const router = useRouter();
  const returnedDepartmentRevisionSuggestionItemId = router.query.id;
  const returnedDepartmentRevisionSuggestionItem = useReturnedDepartmentRevisionSuggestionItem({
    id: returnedDepartmentRevisionSuggestionItemId as string,
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
          `/api/returned_department_revision_suggestion_item/${returnedDepartmentRevisionSuggestionItemId}`,
          values
        )
        .then(() => {
          alert("ReturnedDepartmentRevisionSuggestionItem Updated Successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });

  useEffect(() => {
    if (!returnedDepartmentRevisionSuggestionItem) return;
    let subscribe = true;

    formik.setValues({
      pageNumber: returnedDepartmentRevisionSuggestionItem.pageNumber,
      suggestion: returnedDepartmentRevisionSuggestionItem.suggestion,
      actionTaken: returnedDepartmentRevisionSuggestionItem?.actionTaken ?? "",
      remarks: returnedDepartmentRevisionSuggestionItem?.remarks ?? "",
    });

    return () => {
      subscribe = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returnedDepartmentRevisionSuggestionItem]);

  return (
    <CrudLayout>
      <h2>Add ReturnedDepartmentRevisionSuggestionItem</h2>

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
