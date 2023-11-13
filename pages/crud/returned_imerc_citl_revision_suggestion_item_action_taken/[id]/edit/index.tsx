import CrudLayout from "@/components/CrudLayout";
import useReturnedIMERCCITLRevisionSuggestionItemActionTaken from "@/hooks/useReturnedIMERCCITLRevisionSuggestionItemActionTaken";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function EditReturnedIMERCCITLRevisionSuggestionItemActionTakenPage() {
  const router = useRouter();
  const returnedIMERCCITLRevisionSuggestionItemActionTakenId = router.query.id;
  const returnedIMERCCITLRevisionSuggestionItemActionTaken =
    useReturnedIMERCCITLRevisionSuggestionItemActionTaken({
      id: returnedIMERCCITLRevisionSuggestionItemActionTakenId as string,
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
          `/api/returned_imerc_citl_revision_suggestion_item_action_taken/${returnedIMERCCITLRevisionSuggestionItemActionTakenId}`,
          values
        )
        .then(() => {
          alert(
            "ReturnedIMERCCITLRevisionSuggestionItemActionTaken updated successfully"
          );
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });

  useEffect(() => {
    if (!returnedIMERCCITLRevisionSuggestionItemActionTaken) return;
    let subscribe = true;

    formik.setValues({
      value: returnedIMERCCITLRevisionSuggestionItemActionTaken.value,
    });

    return () => {
      subscribe = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returnedIMERCCITLRevisionSuggestionItemActionTaken]);

  return (
    <CrudLayout>
      <h2>Edit ReturnedIMERCCITLRevisionSuggestionItemActionTaken</h2>

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
