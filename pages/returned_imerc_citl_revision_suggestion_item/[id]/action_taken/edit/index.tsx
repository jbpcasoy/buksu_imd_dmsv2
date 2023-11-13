import MainLayout from "@/components/MainLayout";
import useReturnedIMERCCITLRevisionSuggestionItemActionTakenReturnedIMERCCITLRevisionSuggestionItem from "@/hooks/useReturnedIMERCCITLRevisionSuggestionItemActionTakenReturnedIMERCCITLRevisionSuggestionItem";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function ReturnedIMERCCITLRevisionSuggestionItemEditPage() {
  const router = useRouter();
  const returnedIMERCCITLRevisionSuggestionItemId = router.query.id;
  const returnedIMERCCITLRevisionSuggestionItemActionTaken =
    useReturnedIMERCCITLRevisionSuggestionItemActionTakenReturnedIMERCCITLRevisionSuggestionItem({
      id: returnedIMERCCITLRevisionSuggestionItemId as string,
    });
  const formik = useFormik({
    initialValues: {
      value: "",
    },
    validationSchema: Yup.object({
      value: Yup.string().required(),
    }),
    onSubmit: (values) => {
      if (returnedIMERCCITLRevisionSuggestionItemActionTaken) {
        axios
          .put(
            `/api/returned_imerc_citl_revision_suggestion_item_action_taken/${returnedIMERCCITLRevisionSuggestionItemActionTaken.id}`,
            values
          )
          .then(() => {
            alert("Suggestion updated successfully");
            router.reload();
          });
      } else {
        axios
          .post(`/api/returned_imerc_citl_revision_suggestion_item_action_taken`, {
            returnedIMERCCITLRevisionSuggestionItemId: returnedIMERCCITLRevisionSuggestionItemId,
            value: values.value,
          })
          .then(() => {
            alert("Suggestion updated successfully");
            router.reload();
          });
      }
    },
  });

  useEffect(() => {
    if (!returnedIMERCCITLRevisionSuggestionItemActionTaken) return;
    formik.setValues({
      value: returnedIMERCCITLRevisionSuggestionItemActionTaken.value ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returnedIMERCCITLRevisionSuggestionItemActionTaken]);

  return (
    <MainLayout>
      <div>
        <h2>ReturnedIMERCCITLRevision Review</h2>
        <form noValidate onSubmit={formik.handleSubmit}>
          <textarea placeholder='value' {...formik.getFieldProps("value")} />
          <br />
          <input type='submit' value='Submit' className='border rounded' />
        </form>
      </div>
    </MainLayout>
  );
}
