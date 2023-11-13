import MainLayout from "@/components/MainLayout";
import useIDDSpecialistSuggestionItemActionTakenIDDSpecialistSuggestionItem from "@/hooks/useIDDSpecialistSuggestionItemActionTakenIDDSpecialistSuggestionItem";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function IDDSpecialistSuggestionItemEditPage() {
  const router = useRouter();
  const iDDSpecialistSuggestionItemId = router.query.id;
  const iDDSpecialistSuggestionItemActionTaken =
    useIDDSpecialistSuggestionItemActionTakenIDDSpecialistSuggestionItem({
      id: iDDSpecialistSuggestionItemId as string,
    });
  const formik = useFormik({
    initialValues: {
      value: "",
    },
    validationSchema: Yup.object({
      value: Yup.string().required(),
    }),
    onSubmit: (values) => {
      if (iDDSpecialistSuggestionItemActionTaken) {
        axios
          .put(
            `/api/idd_specialist_suggestion_item_action_taken/${iDDSpecialistSuggestionItemActionTaken.id}`,
            values
          )
          .then(() => {
            alert("Suggestion updated successfully");
            router.reload();
          });
      } else {
        axios
          .post(`/api/idd_specialist_suggestion_item_action_taken`, {
            iDDSpecialistSuggestionItemId: iDDSpecialistSuggestionItemId,
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
    if (!iDDSpecialistSuggestionItemActionTaken) return;
    formik.setValues({
      value: iDDSpecialistSuggestionItemActionTaken.value ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iDDSpecialistSuggestionItemActionTaken]);

  return (
    <MainLayout>
      <div>
        <h2>IDDSpecialist Review</h2>
        <form noValidate onSubmit={formik.handleSubmit}>
          <textarea placeholder='value' {...formik.getFieldProps("value")} />
          <br />
          <input type='submit' value='Submit' className='border rounded' />
        </form>
      </div>
    </MainLayout>
  );
}
