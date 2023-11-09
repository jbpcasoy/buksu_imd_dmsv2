import MainLayout from "@/components/MainLayout";
import useReturnedDepartmentRevisionSuggestionItem from "@/hooks/useReturnedDepartmentRevisionSuggestionItem";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function ReturnedDepartmentRevisionSuggestionItemEditPage() {
  const router = useRouter();
  const returnedDepartmentRevisionSuggestionItemId = router.query.id;
  const returnedDepartmentRevisionSuggestionItem = useReturnedDepartmentRevisionSuggestionItem({
    id: returnedDepartmentRevisionSuggestionItemId as string,
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
          `/api/returned_department_revision_suggestion_item/${returnedDepartmentRevisionSuggestionItemId}`,
          values
        )
        .then(() => {
          alert("Suggestion updated successfully");
          router.reload();
        });
    },
  });

  useEffect(() => {
    if (!returnedDepartmentRevisionSuggestionItem) return;
    formik.setValues({
      pageNumber: returnedDepartmentRevisionSuggestionItem.pageNumber,
      remarks: returnedDepartmentRevisionSuggestionItem?.remarks ?? "",
      suggestion: returnedDepartmentRevisionSuggestionItem.suggestion,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returnedDepartmentRevisionSuggestionItem]);

  return (
    <MainLayout>
      <div>
        <h2>Return Department Revision</h2>
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
