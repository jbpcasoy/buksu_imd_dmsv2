import CrudLayout from "@/components/CrudLayout";
import useContentSpecialistSuggestionItemActionTaken from "@/hooks/useContentSpecialistSuggestionItemActionTaken";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function EditContentSpecialistSuggestionItemActionTakenPage() {
  const router = useRouter();
  const contentSpecialistSuggestionItemActionTakenId = router.query.id;
  const contentSpecialistSuggestionItemActionTaken =
    useContentSpecialistSuggestionItemActionTaken({
      id: contentSpecialistSuggestionItemActionTakenId as string,
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
          `/api/content_specialist_suggestion_item_action_taken/${contentSpecialistSuggestionItemActionTakenId}`,
          values
        )
        .then(() => {
          alert(
            "ContentSpecialistSuggestionItemActionTaken has been updated successfully"
          );
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });

  useEffect(() => {
    if (!contentSpecialistSuggestionItemActionTaken) return;
    let subscribe = true;

    formik.setValues({
      value: contentSpecialistSuggestionItemActionTaken.value,
    });

    return () => {
      subscribe = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentSpecialistSuggestionItemActionTaken]);

  return (
    <CrudLayout>
      <h2>Edit ContentSpecialistSuggestionItemActionTaken</h2>

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
