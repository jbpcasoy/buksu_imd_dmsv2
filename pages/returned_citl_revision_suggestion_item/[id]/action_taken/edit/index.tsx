import MainLayout from "@/components/MainLayout";
import useReturnedCITLRevisionSuggestionItem from "@/hooks/useReturnedCITLRevisionSuggestionItem";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function ReturnedCITLRevisionSuggestionItemEditPage() {
  const router = useRouter();
  const returnedCITLRevisionSuggestionItemId = router.query.id;
  const returnedCITLRevisionSuggestionItem = useReturnedCITLRevisionSuggestionItem({
    id: returnedCITLRevisionSuggestionItemId as string,
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
          `/api/returned_citl_revision_suggestion_item/${returnedCITLRevisionSuggestionItemId}`,
          values
        )
        .then(() => {
          alert("Suggestion updated successfully");
        });
    },
  });

  useEffect(() => {
    if (!returnedCITLRevisionSuggestionItem) return;
    formik.setValues({
      actionTaken: returnedCITLRevisionSuggestionItem.actionTaken ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returnedCITLRevisionSuggestionItem]);

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
