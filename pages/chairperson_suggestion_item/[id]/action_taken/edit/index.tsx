import MainLayout from "@/components/MainLayout";
import useChairpersonSuggestionItemActionTakenChairpersonSuggestionItem from "@/hooks/useChairpersonSuggestionItemActionTakenChairpersonSuggestionItem";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function ChairpersonSuggestionItemEditPage() {
  const router = useRouter();
  const chairpersonSuggestionItemId = router.query.id;
  const chairpersonSuggestionItemActionTaken =
    useChairpersonSuggestionItemActionTakenChairpersonSuggestionItem({
      id: chairpersonSuggestionItemId as string,
    });
  const formik = useFormik({
    initialValues: {
      value: "",
    },
    validationSchema: Yup.object({
      value: Yup.string().required(),
    }),
    onSubmit: (values) => {
      if (chairpersonSuggestionItemActionTaken) {
        axios
          .put(
            `/api/chairperson_suggestion_item_action_taken/${chairpersonSuggestionItemActionTaken.id}`,
            values
          )
          .then(() => {
            alert("Suggestion updated successfully");
            router.reload();
          });
      } else {
        axios
          .post(`/api/chairperson_suggestion_item_action_taken`, {
            chairpersonSuggestionItemId: chairpersonSuggestionItemId,
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
    if (!chairpersonSuggestionItemActionTaken) return;
    formik.setValues({
      value: chairpersonSuggestionItemActionTaken.value ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chairpersonSuggestionItemActionTaken]);

  return (
    <MainLayout>
      <div>
        <h2>Chairperson Review</h2>
        <form noValidate onSubmit={formik.handleSubmit}>
          <textarea placeholder='value' {...formik.getFieldProps("value")} />
          <br />
          <input type='submit' value='Submit' className='border rounded' />
        </form>
      </div>
    </MainLayout>
  );
}
