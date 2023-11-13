import CrudLayout from "@/components/CrudLayout";
import useReturnedCITLRevisionSuggestionItemActionTaken from "@/hooks/useReturnedCITLRevisionSuggestionItemActionTaken";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function EditReturnedCITLRevisionSuggestionItemActionTakenPage() {
  const router = useRouter();
  const returnedCITLRevisionSuggestionItemActionTakenId = router.query.id;
  const returnedCITLRevisionSuggestionItemActionTaken = useReturnedCITLRevisionSuggestionItemActionTaken({
    id: returnedCITLRevisionSuggestionItemActionTakenId as string,
  });

  const formik = useFormik({
    initialValues: {
      value: "",
      returnedCITLRevisionSuggestionItemId: "",
    },
    validationSchema: Yup.object({
      value: Yup.string().required(),
      returnedCITLRevisionSuggestionItemId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .put(
          `/api/returned_citl_revision_suggestion_item_action_taken/${returnedCITLRevisionSuggestionItemActionTakenId}`,
          values
        )
        .then(() => {
          alert("ReturnedCITLRevisionSuggestionItemActionTaken updated successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });

  useEffect(() => {
    if (!returnedCITLRevisionSuggestionItemActionTaken) return;
    let subscribe = true;

    formik.setValues({
      value: returnedCITLRevisionSuggestionItemActionTaken.value,
      returnedCITLRevisionSuggestionItemId: returnedCITLRevisionSuggestionItemActionTaken.returnedCITLRevisionSuggestionItemId,
    });

    return () => {
      subscribe = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returnedCITLRevisionSuggestionItemActionTaken]);

  return (
    <CrudLayout>
      <h2>Edit ReturnedCITLRevisionSuggestionItemActionTaken</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='returnedCITLRevisionSuggestionItemId'
          {...formik.getFieldProps("returnedCITLRevisionSuggestionItemId")}
        />
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
