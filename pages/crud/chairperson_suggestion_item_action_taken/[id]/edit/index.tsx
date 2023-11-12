import CrudLayout from "@/components/CrudLayout";
import useChairpersonSuggestionItemActionTaken from "@/hooks/useChairpersonSuggestionItemActionTaken";
import axios from "axios";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

export default function EditChairpersonSuggestionItemActionTakenPage() {
  const router = useRouter();
  const ChairpersonSuggestionItemActionTakenId = router.query.id;
  const ChairpersonSuggestionItemActionTaken = useChairpersonSuggestionItemActionTaken({
    id: ChairpersonSuggestionItemActionTakenId as string,
  });

  const formik = useFormik({
    initialValues: {
      value: "",
      chairpersonSuggestionItemId: "",
    },
    validationSchema: Yup.object({
      value: Yup.string().required(),
      chairpersonSuggestionItemId: Yup.string().required(),
    }),
    onSubmit: (values) => {
      axios
        .put(
          `/api/chairperson_suggestion_item_action_taken/${ChairpersonSuggestionItemActionTakenId}`,
          values
        )
        .then(() => {
          alert("ChairpersonSuggestionItemActionTaken updated successfully");
        })
        .catch((error) => {
          alert(error?.response?.data?.error?.message);
        });
    },
  });

  useEffect(() => {
    if (!ChairpersonSuggestionItemActionTaken) return;
    let subscribe = true;

    formik.setValues({
      value: ChairpersonSuggestionItemActionTaken.value,
      chairpersonSuggestionItemId: ChairpersonSuggestionItemActionTaken.chairpersonSuggestionItemId,
    });

    return () => {
      subscribe = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ChairpersonSuggestionItemActionTaken]);

  return (
    <CrudLayout>
      <h2>Edit ChairpersonSuggestionItemActionTaken</h2>

      <form onSubmit={formik.handleSubmit}>
        <input
          type='text'
          placeholder='chairpersonSuggestionItemId'
          {...formik.getFieldProps("chairpersonSuggestionItemId")}
        />
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
