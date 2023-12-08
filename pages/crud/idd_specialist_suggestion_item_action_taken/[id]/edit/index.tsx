import CrudLayout from "@/components/CrudLayout";
import useIDDSpecialistSuggestionItemActionTaken from "@/hooks/useIDDSpecialistSuggestionItemActionTaken";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function EditIDDSpecialistSuggestionItemActionTakenPage() {
  const router = useRouter();
  const iDDSpecialistSuggestionItemActionTakenId = router.query.id;
  const iDDSpecialistSuggestionItemActionTaken =
    useIDDSpecialistSuggestionItemActionTaken({
      id: iDDSpecialistSuggestionItemActionTakenId as string,
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
          `/api/idd_specialist_suggestion_item_action_taken/${iDDSpecialistSuggestionItemActionTakenId}`,
          values
        )
        .then(() => {
          alert(
            "IDDSpecialistSuggestionItemActionTaken has been updated successfully"
          );
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });

  useEffect(() => {
    if (!iDDSpecialistSuggestionItemActionTaken) return;
    let subscribe = true;

    formik.setValues({
      value: iDDSpecialistSuggestionItemActionTaken.value,
    });

    return () => {
      subscribe = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iDDSpecialistSuggestionItemActionTaken]);

  return (
    <CrudLayout>
      <h2>Edit IDDSpecialistSuggestionItemActionTaken</h2>

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
