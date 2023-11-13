import CrudLayout from "@/components/CrudLayout";
import useReturnedDepartmentRevisionSuggestionItemActionTaken from "@/hooks/useReturnedDepartmentRevisionSuggestionItemActionTaken";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function EditReturnedDepartmentRevisionSuggestionItemActionTakenPage() {
  const router = useRouter();
  const returnedDepartmentRevisionSuggestionItemActionTakenId = router.query.id;
  const returnedDepartmentRevisionSuggestionItemActionTaken =
    useReturnedDepartmentRevisionSuggestionItemActionTaken({
      id: returnedDepartmentRevisionSuggestionItemActionTakenId as string,
    });

  const formik = useFormik({
    initialValues: {
      value: "",
    },
    validationSchema: Yup.object({
      value: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .put(
          `/api/returned_department_revision_suggestion_item_action_taken/${returnedDepartmentRevisionSuggestionItemActionTakenId}`,
          values
        )
        .then(() => {
          alert(
            "ReturnedDepartmentRevisionSuggestionItemActionTaken updated successfully"
          );
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });

  useEffect(() => {
    if (!returnedDepartmentRevisionSuggestionItemActionTaken) return;
    let subscribe = true;

    formik.setValues({
      value: returnedDepartmentRevisionSuggestionItemActionTaken.value,
    });

    return () => {
      subscribe = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returnedDepartmentRevisionSuggestionItemActionTaken]);

  return (
    <CrudLayout>
      <h2>Edit ReturnedDepartmentRevisionSuggestionItemActionTaken</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='value'
          {...formik.getFieldProps("value")}
        />
        <input type='submit' value='Submit' className='rounded border' />
      </form>
    </CrudLayout>
  );
}
