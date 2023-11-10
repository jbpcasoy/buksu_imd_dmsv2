import MainLayout from "@/components/MainLayout";
import useReturnedIMERCCITLRevisionSuggestionItem from "@/hooks/useReturnedIMERCCITLRevisionSuggestionItem";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function ReturnedIMERCCITLRevisionSuggestionItemEditPage() {
  const router = useRouter();
  const returnedIMERCCITLRevisionSuggestionItemId = router.query.id;
  const returnedIMERCCITLRevisionSuggestionItem = useReturnedIMERCCITLRevisionSuggestionItem({
    id: returnedIMERCCITLRevisionSuggestionItemId as string,
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
          `/api/returned_imerc_citl_revision_suggestion_item/${returnedIMERCCITLRevisionSuggestionItemId}`,
          values
        )
        .then(() => {
          alert("Suggestion updated successfully");
        });
    },
  });

  useEffect(() => {
    if (!returnedIMERCCITLRevisionSuggestionItem) return;
    formik.setValues({
      actionTaken: returnedIMERCCITLRevisionSuggestionItem.actionTaken ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returnedIMERCCITLRevisionSuggestionItem]);

  return (
    <MainLayout>
      <div>
        <h2>Returned CITL Revision Suggestion</h2>
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
