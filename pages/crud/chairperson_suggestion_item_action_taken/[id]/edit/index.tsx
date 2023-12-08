import CrudLayout from "@/components/CrudLayout";
import useChairpersonSuggestionItemActionTaken from "@/hooks/useChairpersonSuggestionItemActionTaken";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function EditChairpersonSuggestionItemActionTakenPage() {
  const router = useRouter();
  const chairpersonSuggestionItemActionTakenId = router.query.id;
  const chairpersonSuggestionItemActionTaken =
    useChairpersonSuggestionItemActionTaken({
      id: chairpersonSuggestionItemActionTakenId as string,
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
          `/api/chairperson_suggestion_item_action_taken/${chairpersonSuggestionItemActionTakenId}`,
          values
        )
        .then(() => {
          alert("ChairpersonSuggestionItemActionTaken has been updated successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });

  useEffect(() => {
    if (!chairpersonSuggestionItemActionTaken) return;
    let subscribe = true;

    formik.setValues({
      value: chairpersonSuggestionItemActionTaken.value,
    });

    return () => {
      subscribe = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chairpersonSuggestionItemActionTaken]);

  return (
    <CrudLayout>
      <h2>Edit ChairpersonSuggestionItemActionTaken</h2>

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
