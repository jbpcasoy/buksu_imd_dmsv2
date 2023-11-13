import MainLayout from "@/components/MainLayout";
import useReturnedCITLRevisionSuggestionItemActionTakenReturnedCITLRevisionSuggestionItem from "@/hooks/useReturnedCITLRevisionSuggestionItemActionTakenReturnedCITLRevisionSuggestionItem";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function ReturnedCITLRevisionSuggestionItemEditPage() {
  const router = useRouter();
  const returnedCITLRevisionSuggestionItemId = router.query.id;
  const returnedCITLRevisionSuggestionItemActionTaken =
    useReturnedCITLRevisionSuggestionItemActionTakenReturnedCITLRevisionSuggestionItem({
      id: returnedCITLRevisionSuggestionItemId as string,
    });
  const formik = useFormik({
    initialValues: {
      value: "",
    },
    validationSchema: Yup.object({
      value: Yup.string().required(),
    }),
    onSubmit: (values) => {
      if (returnedCITLRevisionSuggestionItemActionTaken) {
        axios
          .put(
            `/api/returned_citl_revision_suggestion_item_action_taken/${returnedCITLRevisionSuggestionItemActionTaken.id}`,
            values
          )
          .then(() => {
            alert("Suggestion updated successfully");
            router.reload();
          });
      } else {
        axios
          .post(`/api/returned_citl_revision_suggestion_item_action_taken`, {
            returnedCITLRevisionSuggestionItemId: returnedCITLRevisionSuggestionItemId,
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
    if (!returnedCITLRevisionSuggestionItemActionTaken) return;
    formik.setValues({
      value: returnedCITLRevisionSuggestionItemActionTaken.value ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returnedCITLRevisionSuggestionItemActionTaken]);

  return (
    <MainLayout>
      <div>
        <h2>ReturnedCITLRevision Review</h2>
        <form noValidate onSubmit={formik.handleSubmit}>
          <textarea placeholder='value' {...formik.getFieldProps("value")} />
          <br />
          <input type='submit' value='Submit' className='border rounded' />
        </form>
      </div>
    </MainLayout>
  );
}
