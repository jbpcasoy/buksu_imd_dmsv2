import MainLayout from "@/components/MainLayout";
import useIDDSpecialistSuggestionItem from "@/hooks/useIDDSpecialistSuggestionItem";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function IDDSpecialistSuggestionItemEditPage() {
  const router = useRouter();
  const iDDSpecialistSuggestionItemId = router.query.id;
  const iDDSpecialistSuggestionItem = useIDDSpecialistSuggestionItem({
    id: iDDSpecialistSuggestionItemId as string,
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
          `/api/idd_specialist_suggestion_item/${iDDSpecialistSuggestionItemId}`,
          values
        )
        .then(() => {
          alert("Suggestion updated successfully");
          router.reload();
        });
    },
  });

  useEffect(() => {
    if (!iDDSpecialistSuggestionItem) return;
    formik.setValues({
      actionTaken: iDDSpecialistSuggestionItem.actionTaken ?? "",
    });
  }, [iDDSpecialistSuggestionItem]);

  return (
    <MainLayout>
      <div>
        <h2>IDD Specialist Review</h2>
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
