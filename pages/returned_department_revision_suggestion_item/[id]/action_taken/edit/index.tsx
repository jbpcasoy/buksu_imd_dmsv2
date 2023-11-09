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
      actionTaken: "",
    },
    validationSchema: Yup.object({
      actionTaken: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .put(
          `/api/returned_department_revision_suggestion_item/${returnedDepartmentRevisionSuggestionItemId}`,
          values
        )
        .then(() => {
          alert("Suggestion updated successfully");
        });
    },
  });

  useEffect(() => {
    if (!returnedDepartmentRevisionSuggestionItem) return;
    formik.setValues({
      actionTaken: returnedDepartmentRevisionSuggestionItem.actionTaken ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returnedDepartmentRevisionSuggestionItem]);

  return (
    <MainLayout>
      <div>
        <h2>Returned Department Revision Suggestion</h2>
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
